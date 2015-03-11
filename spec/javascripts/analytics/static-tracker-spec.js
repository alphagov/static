describe("GOVUK.StaticTracker", function() {
  var tracker;

  beforeEach(function() {
    window._gaq = [];
    window.ga = function() {};
    spyOn(window, 'ga');
    tracker = new GOVUK.StaticTracker({
      universalId: 'universal-id',
      classicId: 'classic-id',
      cookieDomain: '.www.gov.uk'
    });
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

    describe('when there is a cookie with next page parameters set', function() {
      it('sets them as a dimension', function() {
        window.ga.calls.reset();
        window._gaq = [];
        spyOn(GOVUK, 'cookie').and.returnValue("_setCustomVar,21,name,value,3");
        tracker = new GOVUK.StaticTracker({universalId: 'universal-id', classicId: 'classic-id'});
        universalSetupArguments = window.ga.calls.allArgs();

        expect(window._gaq[6]).toEqual(['_setCustomVar', 21, 'name', 'value', 3]);
        expect(universalSetupArguments[4]).toEqual(['set', 'dimension21', 'value']);
      });
    });

    describe('when there is an existing queue of custom variables', function() {
      beforeEach(function() {
        window.ga.calls.reset();
        window._gaq = [
          ['_setCustomVar', 21, 'name', 'value', 3],
          ['_setCustomVar', 10, 'name-2', 'value-2', 2]
        ];
        tracker = new GOVUK.StaticTracker({universalId: 'universal-id', classicId: 'classic-id'});
        universalSetupArguments = window.ga.calls.allArgs();
      });

      it('resets the queue before setup', function() {
        expect(window._gaq[0]).toEqual(['_setAccount', 'classic-id']);
      });

      it('sets the custom variables as dimensions', function() {
        expect(window._gaq[6]).toEqual(['_setCustomVar', 21, 'name', 'value', 3]);
        expect(window._gaq[7]).toEqual(['_setCustomVar', 10, 'name-2', 'value-2', 2]);
        expect(universalSetupArguments[4]).toEqual(['set', 'dimension21', 'value']);
        expect(universalSetupArguments[5]).toEqual(['set', 'dimension10', 'value-2']);
      });
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
      tracker.setSectionDimension('value');
      expect(window._gaq[0]).toEqual(['_setCustomVar', 1, 'Section', 'value', 3]);
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'value']);
    });
  });

  describe('when tracking social media shares', function() {
    it('tracks in both classic and universal', function() {
      window._gaq = [];
      tracker.trackShare('network');

      expect(window._gaq[0]).toEqual(['_trackSocial', 'network', 'share', jasmine.any(String)]);
      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'network',
        socialAction: 'share',
        socialTarget: jasmine.any(String)
      }]);
    });
  });

});
