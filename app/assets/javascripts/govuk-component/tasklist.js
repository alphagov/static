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

    var rememberOpenStep = false;
    var taskListSize;

    this.start = function ($element) {

      $(window).unload(storeScrollPosition);

      // Indicate that js has worked
      $element.addClass('pub-c-task-list--active');

      // Prevent FOUC, remove class hiding content
      $element.removeClass('js-hidden');

      rememberOpenStep = !!$element.filter('[data-remember]').length;
      taskListSize = $element.hasClass('pub-c-task-list--large') ? 'Big' : 'Small';
      var $groups = $element.find('.pub-c-task-list__group');
      var $steps = $element.find('.js-step');
      var $stepHeaders = $element.find('.js-toggle-panel');
      var totalSteps = $element.find('.js-panel').length;
      var totalLinks = $element.find('.pub-c-task-list__panel-link-item').length;

      var $openOrCloseAllButton;

      var tasklistTracker = new TasklistTracker(totalSteps, totalLinks);

      addButtonstoSteps();
      addOpenCloseAllButton();
      addIconsToSteps();
      addAriaControlsAttrForOpenCloseAllButton();

      closeAllSteps();
      openLinkedStep();

      bindToggleForSteps(tasklistTracker);
      bindToggleOpenCloseAllButton(tasklistTracker);
      bindComponentLinkClicks(tasklistTracker);

      // When navigating back in browser history to the tasklist, the browser will try to be "clever" and return
      // the user to their previous scroll position. However, since we collapse all but the currently-anchored
      // step, the content length changes and the user is returned to the wrong position (often the footer).
      // In order to correct this behaviour, as the user leaves the page, we anticipate the correct height we wish the
      // user to return to by forcibly scrolling them to that height, which becomes the height the browser will return
      // them to.
      // If we can't find an element to return them to, then reset the scroll to the top of the page. This handles
      // the case where the user has expanded all steps, so they are not returned to a particular step, but
      // still could have scrolled a long way down the page.
      function storeScrollPosition() {
        closeAllSteps();
        var $step = getStepForAnchor();

        document.body.scrollTop = $step && $step.length
          ? $step.offset().top
          : 0;
      }

      function addOpenCloseAllButton() {
        $element.prepend('<div class="pub-c-task-list__controls"><button aria-expanded="false" class="pub-c-task-list__button pub-c-task-list__button--controls js-step-controls-button">' + bulkActions.openAll.buttonText + '</button></div>');
      }

      function addIconsToSteps() {
        $stepHeaders.append('<span class="pub-c-task-list__icon pub-c-task-list__icon--plus"></span>');
        $stepHeaders.append('<span class="pub-c-task-list__icon pub-c-task-list__icon--minus"></span>');
      }

      function addAriaControlsAttrForOpenCloseAllButton() {
        var ariaControlsValue = $element.find('.js-panel').first().attr('id');

        $openOrCloseAllButton = $element.find('.js-step-controls-button');
        $openOrCloseAllButton.attr('aria-controls', ariaControlsValue);
      }

      function closeAllSteps() {
        setAllStepsOpenState(false);
      }

      function setAllStepsOpenState(isOpen) {
        $.each($steps, function () {
          var stepView = new StepView($(this));
          stepView.preventHashUpdate();
          stepView.setIsOpen(isOpen);
        });
      }

      function openLinkedStep() {
        var $step;
        if (rememberOpenStep) {
          $step = getStepForAnchor();
        }
        else {
          $step = $steps.filter('[data-open]');
        }

        if ($step && $step.length) {
          var stepView = new StepView($step);
          stepView.open();
        }
      }

      function getStepForAnchor() {
        var anchor = getActiveAnchor();

        return anchor.length
          ? $element.find('#' + escapeSelector(anchor.substr(1)))
          : null;
      }

      function getActiveAnchor() {
        return GOVUK.getCurrentLocation().hash;
      }

      function addButtonstoSteps() {
        $.each($steps, function () {
          var $step = $(this);
          var $title = $step.find('.js-step-title');
          var contentId = $step.find('.js-panel').first().attr('id');

          $title.wrapInner(
            '<button ' +
            'class="pub-c-task-list__button pub-c-task-list__button--title js-step-title-button" ' +
            'aria-expanded="false" aria-controls="' + contentId + '">' +
            '</button>' );
        });
      }

      function bindToggleForSteps(tasklistTracker) {
        $element.find('.js-toggle-panel').click(function (event) {
          preventLinkFollowingForCurrentTab(event);

          var stepView = new StepView($(this).closest('.js-step'));
          stepView.toggle();

          var toggleClick = new StepToggleClick(event, stepView, $steps, tasklistTracker, $groups);
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
        $openOrCloseAllButton = $element.find('.js-step-controls-button');
        $openOrCloseAllButton.on('click', function () {
          var shouldOpenAll;

          if ($openOrCloseAllButton.text() == bulkActions.openAll.buttonText) {
            $openOrCloseAllButton.text(bulkActions.closeAll.buttonText);
            shouldOpenAll = true;

            tasklistTracker.track('pageElementInteraction', 'tasklistAllOpened', {
              label: bulkActions.openAll.eventLabel + ": " + taskListSize
            });
          } else {
            $openOrCloseAllButton.text(bulkActions.openAll.buttonText);
            shouldOpenAll = false;

            tasklistTracker.track('pageElementInteraction', 'tasklistAllClosed', {
              label: bulkActions.closeAll.eventLabel + ": " + taskListSize
            });
          }

          setAllStepsOpenState(shouldOpenAll);
          $openOrCloseAllButton.attr('aria-expanded', shouldOpenAll);
          setOpenCloseAllText();
          setHash(null);

          return false;
        });
      }

      function setOpenCloseAllText() {
        var openSteps = $element.find('.step-is-open').length;
        // Find out if the number of is-opens == total number of steps
        if (openSteps === totalSteps) {
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

    function StepView($stepElement) {
      var $titleLink = $stepElement.find('.js-step-title-button');
      var $stepContent = $stepElement.find('.js-panel');
      var shouldUpdateHash = rememberOpenStep;

      this.title = $stepElement.find('.js-step-title').text();
      this.href = $titleLink.attr('href');
      this.element = $stepElement;

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
        $stepElement.toggleClass('step-is-open', isOpen);
        $stepContent.toggleClass('js-hidden', !isOpen);
        $titleLink.attr("aria-expanded", isOpen);

        if (shouldUpdateHash) {
          updateHash($stepElement);
        }
      }

      function isOpen() {
        return $stepElement.hasClass('step-is-open');
      }

      function isClosed() {
        return !isOpen();
      }

      function preventHashUpdate() {
        shouldUpdateHash = false;
      }

      function numberOfContentItems() {
        return $stepContent.find('.pub-c-task-list__panel-link').length;
      }
    }

    function updateHash($stepElement) {
      var stepView = new StepView($stepElement);
      var hash = stepView.isOpen() && '#' + $stepElement.attr('id');
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

    function StepToggleClick(event, stepView, $steps, tasklistTracker, $groups) {
      this.track = trackClick;
      var $target = $(event.target);
      var $thisGroup = stepView.element.closest('.pub-c-task-list__group');
      var $thisGroupSteps = $thisGroup.find('.pub-c-task-list__step');

      function trackClick() {
        var tracking_options = {label: trackingLabel(), dimension28: stepView.numberOfContentItems().toString()}
        tasklistTracker.track('pageElementInteraction', trackingAction(), tracking_options);

        if (!stepView.isClosed()) {
          tasklistTracker.track(
            'tasklistLinkClicked',
            String(stepIndex()),
            {
              label: stepView.href,
              dimension28: String(stepView.numberOfContentItems()),
              dimension29: stepView.title
            }
          )
        }
      }

      function trackingLabel() {
        return $target.closest('.js-toggle-panel').attr('data-position') + ' - ' + stepView.title + ' - ' + locateClickElement() + ": " + taskListSize;
      }

      // returns index of the clicked step in the overall number of accordion steps, regardless of how many per group
      function stepIndex() {
        return $steps.index(stepView.element) + 1;
      }

      function trackingAction() {
        return (stepView.isClosed() ? 'tasklistClosed' : 'tasklistOpened');
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
        return $target.hasClass('js-step-title-button');
      }

      function iconType() {
        return (stepView.isClosed() ? 'Minus' : 'Plus');
      }
    }

    function componentLinkClick(event, tasklistTracker, linkPosition) {
      this.track = trackClick;

      function trackClick() {
        var tracking_options = {label: $(event.target).attr('href') + " : " + taskListSize, dimension28: $(event.target).closest('.pub-c-task-list__panel-links').attr('data-length')};
        tasklistTracker.track('taskAccordionLinkClicked', linkPosition, tracking_options);
      }
    }

    // A helper that sends a custom event request to Google Analytics if
    // the GOVUK module is setup
    function TasklistTracker(totalSteps, totalLinks) {
      this.track = function(category, action, options) {
        // dimension26 records the total number of expand/collapse steps in this tasklist
        // dimension27 records the total number of component links in this tasklist
        // dimension28 records the number of component links in the step that was opened/closed (handled in click event)
        if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
          options = options || {};
          options["dimension26"] = options["dimension26"] || totalSteps.toString();
          options["dimension27"] = options["dimension27"] || totalLinks.toString();
          GOVUK.analytics.trackEvent(category, action, options);
        }
      }
    }
  };
})(window.GOVUK.Modules);
