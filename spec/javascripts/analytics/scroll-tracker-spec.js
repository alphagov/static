describe("GOVUK.ScrollTracker", function() {
  beforeEach(function() {
    jasmine.clock().install();
    GOVUK.analytics = {trackEvent: function () {}}
    spyOn(GOVUK.analytics, "trackEvent").and.stub();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    $(window).unbind('scroll');
  });

  describe("enabling on correct pages", function() {
    var FIXTURE = "<h1>A heading</h1>";

    beforeEach(function() {
      setFixtures(FIXTURE);
      spyOn(GOVUK.ScrollTracker.HeadingNode.prototype, 'elementIsVisible');
    });

    it("should be enabled on a tracked page", function() {
      var config = {}
      config[window.location.pathname] = [ ['Heading', 'A heading'] ];

      expect( (new GOVUK.ScrollTracker(config)).enabled ).toBeTruthy();
    });

    it("should not be enabled on an untracked page", function() {
      var config = {
        '/some/other/path': [
          ['Heading', 'A heading']
        ]
      };
      expect( (new GOVUK.ScrollTracker(config)).enabled ).toBeFalsy();
    });
  });

  describe("tracking by headings", function() {
    var FIXTURE = "\
      <h1>This is the first <span>heading</span></h1>\
      <h2>This is the second heading</h2>\
      <h4>\
        This is the third&nbsp;heading  \
      </h4>";

    beforeEach(function() {
      setFixtures(FIXTURE);
      spyOn(GOVUK.ScrollTracker.HeadingNode.prototype, 'elementIsVisible');
      var config = buildConfigForThisPath([
        ['Heading', "This is the first heading"],
        ['Heading', "This is the third heading"]
      ]);
      new GOVUK.ScrollTracker(config);
    });

    it("should send an event when the user scrolls so the heading is visible", function() {
      scrollToShowHeadingNumber(1);

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(1);
      expect(GOVUK.analytics.trackEvent.calls.argsFor(0)).toEqual(["ScrollTo", "Heading", {label: "This is the first heading", nonInteraction: true}]);

      scrollToShowHeadingNumber(2);

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(1);

      scrollToShowHeadingNumber(3);

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(2);
      expect(GOVUK.analytics.trackEvent.calls.argsFor(1)).toEqual(["ScrollTo", "Heading", {label: "This is the third heading", nonInteraction: true}]);
    });

    it("should not send duplicate events", function() {
      scrollToShowHeadingNumber(1);
      scrollToShowHeadingNumber(3);
      scrollToShowHeadingNumber(1);

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(2);
    });
  });

  function buildConfigForThisPath(thisPathData) {
    var config = {};
    config[window.location.pathname] = thisPathData;
    return config;
  }

  function scrollToShowHeadingNumber(headingNumber) {
    var elementScrolledTo = $('h1, h2, h3, h4, h5, h6')[headingNumber-1];
    GOVUK.ScrollTracker.HeadingNode.prototype.elementIsVisible.and.callFake(function($element) {
      return ( $element[0] == elementScrolledTo );
    });
    $(window).scroll();
    jasmine.clock().tick(20);
  };
});
