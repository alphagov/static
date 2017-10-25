describe('A tasklist module', function () {
  "use strict";

  var $element;
  var tasklist;
  var html = '\
    <div data-module="tasklist" class="pub-c-task-list js-hidden">\
      <ol>\
        <li class="pub-c-task-list__step">\
          <span class="pub-c-task-list__number">\
            <span class="visuallyhidden">Step </span>1\
          </span>\
          <div class="pub-c-task-list__section js-section" id="topic-section-one" data-track-count="tasklistSection">\
            <div class="pub-c-task-list__header js-toggle-panel">\
              <h2 class="pub-c-task-list__title js-section-title">Topic Section One</h2>\
              <p class="pub-c-task-list__description">Section 1 description in here</p>\
            </div>\
            <div class="pub-c-task-list__panel js-panel" id="section-panel-10-0">\
              <ol class="pub-c-task-list__panel-links">\
                <li class="pub-c-task-list__panel-link">\
                  <a href="">Link 1</a>\
                </li>\
              </ol>\
            </div>\
          </div>\
          <div class="pub-c-task-list__section js-section" id="topic-section-two" data-track-count="tasklistSection">\
            <div class="pub-c-task-list__header js-toggle-panel">\
              <h2 class="pub-c-task-list__title js-section-title">Topic Section Two</h2>\
              <p class="pub-c-task-list__description">Section 2 description in here</p>\
            </div>\
            <div class="pub-c-task-list__panel js-panel" id="section-panel-11-1">\
              <ol class="pub-c-task-list__panel-links">\
                <li class="pub-c-task-list__panel-link">\
                  <a href="">Link 2</a>\
                </li>\
                <li class="pub-c-task-list__panel-link">\
                  <a href="">Link 3</a>\
                </li>\
              </ol>\
            </div>\
          </div>\
        </li>\
        <li class="pub-c-task-list__step">\
          <span class="pub-c-task-list__number">\
            <span class="visuallyhidden">Step </span>2\
          </span>\
          <div class="pub-c-task-list__section js-section" id="topic-section-one" data-track-count="tasklistSection">\
            <div class="pub-c-task-list__header js-toggle-panel">\
              <h2 class="pub-c-task-list__title js-section-title">Topic Section Three</h2>\
              <p class="pub-c-task-list__description">Section 3 description in here</p>\
            </div>\
            <div class="pub-c-task-list__panel js-panel" id="section-panel-12-0">\
              <ol class="pub-c-task-list__panel-links">\
                <li class="pub-c-task-list__panel-link">\
                  <a href="">Link 4</a>\
                </li>\
                <li class="pub-c-task-list__panel-link">\
                  <a href="">Link 5</a>\
                </li>\
                <li class="pub-c-task-list__panel-link">\
                  <a href="">Link 6</a>\
                </li>\
              </ol>\
            </div>\
          </div>\
        </li>\
      </ol>\
    </div>';

  var expectedTasklistSectionCount = 0;
  var expectedTasklistContentCount = 0;

  beforeEach(function () {
    tasklist = new GOVUK.Modules.Tasklist();
    $element = $(html);
    tasklist.start($element);
    expectedTasklistSectionCount = $element.find('.pub-c-task-list__section').length;
    expectedTasklistContentCount = $element.find('.pub-c-task-list__section').first().find('.pub-c-task-list__panel-link').length;
  });

  afterEach(function () {
    $(document).off();
    location.hash = "#";
  });

  it("has a class of pub-c-task-list--active to indicate the js has loaded", function () {
    expect($element).toHaveClass("pub-c-task-list--active");
  });

  it("is not hidden", function () {
    expect($element).not.toHaveClass("js-hidden");
  });

  it("has an open/close all button", function () {
    var $openCloseAllButton = $element.find('.js-section-controls-button');

    expect($openCloseAllButton).toExist();
    expect($openCloseAllButton).toHaveText("Open all");
    // It has an aria-expanded false attribute as all sections are closed
    expect($openCloseAllButton).toHaveAttr("aria-expanded", "false");
    // It has an aria-controls attribute that includes all the section_content IDs
    expect($openCloseAllButton).toHaveAttr('aria-controls', 'section-panel-10-0');
  });

  it("has no sections which have an open state", function () {
    var openSections = $element.find('.section-is-open').length;
    expect(openSections).toEqual(0);
  });

  it("inserts a button into each section to show/hide content", function () {
    var $titleButton = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');

    expect($titleButton).toHaveClass('pub-c-task-list__button--title');
    expect($titleButton).toHaveAttr('aria-expanded', 'false');
    expect($titleButton[0]).toHaveAttr('aria-controls', 'section-panel-10-0');
    expect($titleButton[1]).toHaveAttr('aria-controls', 'section-panel-11-1');
  });

  it("ensures all section content is hidden", function () {
    $element.find('.pub-c-task-list__section').each(function (index, $section) {
      expect($section).not.toHaveClass('section-is-open');
    });
  });

  it("adds an open/close icon to each section", function () {
    var $sectionHeader = $element.find('.pub-c-task-list__header');
    expect($sectionHeader).toContainElement('.pub-c-task-list__icon');
  });

  describe('Clicking the "Open all" button', function () {
    beforeEach(function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');
      clickOpenCloseAll();
    });

    it('adds a .section-is-open class to each section to hide the icon', function () {
      var sectionCount = $element.find('.pub-c-task-list__section').length;
      expect($element.find('.section-is-open').length).toEqual(sectionCount);
    });

    it('adds an aria-expanded attribute to each section link', function () {
      var sectionCount = $element.find('.pub-c-task-list__section').length;
      expect($element.find('.js-section-title-button[aria-expanded="true"]').length).toEqual(sectionCount);
    });

    it('changes the Open/Close all button text to "Close all"', function () {
      expect($element.find('.js-section-controls-button')).toContainText("Close all");
    });

    it("triggers a google analytics custom event", function () {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistAllOpened', {
        label: 'Open All',
        dimension28: expectedTasklistSectionCount.toString()
      });
    });
  });

  describe('Clicking the "Close all" button', function () {
    it("triggers a google analytics custom event", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      clickOpenCloseAll();
      clickOpenCloseAll();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistAllClosed', {
        label: 'Close All',
        dimension28: expectedTasklistSectionCount.toString()
      });
    });
  });

  describe('Opening a section', function () {

    // When a section is open (testing: toggleSection, openSection)
    it("has a class of section-is-open", function () {
      var $sectionLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      var $section = $element.find('.pub-c-task-list__section');
      $sectionLink.click();
      expect($section).toHaveClass("section-is-open");
    });

    // When a section is open (testing: toggleState, setExpandedState)
    it("has a an aria-expanded attribute and the value is true", function () {
      var $sectionLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $sectionLink.click();
      expect($sectionLink).toHaveAttr('aria-expanded', 'true');
    });

    it("triggers a google analytics custom event when clicking on the title", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $sectionLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $sectionLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Section One - Heading click: Small',
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking on the title on a big tasklist", function () {
      $element.addClass('pub-c-task-list--large');

      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $sectionLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $sectionLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Section One - Heading click: Big',
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking on the icon", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $sectionIcon = $element.find('.pub-c-task-list__icon');
      $sectionIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Section One - Plus click: Small',
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking on the icon on a big tasklist", function () {
      $element.addClass('pub-c-task-list--large');

      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $sectionIcon = $element.find('.pub-c-task-list__icon');
      $sectionIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Section One - Plus click: Big',
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $sectionHeader = $element.find('.pub-c-task-list__header');
      $sectionHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Section One - Elsewhere click: Small',
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header on a big tasklist", function () {
      $element.addClass('pub-c-task-list--large');

      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $sectionHeader = $element.find('.pub-c-task-list__header');
      $sectionHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Section One - Elsewhere click: Big',
        dimension28: expectedTasklistContentCount.toString()
      });
    });
  });

  describe('Closing a section', function () {

    // When a section is closed (testing: toggleSection, closeSection)
    it("removes the section-is-open class", function () {
      var $sectionLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      var $section = $element.find('.pub-c-task-list__section');
      $sectionLink.click();
      expect($section).toHaveClass("section-is-open");
      $sectionLink.click();
      expect($section).not.toHaveClass("section-is-open");
    });

    // When a section is closed (testing: toggleState, setExpandedState)
    it("has a an aria-expanded attribute and the value is false", function () {
      var $sectionLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $sectionLink.click();
      expect($sectionLink).toHaveAttr('aria-expanded', 'true');
      $sectionLink.click();
      expect($sectionLink).toHaveAttr('aria-expanded', 'false');
    });

    it("triggers a google analytics custom event when clicking on the title", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $sectionLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $sectionLink.click();
      $sectionLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Section One - Heading click: Small',
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking on the title on a big tasklist", function () {
      $element.addClass('pub-c-task-list--large');

      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $sectionLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $sectionLink.click();
      $sectionLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Section One - Heading click: Big',
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking on the icon", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $sectionIcon = $element.find('.pub-c-task-list__icon');
      $sectionIcon.click();
      $sectionIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Section One - Minus click: Small',
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking on the icon on a big tasklist", function () {
      $element.addClass('pub-c-task-list--large');

      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $sectionIcon = $element.find('.pub-c-task-list__icon');
      $sectionIcon.click();
      $sectionIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Section One - Minus click: Big',
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      tasklist.start($element);
      var $sectionHeader = $element.find('.pub-c-task-list__header');
      $sectionHeader.click();
      $sectionHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Section One - Elsewhere click: Small',
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header on a big tasklist", function () {
      $element.addClass('pub-c-task-list--large');

      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      tasklist.start($element);
      var $sectionHeader = $element.find('.pub-c-task-list__header');
      $sectionHeader.click();
      $sectionHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Section One - Elsewhere click: Big',
        dimension28: expectedTasklistContentCount.toString()
      });
    });
  });

  describe('When linking to a topic section', function () {
    beforeEach(function () {
      spyOn(GOVUK, 'getCurrentLocation').and.returnValue({
        hash: '#topic-section-one'
      });

      // Restart tasklist after setting up mock location provider
      $element.attr('data-remember',true);
      tasklist.start($element);
    });

    it("opens the linked to topic section", function () {
      var $section = $element.find('#topic-section-one');
      expect($section).toHaveClass('section-is-open');
    });

    it("leaves other sections closed", function () {
      var $section = $element.find('#topic-section-two');
      expect($section).not.toHaveClass('section-is-open');
    });
  });

  function clickOpenCloseAll() {
    $element.find('.js-section-controls-button').click();
  }
});
