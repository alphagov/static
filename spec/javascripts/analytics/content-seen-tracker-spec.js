describe("GOVUK.Analytics.contentSeenTracker", function() {
  var test_fixture = '\
    <div style="height: 3000px"></div>\
    <span data-track-seen="content_identifier_1"></span>\
    <div style="height: 3000px"></div>\
    <span data-track-seen="content_identifier_2"></span>';

  beforeEach(function() {
    setFixtures(test_fixture);
    spyOn(GOVUK, "sendToAnalytics").and.stub();
    window.GOVUK.Analytics.contentSeenTracker.init();
    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  function scrollOverNthNode(n) {
    if (typeof GOVUK.Analytics.contentSeenTracker.trackedNodes[n-1].isVisible.calls == 'undefined') {
      spyOn(GOVUK.Analytics.contentSeenTracker.trackedNodes[n-1], "isVisible");
    }
    GOVUK.Analytics.contentSeenTracker.trackedNodes[n-1].isVisible.and.returnValue(true);
    $(window).trigger('scroll');
    jasmine.clock().tick(510);
  }

  it("should send an analytics event with the correct identifier event when the page is scrolled to show a tracking span", function() {
    scrollOverNthNode(2);
    expect(GOVUK.sendToAnalytics.calls.count()).toBe(1);
    expect(GOVUK.sendToAnalytics.calls.argsFor(0)[0]).toEqual([
      '_trackEvent',
      'Content',
      'Seen',
      'content_identifier_2'
    ]);
  });

  it("should not send a second event for a node", function() {
    scrollOverNthNode(1);
    expect(GOVUK.sendToAnalytics.calls.count()).toBe(1);
    scrollOverNthNode(1);
    expect(GOVUK.sendToAnalytics.calls.count()).toBe(1);
  });
});
