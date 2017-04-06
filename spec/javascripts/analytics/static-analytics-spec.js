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
    // The number of setup arguments which are set before the dimensions
    const expectedDefaultArgumentCount = 14;

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
      expect(universalSetupArguments[expectedDefaultArgumentCount]).toEqual(['send', 'pageview']);
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
        ');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        setupArguments = dimensionSetupArguments();

        expect(setupArguments[0]).toEqual(['set', 'dimension1', 'section']);
        expect(setupArguments[1]).toEqual(['set', 'dimension2', 'format']);
        expect(setupArguments[2]).toEqual(['set', 'dimension5', '1000']);
        expect(setupArguments[3]).toEqual(['set', 'dimension6', '2005-to-2010-labour-government']);
        expect(setupArguments[4]).toEqual(['set', 'dimension7', 'historic']);
        expect(setupArguments[5]).toEqual(['set', 'dimension9', '<D10>']);
        expect(setupArguments[6]).toEqual(['set', 'dimension10', '<W1>']);
      });

      it('ignores meta tags not set', function() {
        $('head').append('<meta name="govuk:section" content="section">');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        setupArguments = dimensionSetupArguments();

        expect(setupArguments.length).toEqual(1);
        expect(setupArguments[0]).toEqual(['set', 'dimension1', 'section']);
      });

      it('sets A/B meta tags as dimensions', function() {
        $('head').append('\
          <meta name="govuk:ab-test" content="name-of-test:name-of-ab-bucket" data-analytics-dimension="42">\
          <meta name="govuk:ab-test" content="name-of-other-test:name-of-other-ab-bucket" data-analytics-dimension="48">\
        ');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        setupArguments = dimensionSetupArguments();

        expect(setupArguments[0]).toEqual(['set', 'dimension42', 'name-of-test:name-of-ab-bucket']);
        expect(setupArguments[1]).toEqual(['set', 'dimension48', 'name-of-other-test:name-of-other-ab-bucket']);
      });

      it('ignores dimensions outside of the A/B test range', function () {
        $('head').append('\
          <meta name="govuk:ab-test" content="name-of-test-dimension-too-low:some-bucket" data-analytics-dimension="39">\
          <meta name="govuk:ab-test" content="name-of-valid-test:some-bucket" data-analytics-dimension="40">\
          <meta name="govuk:ab-test" content="name-of-other-valid-test:some-bucket" data-analytics-dimension="49">\
          <meta name="govuk:ab-test" content="name-of-test-dimension-too-high:some-bucket" data-analytics-dimension="50">\
        ');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        setupArguments = dimensionSetupArguments();

        expect(setupArguments.length).toEqual(2);
        expect(setupArguments[0]).toEqual(['set', 'dimension40', 'name-of-valid-test:some-bucket']);
        expect(setupArguments[1]).toEqual(['set', 'dimension49', 'name-of-other-valid-test:some-bucket']);
      });

      it('ignores A/B meta tags with invalid dimensions', function () {
        $('head').append('\
          <meta name="govuk:ab-test" content="name-of-test:some-bucket">\
          <meta name="govuk:ab-test" content="name-of-test:some-bucket" data-analytics-dimension="not a number">\
        ');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        setupArguments = dimensionSetupArguments();

        expect(setupArguments.length).toEqual(0);
      });

      [
        {
          name: 'themes',
          number: 3,
          defaultValue: 'other',
          setupArgumentsIndex: 5
        },
        {
          name: 'navigation-page-type',
          number: 32,
          defaultValue: 'none',
          setupArgumentsIndex: 6
        },
        {
          name: 'user-journey-stage',
          number: 33,
          defaultValue: 'thing',
          setupArgumentsIndex: 7
        },
        {
          name: 'navigation-document-type',
          number: 34,
          defaultValue: 'other',
          setupArgumentsIndex: 8
        },
        {
          name: 'content-id',
          number: 4,
          defaultValue: '00000000-0000-0000-0000-000000000000',
          setupArgumentsIndex: 9
        },
        {
          name: 'taxon-slug',
          number: 56,
          defaultValue: 'other',
          setupArgumentsIndex: 10
        },
        {
          name: 'taxon-id',
          number: 57,
          defaultValue: 'other',
          setupArgumentsIndex: 11
        },
        {
          name: 'taxon-slugs',
          number: 58,
          defaultValue: 'other',
          setupArgumentsIndex: 12
        },
        {
          name: 'taxon-ids',
          number: 59,
          defaultValue: 'other',
          setupArgumentsIndex: 13
        }
      ].forEach(function (dimension) {
        it('sets the ' + dimension.name + ' dimension from a meta tag if present', function () {
          $('head').append('\
          <meta name="govuk:' + dimension.name + '" content="some-' + dimension.name + '-value">\
        ');

          analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
          setupArguments = window.ga.calls.allArgs();

          expect(setupArguments[dimension.setupArgumentsIndex])
            .toEqual(['set', 'dimension' + dimension.number, 'some-' + dimension.name + '-value']);
        });

        it('sets the default dimension if no ' + dimension.name + ' meta tag is present', function () {
          analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
          setupArguments = window.ga.calls.allArgs();

          expect(setupArguments[dimension.setupArgumentsIndex])
            .toEqual(['set', 'dimension' + dimension.number, dimension.defaultValue]);
        });
      });

      function dimensionSetupArguments() {
        // Remove the default calls to the analytics object
        return window.ga.calls.allArgs().slice(expectedDefaultArgumentCount, -1);
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
