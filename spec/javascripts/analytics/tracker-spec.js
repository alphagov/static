describe("GOVUK.Analytics.Tracker", function() {
  var tracker;

  beforeEach(function() {
    window._gaq = [];
    window.ga = function() {};
    spyOn(window, 'ga');
    tracker = new GOVUK.Analytics.Tracker('universal-id', 'classic-id');
  });

  describe('when created', function() {
    var universalSetupArguments;

    beforeEach(function() {
      universalSetupArguments = window.ga.calls.allArgs();
    });

    it('configures classic and universal trackers', function() {
      expect(window._gaq[0]).toEqual(['_setAccount', 'classic-id']);
      expect(window._gaq[1]).toEqual(['_setDomainName', '.www.gov.uk']);
      expect(universalSetupArguments[0]).toEqual(['create', 'universal-id', {'cookieDomain': '.www.gov.uk'}]);
    });

    it('sets the device pixel ratio', function() {
      expect(window._gaq[4][2]).toEqual('Pixel Ratio');
      expect(universalSetupArguments[2][1]).toEqual('dimension11');
    });

    it('sets the HTTP status code', function() {
      expect(window._gaq[5][2]).toEqual('httpStatusCode');
      expect(universalSetupArguments[3][1]).toEqual('dimension15');
    });

    it('tracks a pageview in both classic and universal', function() {
      expect(window._gaq[6]).toEqual(['_trackPageview']);
      expect(universalSetupArguments[4]).toEqual(['send', 'pageview']);
    });
  });

  describe('when tracking pageviews, events and custom dimensions', function() {
    it('tracks in both classic and universal', function() {
      window._gaq = [];
      tracker.trackPageview('/path', 'Title');
      expect(window._gaq[0]).toEqual(['_trackPageview', '/path']);
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', {page: '/path', title: 'Title'}]);

      window._gaq = [];
      tracker.trackEvent('category', 'action');
      expect(window._gaq[0]).toEqual(['_trackEvent', 'category', 'action']);
      expect(window.ga.calls.mostRecent().args).toEqual(['send', {hitType: 'event', eventCategory: 'category', eventAction: 'action'}]);

      window._gaq = [];
      tracker.setDimension(1, 'value', 'name');
      expect(window._gaq[0]).toEqual(['_setCustomVar', 1, 'name', 'value', 3]);
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'value']);
    });
  });

});
