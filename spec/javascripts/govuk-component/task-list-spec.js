describe('A tasklist module', function () {
  "use strict";

  var $element;
  var tasklist;
  var html = '\
    <div data-module="tasklist" class="pub-c-task-list js-hidden">\
      <ol class="pub-c-task-list__groups">\
        <li class="pub-c-task-list__group">\
          <span class="pub-c-task-list__number">\
            <span class="visuallyhidden">Step </span>1\
          </span>\
          <div class="pub-c-task-list__step js-step" id="topic-step-one" data-track-count="tasklistStep">\
            <div class="pub-c-task-list__header js-toggle-panel" data-position="1.1">\
              <h2 class="pub-c-task-list__title js-step-title">Topic Step One</h2>\
              <p class="pub-c-task-list__description">Step 1 description in here</p>\
            </div>\
            <div class="pub-c-task-list__panel js-panel" id="step-panel-10-0">\
              <ol class="pub-c-task-list__panel-links" data-length="1">\
                <li class="pub-c-task-list__panel-link">\
                  <a href="/link1" class="pub-c-task-list__panel-link-item js-panel-link" data-position="1.1.1">Link 1</a>\
                </li>\
              </ol>\
            </div>\
          </div>\
          <div class="pub-c-task-list__step js-step" id="topic-step-two" data-track-count="tasklistStep">\
            <div class="pub-c-task-list__header js-toggle-panel" data-position="1.2">\
              <h2 class="pub-c-task-list__title js-step-title">Topic Step Two</h2>\
              <p class="pub-c-task-list__description">Step 2 description in here</p>\
            </div>\
            <div class="pub-c-task-list__panel js-panel" id="step-panel-11-1">\
              <ol class="pub-c-task-list__panel-links" data-length="2">\
                <li class="pub-c-task-list__panel-link">\
                  <a href="/link2" class="pub-c-task-list__panel-link-item js-panel-link" data-position="1.2.1">Link 2</a>\
                </li>\
                <li class="pub-c-task-list__panel-link">\
                  <a href="/link3" class="pub-c-task-list__panel-link-item js-panel-link" data-position="1.2.2">Link 3</a>\
                </li>\
              </ol>\
            </div>\
          </div>\
        </li>\
        <li class="pub-c-task-list__group">\
          <span class="pub-c-task-list__number">\
            <span class="visuallyhidden">Step </span>2\
          </span>\
          <div class="pub-c-task-list__step js-step" id="topic-step-one" data-track-count="tasklistStep">\
            <div class="pub-c-task-list__header js-toggle-panel" data-position="2.1">\
              <h2 class="pub-c-task-list__title js-step-title">Topic Step Three</h2>\
              <p class="pub-c-task-list__description">Step 3 description in here</p>\
            </div>\
            <div class="pub-c-task-list__panel js-panel" id="step-panel-12-0">\
              <ol class="pub-c-task-list__panel-links" data-length="3">\
                <li class="pub-c-task-list__panel-link">\
                  <a href="/link4" class="pub-c-task-list__panel-link-item js-panel-link" data-position="2.1.1">Link 4</a>\
                </li>\
                <li class="pub-c-task-list__panel-link">\
                  <a href="/link5" class="pub-c-task-list__panel-link-item js-panel-link" data-position="2.1.2">Link 5</a>\
                </li>\
                <li class="pub-c-task-list__panel-link">\
                  <a href="/link6" class="pub-c-task-list__panel-link-item js-panel-link" data-position="2.1.3">Link 6</a>\
                </li>\
              </ol>\
            </div>\
          </div>\
        </li>\
      </ol>\
    </div>';

  var expectedTasklistStepCount = 0;
  var expectedTasklistContentCount = 0;
  var expectedTasklistLinkCount = 0;

  beforeEach(function () {
    tasklist = new GOVUK.Modules.Tasklist();
    $element = $(html);
    tasklist.start($element);
    expectedTasklistStepCount = $element.find('.pub-c-task-list__step').length;
    expectedTasklistContentCount = $element.find('.pub-c-task-list__step').first().find('.pub-c-task-list__panel-link').length;
    expectedTasklistLinkCount = $element.find('.pub-c-task-list__panel-link-item').length;
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
    var $openCloseAllButton = $element.find('.js-step-controls-button');

    expect($openCloseAllButton).toExist();
    expect($openCloseAllButton).toHaveText("Open all");
    // It has an aria-expanded false attribute as all steps are closed
    expect($openCloseAllButton).toHaveAttr("aria-expanded", "false");
    // It has an aria-controls attribute that includes all the step_content IDs
    expect($openCloseAllButton).toHaveAttr('aria-controls', 'step-panel-10-0');
  });

  it("has no steps which have an open state", function () {
    var openSteps = $element.find('.step-is-open').length;
    expect(openSteps).toEqual(0);
  });

  it("inserts a button into each step to show/hide content", function () {
    var $titleButton = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');

    expect($titleButton).toHaveClass('pub-c-task-list__button--title');
    expect($titleButton).toHaveAttr('aria-expanded', 'false');
    expect($titleButton[0]).toHaveAttr('aria-controls', 'step-panel-10-0');
    expect($titleButton[1]).toHaveAttr('aria-controls', 'step-panel-11-1');
  });

  it("ensures all step content is hidden", function () {
    $element.find('.pub-c-task-list__step').each(function (index, $step) {
      expect($step).not.toHaveClass('step-is-open');
    });
  });

  it("adds an open/close icon to each step", function () {
    var $stepHeader = $element.find('.pub-c-task-list__header');
    expect($stepHeader).toContainElement('.pub-c-task-list__icon');
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

    it('adds a .step-is-open class to each step to hide the icon', function () {
      var stepCount = $element.find('.pub-c-task-list__step').length;
      expect($element.find('.step-is-open').length).toEqual(stepCount);
    });

    it('adds an aria-expanded attribute to each step link', function () {
      var stepCount = $element.find('.pub-c-task-list__step').length;
      expect($element.find('.js-step-title-button[aria-expanded="true"]').length).toEqual(stepCount);
    });

    it('changes the Open/Close all button text to "Close all"', function () {
      expect($element.find('.js-step-controls-button')).toContainText("Close all");
    });

    it("triggers a google analytics custom event", function () {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistAllOpened', {
        label: 'Open All',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString()
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
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString()
      });
    });
  });

  describe('Opening a step', function () {

    // When a step is open (testing: toggleStep, openStep)
    it("has a class of step-is-open", function () {
      var $stepLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      var $step = $element.find('.pub-c-task-list__step');
      $stepLink.click();
      expect($step).toHaveClass("step-is-open");
    });

    // When a step is open (testing: toggleState, setExpandedState)
    it("has a an aria-expanded attribute and the value is true", function () {
      var $stepLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $stepLink.click();
      expect($stepLink).toHaveAttr('aria-expanded', 'true');
    });

    it("triggers a google analytics custom event when clicking on the title", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Step One - Heading click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking on the icon", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepIcon = $element.find('.pub-c-task-list__icon');
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Step One - Plus click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepHeader = $element.find('.pub-c-task-list__header');
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Step One - Elsewhere click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });
  });

  describe('Closing a step', function () {

    // When a step is closed (testing: toggleStep, closeStep)
    it("removes the step-is-open class", function () {
      var $stepLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      var $step = $element.find('.pub-c-task-list__step');
      $stepLink.click();
      expect($step).toHaveClass("step-is-open");
      $stepLink.click();
      expect($step).not.toHaveClass("step-is-open");
    });

    // When a step is closed (testing: toggleState, setExpandedState)
    it("has a an aria-expanded attribute and the value is false", function () {
      var $stepLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $stepLink.click();
      expect($stepLink).toHaveAttr('aria-expanded', 'true');
      $stepLink.click();
      expect($stepLink).toHaveAttr('aria-expanded', 'false');
    });

    it("triggers a google analytics custom event when clicking on the title", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $stepLink.click();
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Step One - Heading click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking on the icon", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepIcon = $element.find('.pub-c-task-list__icon');
      $stepIcon.click();
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Step One - Minus click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
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
      var $stepHeader = $element.find('.pub-c-task-list__header');
      $stepHeader.click();
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Step One - Elsewhere click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });
  });

  describe('When linking to a topic step', function () {
    beforeEach(function () {
      spyOn(GOVUK, 'getCurrentLocation').and.returnValue({
        hash: '#topic-step-one'
      });

      // Restart tasklist after setting up mock location provider
      $element.attr('data-remember',true);
      tasklist.start($element);
    });

    it("opens the linked to topic step", function () {
      var $step = $element.find('#topic-step-one');
      expect($step).toHaveClass('step-is-open');
    });

    it("leaves other steps closed", function () {
      var $step = $element.find('#topic-step-two');
      expect($step).not.toHaveClass('step-is-open');
    });
  });

  describe('When tracking a big task list', function () {
    beforeEach(function () {
      tasklist = new GOVUK.Modules.Tasklist();
      $element = $(html);
      $element.addClass('pub-c-task-list--large');
      tasklist.start($element);
    });

    it("triggers a google analytics custom event when clicking on the title on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Step One - Heading click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking on the icon on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepIcon = $element.find('.pub-c-task-list__icon');
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Step One - Plus click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepHeader = $element.find('.pub-c-task-list__header');
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistOpened', {
        label: '1.1 - Topic Step One - Elsewhere click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when closing by clicking on the title on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepLink = $element.find('.pub-c-task-list__header .pub-c-task-list__button--title');
      $stepLink.click();
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Step One - Heading click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });


    it("triggers a google analytics custom event when closing by clicking on the icon on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepIcon = $element.find('.pub-c-task-list__icon');
      $stepIcon.click();
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Step One - Minus click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when closing by clicking in space in the header on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      tasklist.start($element);
      var $stepHeader = $element.find('.pub-c-task-list__header');
      $stepHeader.click();
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistClosed', {
        label: '1.1 - Topic Step One - Elsewhere click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });
  });

  it("triggers a google analytics event when clicking a panel link", function () {
    GOVUK.analytics = {
      trackEvent: function () {
      }
    };
    spyOn(GOVUK.analytics, 'trackEvent');

    var $panelLink = $element.find('.js-panel-link').first();
    $panelLink.click();

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('taskAccordionLinkClicked', '1.1.1', {
      label: '/link1',
      dimension26: expectedTasklistStepCount.toString(),
      dimension27: expectedTasklistLinkCount.toString(),
      dimension28: expectedTasklistContentCount.toString()
    });
  });

  function clickOpenCloseAll() {
    $element.find('.js-step-controls-button').click();
  }
});
