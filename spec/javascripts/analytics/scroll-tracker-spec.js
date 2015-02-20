describe("GOVUK.ScrollTracker", function() {
  beforeEach(function() {
    jasmine.clock().install();
    spyOn(GOVUK.analytics, "trackEvent").and.stub();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    $(window).unbind('scroll');
  });

  describe("enabling on correct pages", function() {
    it("should be enabled on a tracked page", function() {
      var config = {}
      config[window.location.pathname] = [ ['Percent', 50] ];

      expect( (new GOVUK.ScrollTracker(config)).enabled ).toBeTruthy();
    });

    it("should not be enabled on an untracked page", function() {
      var config = {
        '/some/other/path': [
          ['Percent', 50]
        ]
      };
      expect( (new GOVUK.ScrollTracker(config)).enabled ).toBeFalsy();
    });
  });

  describe("tracking by scrolled percentage", function() {
    beforeEach(function() {
      spyOn(GOVUK.ScrollTracker.PercentNode.prototype, "currentScrollPercent");
    });

    it("should send an event when the page scrolls to >= the percentage specified", function() {
      var config = buildConfigForThisPath([
        ['Percent', 25],
        ['Percent', 50],
        ['Percent', 75]
      ]);
      new GOVUK.ScrollTracker(config);

      scrollToPercent(60);

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(2);
      expect(GOVUK.analytics.trackEvent.calls.argsFor(0)).toEqual(["ScrollTo", "Percent", "25", 0, true]);
      expect(GOVUK.analytics.trackEvent.calls.argsFor(1)).toEqual(["ScrollTo", "Percent", "50", 0, true]);
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
    });

    it("should send an event when the user scrolls so the heading is visible", function() {
      var config = buildConfigForThisPath([
        ['Heading', "This is the first heading"],
        ['Heading', "This is the third heading"]
      ]);
      new GOVUK.ScrollTracker(config);

      scrollToShowHeadingNumber(1);

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(1);
      expect(GOVUK.analytics.trackEvent.calls.argsFor(0)).toEqual(["ScrollTo", "Heading", "This is the first heading", 0, true]);

      scrollToShowHeadingNumber(2);

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(1);

      scrollToShowHeadingNumber(3);

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(2);
      expect(GOVUK.analytics.trackEvent.calls.argsFor(1)).toEqual(["ScrollTo", "Heading", "This is the third heading", 0, true]);
    });
  });

  it("should not send duplicate events", function() {
    spyOn(GOVUK.ScrollTracker.PercentNode.prototype, "currentScrollPercent");

    var config = buildConfigForThisPath([
      ['Percent', 25]
    ]);
    new GOVUK.ScrollTracker(config);

    scrollToPercent(30);
    scrollToPercent(35);
    expect(GOVUK.analytics.trackEvent.calls.count()).toBe(1);
  });


  function buildConfigForThisPath(thisPathData) {
    var config = {};
    config[window.location.pathname] = thisPathData;
    return config;
  }

  function scrollToPercent(percent) {
    GOVUK.ScrollTracker.PercentNode.prototype.currentScrollPercent.and.returnValue(percent);
    $(window).scroll();
    jasmine.clock().tick(510);
  };

  function scrollToShowHeadingNumber(headingNumber) {
    var elementScrolledTo = $('h1, h2, h3, h4, h5, h6')[headingNumber-1];
    GOVUK.ScrollTracker.HeadingNode.prototype.elementIsVisible.and.callFake(function($element) {
      return ( $element[0] == elementScrolledTo );
    });
    $(window).scroll();
    jasmine.clock().tick(510);
  };
});
