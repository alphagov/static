// Most of this is originally from the service manual but has changed considerably since then

(function (Modules) {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  Modules.Tasklist = function () {

    var bulkActions = {
      openAll: {
        buttonText: "Open all",
        eventLabel: "Open All"
      },
      closeAll: {
        buttonText: "Close all",
        eventLabel: "Close All"
      }
    };

    var rememberOpenSection = false;
    var taskListSize;

    this.start = function ($element) {

      $(window).unload(storeScrollPosition);

      // Indicate that js has worked
      $element.addClass('pub-c-task-list--active');

      // Prevent FOUC, remove class hiding content
      $element.removeClass('js-hidden');

      rememberOpenSection = !!$element.filter('[data-remember]').length;
      taskListSize = $element.hasClass('pub-c-task-list--large') ? 'Big' : 'Small';
      var $steps = $element.find('.pub-c-task-list__step');
      var $sections = $element.find('.js-section');
      var $sectionHeaders = $element.find('.js-toggle-panel');
      var totalSections = $element.find('.js-panel').length;
      var totalLinks = $element.find('.pub-c-task-list__panel-link-item').length;

      var $openOrCloseAllButton;

      var tasklistTracker = new TasklistTracker(totalSections, totalLinks);

      addButtonstoSections();
      addOpenCloseAllButton();
      addIconsToSections();
      addAriaControlsAttrForOpenCloseAllButton();

      closeAllSections();
      openLinkedSection();

      bindToggleForSections(tasklistTracker);
      bindToggleOpenCloseAllButton(tasklistTracker);
      bindComponentLinkClicks(tasklistTracker);

      // When navigating back in browser history to the tasklist, the browser will try to be "clever" and return
      // the user to their previous scroll position. However, since we collapse all but the currently-anchored
      // section, the content length changes and the user is returned to the wrong position (often the footer).
      // In order to correct this behaviour, as the user leaves the page, we anticipate the correct height we wish the
      // user to return to by forcibly scrolling them to that height, which becomes the height the browser will return
      // them to.
      // If we can't find an element to return them to, then reset the scroll to the top of the page. This handles
      // the case where the user has expanded all sections, so they are not returned to a particular section, but
      // still could have scrolled a long way down the page.
      function storeScrollPosition() {
        closeAllSections();
        var $section = getSectionForAnchor();

        document.body.scrollTop = $section && $section.length
          ? $section.offset().top
          : 0;
      }

      function addOpenCloseAllButton() {
        $element.prepend('<div class="pub-c-task-list__controls"><button aria-expanded="false" class="pub-c-task-list__button pub-c-task-list__button--controls js-section-controls-button">' + bulkActions.openAll.buttonText + '</button></div>');
      }

      function addIconsToSections() {
        $sectionHeaders.append('<span class="pub-c-task-list__icon pub-c-task-list__icon--plus"></span>');
        $sectionHeaders.append('<span class="pub-c-task-list__icon pub-c-task-list__icon--minus"></span>');
      }

      function addAriaControlsAttrForOpenCloseAllButton() {
        var ariaControlsValue = $element.find('.js-panel').first().attr('id');

        $openOrCloseAllButton = $element.find('.js-section-controls-button');
        $openOrCloseAllButton.attr('aria-controls', ariaControlsValue);
      }

      function closeAllSections() {
        setAllSectionsOpenState(false);
      }

      function setAllSectionsOpenState(isOpen) {
        $.each($sections, function () {
          var sectionView = new SectionView($(this));
          sectionView.preventHashUpdate();
          sectionView.setIsOpen(isOpen);
        });
      }

      function openLinkedSection() {
        var $section;
        if (rememberOpenSection) {
          $section = getSectionForAnchor();
        }
        else {
          $section = $sections.filter('[data-open]');
        }

        if ($section && $section.length) {
          var sectionView = new SectionView($section);
          sectionView.open();
        }
      }

      function getSectionForAnchor() {
        var anchor = getActiveAnchor();

        return anchor.length
          ? $element.find('#' + escapeSelector(anchor.substr(1)))
          : null;
      }

      function getActiveAnchor() {
        return GOVUK.getCurrentLocation().hash;
      }

      function addButtonstoSections() {
        $.each($sections, function () {
          var $section = $(this);
          var $title = $section.find('.js-section-title');
          var contentId = $section.find('.js-panel').first().attr('id');

          $title.wrapInner(
            '<button ' +
            'class="pub-c-task-list__button pub-c-task-list__button--title js-section-title-button" ' +
            'aria-expanded="false" aria-controls="' + contentId + '">' +
            '</button>' );
        });
      }

      function bindToggleForSections(tasklistTracker) {
        $element.find('.js-toggle-panel').click(function (event) {
          preventLinkFollowingForCurrentTab(event);

          var sectionView = new SectionView($(this).closest('.js-section'));
          sectionView.toggle();

          var toggleClick = new SectionToggleClick(event, sectionView, $sections, tasklistTracker, $steps);
          toggleClick.track();

          setOpenCloseAllText();
        });
      }

      // tracking click events on panel links
      function bindComponentLinkClicks(tasklistTracker) {
        $element.find('.js-panel-link').click(function (event) {
          var linkClick = new componentLinkClick(event, tasklistTracker, $(this).attr('data-position'));
          linkClick.track();
        });
      }

      function preventLinkFollowingForCurrentTab(event) {
        // If the user is holding the ⌘ or Ctrl key, they're trying
        // to open the link in a new window, so let the click happen
        if (event.metaKey || event.ctrlKey) {
          return;
        }

        event.preventDefault();
      }

      function bindToggleOpenCloseAllButton(tasklistTracker) {
        $openOrCloseAllButton = $element.find('.js-section-controls-button');
        $openOrCloseAllButton.on('click', function () {
          var shouldOpenAll;

          if ($openOrCloseAllButton.text() == bulkActions.openAll.buttonText) {
            $openOrCloseAllButton.text(bulkActions.closeAll.buttonText);
            shouldOpenAll = true;

            tasklistTracker.track('pageElementInteraction', 'tasklistAllOpened', {
              label: bulkActions.openAll.eventLabel
            });
          } else {
            $openOrCloseAllButton.text(bulkActions.openAll.buttonText);
            shouldOpenAll = false;

            tasklistTracker.track('pageElementInteraction', 'tasklistAllClosed', {
              label: bulkActions.closeAll.eventLabel
            });
          }

          setAllSectionsOpenState(shouldOpenAll);
          $openOrCloseAllButton.attr('aria-expanded', shouldOpenAll);
          setOpenCloseAllText();
          setHash(null);

          return false;
        });
      }

      function setOpenCloseAllText() {
        var openSections = $element.find('.section-is-open').length;
        // Find out if the number of is-opens == total number of sections
        if (openSections === totalSections) {
          $openOrCloseAllButton.text(bulkActions.closeAll.buttonText);
        } else {
          $openOrCloseAllButton.text(bulkActions.openAll.buttonText);
        }
      }

      // Ideally we'd use jQuery.escapeSelector, but this is only available from v3
      // See https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/src/selector-native.js#L46
      function escapeSelector(s) {
        var cssMatcher = /([\x00-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
        return s.replace(cssMatcher, "\\$&");
      }
    };

    function SectionView($sectionElement) {
      var $titleLink = $sectionElement.find('.js-section-title-button');
      var $sectionContent = $sectionElement.find('.js-panel');
      var shouldUpdateHash = rememberOpenSection;

      this.title = $sectionElement.find('.js-section-title').text();
      this.href = $titleLink.attr('href');
      this.element = $sectionElement;

      this.open = open;
      this.close = close;
      this.toggle = toggle;
      this.setIsOpen = setIsOpen;
      this.isOpen = isOpen;
      this.isClosed = isClosed;
      this.preventHashUpdate = preventHashUpdate;
      this.numberOfContentItems = numberOfContentItems;

      function open() {
        setIsOpen(true);
      }

      function close() {
        setIsOpen(false);
      }

      function toggle() {
        setIsOpen(isClosed());
      }

      function setIsOpen(isOpen) {
        $sectionElement.toggleClass('section-is-open', isOpen);
        $sectionContent.toggleClass('js-hidden', !isOpen);
        $titleLink.attr("aria-expanded", isOpen);

        if (shouldUpdateHash) {
          updateHash($sectionElement);
        }
      }

      function isOpen() {
        return $sectionElement.hasClass('section-is-open');
      }

      function isClosed() {
        return !isOpen();
      }

      function preventHashUpdate() {
        shouldUpdateHash = false;
      }

      function numberOfContentItems() {
        return $sectionContent.find('.pub-c-task-list__panel-link').length;
      }
    }

    function updateHash($sectionElement) {
      var sectionView = new SectionView($sectionElement);
      var hash = sectionView.isOpen() && '#' + $sectionElement.attr('id');
      setHash(hash)
    }

    // Sets the hash for the page. If a falsy value is provided, the hash is cleared.
    function setHash(hash) {
      if (!GOVUK.support.history()) {
        return;
      }

      var newLocation = hash || GOVUK.getCurrentLocation().pathname;
      history.replaceState({}, '', newLocation);
    }

    function SectionToggleClick(event, sectionView, $sections, tasklistTracker, $steps) {
      this.track = trackClick;
      var $target = $(event.target);
      var $thisStep = sectionView.element.closest('.pub-c-task-list__step');
      var $thisStepSections = $thisStep.find('.pub-c-task-list__section');

      function trackClick() {
        var tracking_options = {label: trackingLabel(), dimension28: sectionView.numberOfContentItems().toString()}
        tasklistTracker.track('pageElementInteraction', trackingAction(), tracking_options);

        if (!sectionView.isClosed()) {
          tasklistTracker.track(
            'tasklistLinkClicked',
            String(sectionIndex()),
            {
              label: sectionView.href,
              dimension28: String(sectionView.numberOfContentItems()),
              dimension29: sectionView.title
            }
          )
        }
      }

      function trackingLabel() {
        return stepIndex() + '.' + accordionIndex() + ' - ' + sectionView.title + ' - ' + locateClickElement() + ": " + taskListSize;
      }

      // needs to return which step we're in
      function stepIndex() {
        return $steps.index($thisStep) + 1;
      }

      function accordionIndex() {
        return $thisStepSections.index(sectionView.element) + 1;
      }

      // returns index of the clicked section in the overall number of accordion sections, regardless of how many per step
      function sectionIndex() {
        return $sections.index(sectionView.element) + 1;
      }

      function trackingAction() {
        return (sectionView.isClosed() ? 'tasklistClosed' : 'tasklistOpened');
      }

      function locateClickElement() {
        if (clickedOnIcon()) {
          return iconType() + ' click';
        } else if (clickedOnHeading()) {
          return 'Heading click';
        } else {
          return 'Elsewhere click';
        }
      }

      function clickedOnIcon() {
        return $target.hasClass('pub-c-task-list__icon');
      }

      function clickedOnHeading() {
        return $target.hasClass('js-section-title-button');
      }

      function iconType() {
        return (sectionView.isClosed() ? 'Minus' : 'Plus');
      }
    }

    function componentLinkClick(event, tasklistTracker, linkPosition) {
      this.track = trackClick;

      function trackClick() {
        var tracking_options = {label: $(event.target).attr('href'), dimension28: $(event.target).closest('.pub-c-task-list__panel-links').attr('data-length')};
        tasklistTracker.track('taskAccordionLinkClicked', linkPosition, tracking_options);
      }
    }

    // A helper that sends a custom event request to Google Analytics if
    // the GOVUK module is setup
    function TasklistTracker(totalSections, totalLinks) {
      this.track = function(category, action, options) {
        // dimension26 records the total number of expand/collapse sections in this tasklist
        // dimension27 records the total number of component links in this tasklist
        // dimension28 records the number of component links in the section that was opened/closed (handled in click event)
        if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
          options = options || {};
          options["dimension26"] = options["dimension26"] || totalSections.toString();
          options["dimension27"] = options["dimension27"] || totalLinks.toString();
          GOVUK.analytics.trackEvent(category, action, options);
        }
      }
    }
  };
})(window.GOVUK.Modules);
