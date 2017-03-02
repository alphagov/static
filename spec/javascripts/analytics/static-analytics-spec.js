describe("GOVUK.StaticAnalytics", function() {
  var analytics;

  beforeEach(function() {
    window.ga = function() {};
    spyOn(window, 'ga');
    spyOn(GOVUK.analyticsPlugins, 'printIntent');
    spyOn(GOVUK.analyticsPlugins, 'error');
    analytics = new GOVUK.StaticAnalytics({
      universalId: 'universal-id',
      cookieDomain: '.www.gov.uk'
    });
  });

  describe('when created', function() {
    var universalSetupArguments;

    beforeEach(function() {
      universalSetupArguments = window.ga.calls.allArgs();
    });

    it('configures a universal tracker', function() {
      expect(universalSetupArguments[0]).toEqual(['create', 'universal-id', {'cookieDomain': '.www.gov.uk'}]);
    });

    it('sets the device pixel ratio', function() {
      expect(universalSetupArguments[2][1]).toEqual('dimension11');
    });

    it('sets the HTTP status code', function() {
      expect(universalSetupArguments[3][1]).toEqual('dimension15');
    });

    it('tracks a pageview in universal', function() {
      expect(universalSetupArguments[5]).toEqual(['send', 'pageview']);
    });

    it('begins print tracking', function() {
      expect(GOVUK.analyticsPlugins.printIntent).toHaveBeenCalled();
    });

    it('begins error tracking', function() {
      expect(GOVUK.analyticsPlugins.error).toHaveBeenCalled();
    });

    describe('when there are govuk: meta tags', function() {
      beforeEach(function() {
        window.ga.calls.reset();
      });

      afterEach(function() {
        $('head').find('meta[name^="govuk:"]').remove();
      });

      it('sets them as dimensions', function() {

        $('head').append('\
          <meta name="govuk:section" content="section">\
          <meta name="govuk:format" content="format">\
          <meta name="govuk:search-result-count" content="1000">\
          <meta name="govuk:publishing-government" content="2005-to-2010-labour-government">\
          <meta name="govuk:political-status" content="historic">\
          <meta name="govuk:analytics:organisations" content="<D10>">\
          <meta name="govuk:analytics:world-locations" content="<W1>">\
          <meta name="govuk:navigation-page-type" content="accordion">\
          <meta name="govuk:user-journey-stage" content="navigation">\
        ');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        universalSetupArguments = window.ga.calls.allArgs();

        expect(universalSetupArguments[5]).toEqual(['set', 'dimension1', 'section']);
        expect(universalSetupArguments[6]).toEqual(['set', 'dimension2', 'format']);
        expect(universalSetupArguments[7]).toEqual(['set', 'dimension5', '1000']);
        expect(universalSetupArguments[8]).toEqual(['set', 'dimension6', '2005-to-2010-labour-government']);
        expect(universalSetupArguments[9]).toEqual(['set', 'dimension7', 'historic']);
        expect(universalSetupArguments[10]).toEqual(['set', 'dimension9', '<D10>']);
        expect(universalSetupArguments[11]).toEqual(['set', 'dimension10', '<W1>']);
        expect(universalSetupArguments[12]).toEqual(['set', 'dimension32', 'accordion']);
        expect(universalSetupArguments[13]).toEqual(['set', 'dimension33', 'navigation']);
      });

      it('ignores meta tags not set', function() {
        $('head').append('<meta name="govuk:section" content="section">');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        universalSetupArguments = window.ga.calls.allArgs();

        expect(universalSetupArguments[5]).toEqual(['set', 'dimension1', 'section']);
        assertClosingArgumentIsAtIndex(universalSetupArguments, 6);
      });

      it('sets A/B meta tags as dimensions', function() {
        $('head').append('\
          <meta name="govuk:ab-test" content="name-of-test:name-of-ab-bucket" data-analytics-dimension="42">\
          <meta name="govuk:ab-test" content="name-of-other-test:name-of-other-ab-bucket" data-analytics-dimension="48">\
        ');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        universalSetupArguments = window.ga.calls.allArgs();

        expect(universalSetupArguments[5]).toEqual(['set', 'dimension42', 'name-of-test:name-of-ab-bucket']);
        expect(universalSetupArguments[6]).toEqual(['set', 'dimension48', 'name-of-other-test:name-of-other-ab-bucket']);
      });

      it('ignores dimensions outside of the A/B test range', function () {
        $('head').append('\
          <meta name="govuk:ab-test" content="name-of-test-dimension-too-low:some-bucket" data-analytics-dimension="39">\
          <meta name="govuk:ab-test" content="name-of-valid-test:some-bucket" data-analytics-dimension="40">\
          <meta name="govuk:ab-test" content="name-of-other-valid-test:some-bucket" data-analytics-dimension="49">\
          <meta name="govuk:ab-test" content="name-of-test-dimension-too-high:some-bucket" data-analytics-dimension="50">\
        ');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        universalSetupArguments = window.ga.calls.allArgs();

        expect(universalSetupArguments[5]).toEqual(['set', 'dimension40', 'name-of-valid-test:some-bucket']);
        expect(universalSetupArguments[6]).toEqual(['set', 'dimension49', 'name-of-other-valid-test:some-bucket']);
        assertClosingArgumentIsAtIndex(universalSetupArguments, 7);
      });

      it('ignores A/B meta tags with invalid dimensions', function () {
        $('head').append('\
          <meta name="govuk:ab-test" content="name-of-test:some-bucket">\
          <meta name="govuk:ab-test" content="name-of-test:some-bucket" data-analytics-dimension="not a number">\
        ');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        universalSetupArguments = window.ga.calls.allArgs();

        assertClosingArgumentIsAtIndex(universalSetupArguments, 5);
      });

      function assertClosingArgumentIsAtIndex(setupArgs, argIndex) {
        expect(setupArgs[argIndex]).toEqual(['send', 'pageview']);
      }
    });
  });

  describe('when there is a TLSversion cookie', function() {
    beforeEach(function() {
      GOVUK.cookie('TLSversion', '2');
      window.ga.calls.reset();
      analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
      universalSetupArguments = window.ga.calls.allArgs();
    });
    it("sets the cookie value as the value of the tls version custom dimension", function() {
      expect(universalSetupArguments[4]).toEqual(['set', 'dimension16', '2']);
    });
  });

  describe('when there is no TLSversion cookie', function() {
    beforeEach(function() {
      GOVUK.cookie('TLSversion', null);
      window.ga.calls.reset();
      analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
      universalSetupArguments = window.ga.calls.allArgs();
    });
    it("sets unknown as the value of the tls version custom dimension", function() {
      expect(universalSetupArguments[4]).toEqual(['set', 'dimension16', 'unknown']);
    });
  });

  describe('when tracking pageviews, events and custom dimensions', function() {
    it('tracks them in universal', function() {

      analytics.trackPageview('/path', 'Title');
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', {page: '/path', title: 'Title'}]);

      analytics.trackEvent('category', 'action');
      expect(window.ga.calls.mostRecent().args).toEqual(['send', {hitType: 'event', eventCategory: 'category', eventAction: 'action'}]);

      analytics.setSectionDimension('value');
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'value']);
    });
  });

  describe('when tracking social media shares', function() {
    it('tracks them in universal', function() {
      analytics.trackShare('network');

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'network',
        socialAction: 'share',
        socialTarget: jasmine.any(String)
      }]);
    });
  });

  describe('when setting a method to call on a following page', function() {
    beforeEach(function() {
      spyOn(GOVUK, 'cookie');
    });

    describe('and the method exists', function() {
      it('sets a cookie with the method name', function() {
        analytics.callOnNextPage('trackPageview');
        expect(GOVUK.cookie).toHaveBeenCalledWith('analytics_next_page_call', '["trackPageview"]');
      });

      it('sets a cookie with the parameters to call', function() {
        analytics.callOnNextPage('trackPageview', ['/path', 'Custom Title']);
        expect(GOVUK.cookie).toHaveBeenCalledWith('analytics_next_page_call', '["trackPageview","/path","Custom Title"]');
      });

      it('sets a cookie with the single parameter to call', function() {
        analytics.callOnNextPage('trackPageview', '/path');
        expect(GOVUK.cookie).toHaveBeenCalledWith('analytics_next_page_call', '["trackPageview","/path"]');
      });
    });

    describe('and the method doesn’t exist', function() {
      it('no cookie is set', function() {
        analytics.callOnNextPage('trackPageviewToNowhere');
        expect(GOVUK.cookie).not.toHaveBeenCalled();
      });
    });
  });

  describe('when there is a cookie indicating a method to call', function() {
    beforeEach(function() {
      spyOn(analytics, 'trackPageview');
    });

    it('calls the method', function() {
      spyOn(GOVUK, 'cookie').and.returnValue('["trackPageview"]');
      analytics.callMethodRequestedByPreviousPage();
      expect(analytics.trackPageview).toHaveBeenCalledWith();
    });

    it('calls the method with given parameters', function() {
      spyOn(GOVUK, 'cookie').and.returnValue('["trackPageview","/path","Title"]');
      analytics.callMethodRequestedByPreviousPage();
      expect(analytics.trackPageview).toHaveBeenCalledWith('/path', 'Title');
    });
  });
});
