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
    const numberOfDimensionsWithDefaultValues = 15;

    var universalSetupArguments;
    var pageViewObject;

    beforeEach(function() {
      universalSetupArguments = window.ga.calls.allArgs();
      pageViewObject = universalSetupArguments[3][2];
    });

    it('configures a universal tracker', function() {
      expect(window.ga).toHaveBeenCalledWith('create', 'universal-id', {'cookieDomain': '.www.gov.uk'});
    });

    it('sets the device pixel ratio', function() {
      expect(Object.keys(pageViewObject)).toContain('dimension11');
    });

    it('sets the HTTP status code', function() {
      expect(Object.keys(pageViewObject)).toContain('dimension15');
    });

    it('tracks a pageview in universal', function() {
      expect(universalSetupArguments[3][0]).toEqual('send');
      expect(universalSetupArguments[3][1]).toEqual('pageview');
    });

    it('begins print tracking', function() {
      expect(GOVUK.analyticsPlugins.printIntent).toHaveBeenCalled();
    });

    it('begins error tracking', function() {
      expect(GOVUK.analyticsPlugins.error).toHaveBeenCalled();
    });

    describe('when ecommerce results are present', function() {
      beforeEach(function() {
        window.ga.calls.reset();
      });

      afterEach(function() {
        $('.test-fixture').remove();
      });

      it('sends the ecommerce fields', function() {
        $('body').append('\
          <div class="test-fixture">\
            <div data-analytics-ecommerce data-ecommerce-start-index="1" data-search-query="search query">\
             <div \
               data-ecommerce-row\
               data-ecommerce-path="/path/to/page"\
               data-ecommerce-content-id="static-analytics-test"\
             </div>\
           </div>\
          </div>\
        ')
        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});

        expect(universalSetupArguments[3][0]).toEqual("send");
        expect(universalSetupArguments[3][1]).toEqual("pageview");
      });
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
          <meta name="govuk:schema-name" content="schema-name">\
        ');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        pageViewObject = getPageViewObject();

        expect(pageViewObject.dimension1).toEqual('section');
        expect(pageViewObject.dimension2).toEqual('format');
        expect(pageViewObject.dimension5).toEqual('1000');
        expect(pageViewObject.dimension6).toEqual('2005-to-2010-labour-government');
        expect(pageViewObject.dimension7).toEqual('historic');
        expect(pageViewObject.dimension9).toEqual('<D10>');
        expect(pageViewObject.dimension10).toEqual('<W1>');
        expect(pageViewObject.dimension17).toEqual('schema-name');
      });

      it('ignores meta tags not set', function() {
        $('head').append('<meta name="govuk:section" content="section">');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        pageViewObject = getPageViewObject();

        expect(Object.keys(pageViewObject).length).toEqual(1 + numberOfDimensionsWithDefaultValues);
        expect(pageViewObject.dimension1).toEqual('section');
      });

      it('sets A/B meta tags as dimensions', function() {
        $('head').append('\
          <meta name="govuk:ab-test" content="name-of-test:name-of-ab-bucket" data-analytics-dimension="42">\
          <meta name="govuk:ab-test" content="name-of-other-test:name-of-other-ab-bucket" data-analytics-dimension="48">\
        ');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        pageViewObject = getPageViewObject();

        expect(pageViewObject.dimension42).toEqual('name-of-test:name-of-ab-bucket');
        expect(pageViewObject.dimension48).toEqual('name-of-other-test:name-of-other-ab-bucket');
      });


      it('ignores A/B meta tags with invalid dimensions', function () {
        $('head').append('\
          <meta name="govuk:ab-test" content="name-of-test:some-bucket">\
          <meta name="govuk:ab-test" content="name-of-test:some-bucket" data-analytics-dimension="not a number">\
        ');

        analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
        pageViewObject = getPageViewObject();

        expect(Object.keys(pageViewObject).length).toEqual(numberOfDimensionsWithDefaultValues);
      });

      [
        {
          name: 'themes',
          number: 3,
          defaultValue: 'other'
        },
        {
          name: 'navigation-page-type',
          number: 32,
          defaultValue: 'none'
        },
        {
          name: 'user-journey-stage',
          number: 33,
          defaultValue: 'thing'
        },
        {
          name: 'navigation-document-type',
          number: 34,
          defaultValue: 'other'
        },
        {
          name: 'content-id',
          number: 4,
          defaultValue: '00000000-0000-0000-0000-000000000000'
        },
        {
          name: 'taxon-slug',
          number: 56,
          defaultValue: 'other'
        },
        {
          name: 'taxon-id',
          number: 57,
          defaultValue: 'other'
        },
        {
          name: 'taxon-slugs',
          number: 58,
          defaultValue: 'other'
        },
        {
          name: 'taxon-ids',
          number: 59,
          defaultValue: 'other'
        }
      ].forEach(function (dimension) {
        it('sets the ' + dimension.name + ' dimension from a meta tag if present', function () {
          $('head').append('\
          <meta name="govuk:' + dimension.name + '" content="some-' + dimension.name + '-value">\
        ');

          analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
          pageViewObject = getPageViewObject();

          expect(pageViewObject['dimension' + dimension.number]).toEqual('some-' + dimension.name + '-value');
        });

        it('sets the default dimension if no ' + dimension.name + ' meta tag is present', function () {
          analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
          pageViewObject = getPageViewObject();

          expect(pageViewObject['dimension' + dimension.number]).toEqual(dimension.defaultValue);
        });
      });

      describe('when tracking the number of sections and links on a page', function() {
        describe('on a page with a normal sidebar', function() {
          beforeEach(function() {
            $('body').append('\
              <div class="test-fixture">\
                <aside class="govuk-related-items">\
                  <h2 data-track-count="sidebarRelatedItemSection">Section 1</h2>\
                  <nav role="navigation">\
                    <ul>\
                      <li>\
                        <a data-track-category="relatedLinkClicked">\
                          Link 1.1\
                        </a>\
                      </li>\
                      <li>\
                        <a data-track-category="relatedLinkClicked">\
                          Link 1.2\
                        </a>\
                      </li>\
                    </ul>\
                  </nav>\
                  <h2 data-track-count="sidebarRelatedItemSection">Section 2</h2>\
                  <nav role="navigation">\
                    <ul>\
                      <li>\
                        <a data-track-category="relatedLinkClicked">\
                          Link 2.1\
                        </a>\
                      </li>\
                    </ul>\
                  </nav>\
                </aside>\
              </div>\
            ');
          });

          afterEach(function() {
            $('.test-fixture').remove();
          });

          it('tracks the number of sidebar sections', function() {
            analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
            pageViewObject = getPageViewObject();
            expect(pageViewObject.dimension26).toEqual('2');
          });

          it('tracks the total number of related links', function() {
            analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
            pageViewObject = getPageViewObject();
            expect(pageViewObject.dimension27).toEqual('3');
          });
        });

        describe('on a page with a taxon sidebar', function() {
          beforeEach(function() {
            $('body').append('\
              <div class="test-fixture">\
                <aside class="govuk-taxonomy-sidebar">\
                  <div class="sidebar-taxon" data-track-count="sidebarTaxonSection">\
                    <h2><a href data-track-category="relatedLinkClicked">Section 1</a></h2>\
                    <nav role="navigation">\
                      <ul>\
                        <li>\
                          <a href data-track-category="relatedLinkClicked">\
                            Link 1.1\
                          </a>\
                        </li>\
                        <li>\
                          <a href data-track-category="relatedLinkClicked">\
                            Link 1.2\
                          </a>\
                        </li>\
                      </ul>\
                    </nav>\
                  </div>\
                  <div class="sidebar-taxon" data-track-count="sidebarTaxonSection">\
                    <h2><a href data-track-category="relatedLinkClicked">Section 2</a></h2>\
                    <nav role="navigation">\
                      <ul>\
                        <li>\
                          <a href data-track-category="relatedLinkClicked">\
                            Link 2.1\
                          </a>\
                        </li>\
                      </ul>\
                    </nav>\
                  </div>\
                </aside>\
              </div>\
            ');
          });

          afterEach(function() {
            $('.test-fixture').remove();
          });

          it('tracks the number of sidebar sections', function() {
            analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
            pageViewObject = getPageViewObject();
            expect(pageViewObject.dimension26).toEqual('2');
          });

          it('tracks the total number of related links, including headers', function() {
            analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
            pageViewObject = getPageViewObject();
            expect(pageViewObject.dimension27).toEqual('5');
          });
        });

        describe('on a page with an accordion', function() {
          beforeEach(function() {
            $('body').append('\
              <div class="test-fixture">\
                <div class="accordion-with-descriptions">\
                  <div class="subsection-wrapper">\
                    <div class="subsection" data-track-count="accordionSection">\
                      <div class="subsection-header">\
                        <a href><h2>Section 1</h2></a>\
                      </div>\
                      <div class="subsection-content">\
                        <ol>\
                          <li>\
                            <a href data-track-category="navAccordionLinkClicked">\
                              Link 1.1\
                            </a>\
                          </li>\
                          <li>\
                            <a href data-track-category="navAccordionLinkClicked">\
                              Link 1.2\
                            </a>\
                          </li>\
                        </ol>\
                      </div>\
                    </div>\
                    <div class="subsection" data-track-count="accordionSection">\
                      <div class="subsection-header">\
                        <a href><h2>Section 2</h2></a>\
                      </div>\
                      <div class="subsection-content">\
                        <ol>\
                          <li>\
                            <a href data-track-category="navAccordionLinkClicked">\
                              Link 2.1\
                            </a>\
                          </li>\
                        </ol>\
                      </div>\
                    </div>\
                  </div>\
                </div>\
              </div>\
            ');
          });

          afterEach(function() {
            $('.test-fixture').remove();
          });

          it('tracks the number of accordion sections', function() {
            analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
            pageViewObject = getPageViewObject();
            expect(pageViewObject.dimension26).toEqual('2');
          });

          it('tracks the total number of accordion section links', function() {
            analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
            pageViewObject = getPageViewObject();
            expect(pageViewObject.dimension27).toEqual('3');
          });
        });

        describe('on a page with an grid', function() {
          beforeEach(function() {
            $('body').append('\
              <div class="test-fixture">\
                <main class="taxon-page">\
                  <nav role="navigation">\
                    <ol>\
                      <li>\
                        <h2>\
                          <a href data-track-category="navGridLinkClicked">Link 1</a>\
                        </h2>\
                      </li>\
                      <li>\
                        <h2>\
                          <a href data-track-category="navGridLinkClicked">Link 2</a>\
                        </h2>\
                      </li>\
                      <li>\
                        <h2>\
                          <a href data-track-category="navGridLinkClicked">Link 3</a>\
                        </h2>\
                      </li>\
                    </ol>\
                  </nav>\
                  <div class="grid-row">\
                    <div class="parent-topic-contents">\
                      <div class="topic-content">\
                        <h2>Grid leaves</h2>\
                        <ol>\
                          <li><h2>\
                            <a href data-track-category="navGridLeafLinkClicked">\
                              Leaf 1\
                            </a>\
                          </h2></li>\
                          \<li><h2>\
                            <a href data-track-category="navGridLeafLinkClicked">\
                              Leaf 2\
                            </a>\
                          </h2></li>\
                        </ol>\
                      </div>\
                    </div>\
                  </div>\
                </main>\
              </div>\
            ');
          });

          afterEach(function() {
            $('.test-fixture').remove();
          });

          it('does tracks sections equal to the number of grid links', function() {
            analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
            pageViewObject = getPageViewObject();
            expect(pageViewObject.dimension26).toEqual('3');
          });

          it('tracks the total number of grid links and leaf links', function() {
            analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
            pageViewObject = getPageViewObject();
            expect(pageViewObject.dimension27).toEqual('5');
          });
        });
      });

      describe('on a navigation leaf page', function() {
        beforeEach(function() {
          $('body').append('\
              <div class="test-fixture">\
                <div class="topic-content">\
                  <ol>\
                    <li>\
                      <h2>\
                        <a href data-track-category="navLeafLinkClicked">\
                          Link 1\
                        </a>\
                      </h2>\
                    </li>\
                    <li>\
                      <h2>\
                        <a href data-track-category="navLeafLinkClicked">\
                          Link 2\
                        </a>\
                      </h2>\
                    </li>\
                  </ol>\
                </div>\
              </div>\
            ');
        });

        afterEach(function() {
          $('.test-fixture').remove();
        });

        it('does not track any sections', function() {
          analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
          pageViewObject = getPageViewObject();
          expect(pageViewObject.dimension26).toEqual('0');
        });

        it('tracks the total number of leaf links', function() {
          analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
          pageViewObject = getPageViewObject();
          expect(pageViewObject.dimension27).toEqual('2');
        });
      });

      describe('on a sub topic page', function() {
        beforeEach(function() {
          $('body').append('\
            <div class="test-fixture">\
              <main id="content" role="main" class="content topics-page">\
                <div class="browse-container full-width">\
                  <nav class="index-list with-title"">\
                    <h1 id="getting-started">Getting started</h1>\
                    <ul>\
                      <li>\
                        <a href="/corporation-tax">Corporation Tax</a>\
                      </li>\
                      <li>\
                        <a href="/limited-company-formation">Set up a private limited company</a>\
                      </li>\
                      <li>\
                        <a href="/running-a-limited-company">Running a limited company</a>\
                      </li>\
                    </ul>\
                  </nav>\
                  <nav class="index-list with-title"">\
                    <ul>\
                      <li>\
                        <a href="/prepare-file-annual-accounts-for-limited-company">\
                          Accounts and tax returns for private limited companies\
                        </a>\
                      </li\>\
                      <li>\
                        <a href="/first-company-accounts-and-return">\
                          Your limited company first accounts and Company Tax Return\
                        </a>\
                      </li>\
                      <li>\
                        <a href="/corporation-tax-accounting-period">\
                          Accounting periods for Corporation Tax\
                        </a>\
                      </li>\
                    </ul>\
                  </nav>\
                </div>\
              </main>\
            </div>\
          ');
        });

        afterEach(function() {
          $('.test-fixture').remove();
        });

        it('tracks the number of sections', function() {
          analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
          pageViewObject = getPageViewObject();
          expect(pageViewObject.dimension26).toEqual('2');
        });
      });

      describe('on a document collection page', function() {
        beforeEach(function() {
          $('body').append('\
            <div class="test-fixture">\
              <main role="main" id="content" class="document-collection">\
                <h3 class="group-title" id="ancient-history">\
                  Ancient history\
                </h3>\
                <ol class="group-document-list">\
                  <li class="group-document-list-item">\
                    <h3 class="group-document-list-item-title">\
                      <a href="conditions-requirements-ancient-history">\
                        GCSE (9 to 1) subject-level conditions and requirements for ancient history\
                      </a>\
                    </h3>\
                  </li>\
                </ol>\
                <h3 class="group-title" id="ancient-languages">\
                  Ancient languages\
                </h3>\
                <ol class="group-document-list">\
                  <li class="group-document-list-item">\
                    <h3 class="group-document-list-item-title">\
                      <a href="/conditions-requirements-ancient-languages">\
                        GCSE (9 to 1) subject-level conditions and requirements for ancient languages\
                      </a>\
                    </h3>\
                  </li>\
              </ol>\
              </main>\
            </div>\
          ');
        });

        afterEach(function() {
          $('.test-fixture').remove();
        });

        it('tracks the number of sections', function() {
          analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
          pageViewObject = getPageViewObject();
          expect(pageViewObject.dimension26).toEqual('2');
        });
      });
    });
  });

  describe('when there is a TLSversion cookie', function() {
    var pageViewObject;

    beforeEach(function() {
      GOVUK.cookie('TLSversion', '2');
      window.ga.calls.reset();
      analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
      pageViewObject = getPageViewObject();
    });

    it("sets the cookie value as the value of the tls version custom dimension", function() {
      expect(pageViewObject.dimension16).toEqual('2');
    });
  });

  describe('when there is no TLSversion cookie', function() {
    var pageViewObject;

    beforeEach(function() {
      GOVUK.cookie('TLSversion', null);
      window.ga.calls.reset();
      analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
      pageViewObject = getPageViewObject();
    });

    it("sets unknown as the value of the tls version custom dimension", function() {
      expect(pageViewObject.dimension16).toEqual('unknown');
    });
  });

  describe('when tracking pageviews and events', function() {
    it('tracks them in universal', function() {

      analytics.trackPageview('/path', 'Title');
      trackingArguments = window.ga.calls.mostRecent().args;
      expect(trackingArguments[0]).toEqual('send');
      expect(trackingArguments[1]).toEqual('pageview');
      expect(trackingArguments[2].page).toEqual('/path');
      expect(trackingArguments[2].title).toEqual('Title');

      analytics.trackEvent('category', 'action');

      var lastArguments = window.ga.calls.mostRecent().args;
      expect(lastArguments[0]).toEqual('send');

      var trackingOptions = lastArguments[1];
      expect(trackingOptions.hitType).toEqual('event');
      expect(trackingOptions.eventCategory).toEqual('category');
      expect(trackingOptions.eventAction).toEqual('action');
    });
  });

  describe('when tracking social media shares', function() {
    it('tracks them in universal', function() {
      analytics.trackShare('network');

      var lastArguments = window.ga.calls.mostRecent().args;
      expect(lastArguments[0]).toEqual('send');

      var trackingOptions = lastArguments[1];
      expect(trackingOptions.hitType).toEqual('social');
      expect(trackingOptions.socialNetwork).toEqual('network');
      expect(trackingOptions.socialAction).toEqual('share');
      expect(trackingOptions.socialTarget).toEqual(jasmine.any(String));
    });
  });

  describe('when setting an options object for the next pageview', function() {
    beforeEach(function() {
      analytics.setCookie('analytics_next_page_call', null);
    });

    it('sets a cookie with the options', function() {
      analytics.setOptionsForNextPageview({dimension99: 'Test'});
      expect(analytics.getCookie('analytics_next_page_call')).toEqual({dimension99: "Test"});
    });

    it('sets a cookie with the options when set sequentially', function() {
      analytics.setOptionsForNextPageview({dimension1: 'First'});
      analytics.setOptionsForNextPageview({dimension2: 'Second'});
      expect(analytics.getCookie('analytics_next_page_call')).toEqual({dimension1: "First", dimension2: "Second"});
    });
  });

  describe('when there is a cookie setting options for the next pageview', function() {
    beforeEach(function() {
      analytics.setCookie('analytics_next_page_call', {dimension99: "Test"});
      window.ga.calls.reset();
      analytics = new GOVUK.StaticAnalytics({universalId: 'universal-id'});
    });

    it('includes the options for the pageview', function() {
      var pageViewObject = getPageViewObject();
      expect(pageViewObject.dimension99).toEqual('Test');
    });

    it('clears the cookie after being used', function() {
      expect(GOVUK.cookie('analytics_next_page_call')).toBeNull();
    });
  });

  function getPageViewObject() {
    return window.ga.calls.allArgs()[3][2];
  }
});
