describe("GOVUK.ScrollTracker", function() {
  beforeEach(function() {
    jasmine.clock().install();
    spyOn(GOVUK, "sendToAnalytics").and.stub();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    $(window).unbind('scroll');
  });

  describe("enabling on correct pages", function() {
    it("should be enabled on a tracked page", function() {
      var config = {}
      config[window.location.pathname] = [ ['Percent', 50] ];

      expect( (new GOVUK.Analytics.ScrollTracker(config)).enabled ).toBeTruthy();
    });

    it("should not be enabled on an untracked page", function() {
      var config = {
        '/some/other/path': [
          ['Percent', 50]
        ]
      };
      expect( (new GOVUK.Analytics.ScrollTracker(config)).enabled ).toBeFalsy();
    });
  });

  describe("tracking by scrolled percentage", function() {
    beforeEach(function() {
      spyOn(GOVUK.Analytics.ScrollTracker.PercentNode.prototype, "currentScrollPercent");
    });

    it("should send an event when the page scrolls to >= the percentage specified", function() {
      var config = buildConfigForThisPath([
        ['Percent', 25],
        ['Percent', 50],
        ['Percent', 75]
      ]);
      new GOVUK.Analytics.ScrollTracker(config);

      scrollToPercent(60);

      expect(GOVUK.sendToAnalytics.calls.count()).toBe(2);
      expect(GOVUK.sendToAnalytics.calls.argsFor(0)).toEqual([ ["_trackEvent", "ScrollTo", "Percent", "25"] ]);
      expect(GOVUK.sendToAnalytics.calls.argsFor(1)).toEqual([ ["_trackEvent", "ScrollTo", "Percent", "50"] ]);
    });
  });

  describe("tracking by headings", function() {
    var FIXTURE = "\
      <h1>This is the first <span>heading</span></h1>\
      <h2>This is the second heading</h2>\
      <h4>
        This is the third&nbsp;heading  \
      </h4>";

    beforeEach(function() {
      setFixtures(FIXTURE);
      spyOn(GOVUK.Analytics.ScrollTracker.HeadingNode.prototype, 'elementIsVisible');
    });

    it("should send an event when the user scrolls so the heading is visible", function() {
      var config = buildConfigForThisPath([
        ['Heading', "This is the first heading"],
        ['Heading', "This is the third heading"]
      ]);
      new GOVUK.Analytics.ScrollTracker(config);

      scrollToShowHeadingNumber(1);

      expect(GOVUK.sendToAnalytics.calls.count()).toBe(1);
      expect(GOVUK.sendToAnalytics.calls.argsFor(0)).toEqual([ ["_trackEvent", "ScrollTo", "Heading", "This is the first heading"] ]);

      scrollToShowHeadingNumber(2);

      expect(GOVUK.sendToAnalytics.calls.count()).toBe(1);

      scrollToShowHeadingNumber(3);

      expect(GOVUK.sendToAnalytics.calls.count()).toBe(2);
      expect(GOVUK.sendToAnalytics.calls.argsFor(1)).toEqual([ ["_trackEvent", "ScrollTo", "Heading", "This is the third heading"] ]);
    });
  });

  it("should not send duplicate events", function() {
    spyOn(GOVUK.Analytics.ScrollTracker.PercentNode.prototype, "currentScrollPercent");

    var config = buildConfigForThisPath([
      ['Percent', 25]
    ]);
    new GOVUK.Analytics.ScrollTracker(config);

    scrollToPercent(30);
    scrollToPercent(35);
    expect(GOVUK.sendToAnalytics.calls.count()).toBe(1);
  });


  function buildConfigForThisPath(thisPathData) {
    var config = {};
    config[window.location.pathname] = thisPathData;
    return config;
  }

  function scrollToPercent(percent) {
    GOVUK.Analytics.ScrollTracker.PercentNode.prototype.currentScrollPercent.and.returnValue(percent);
    $(window).scroll();
    jasmine.clock().tick(510);
  };

  function scrollToShowHeadingNumber(headingNumber) {
    var elementScrolledTo = $('h1, h2, h3, h4, h5, h6')[headingNumber-1];
    GOVUK.Analytics.ScrollTracker.HeadingNode.prototype.elementIsVisible.and.callFake(function($element) {
      return ( $element[0] == elementScrolledTo );
    });
    $(window).scroll();
    jasmine.clock().tick(510);
  };
});
