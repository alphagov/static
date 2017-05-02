(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var StaticAnalytics = function(config) {

    // Create universal tracker
    // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md
    // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/javascripts/govuk/analytics/analytics.js
    var analytics = new GOVUK.Analytics(config);
    this.analytics = analytics;

    setPixelDensityDimension();
    setHTTPStatusCodeDimension();
    setTLSVersionDimension();
    this.setDimensionsFromMetaTags();
    this.setAbTestDimensionsFromMetaTags();
    this.callMethodRequestedByPreviousPage();

    // Track initial pageview
    analytics.trackPageview();

    // Begin error and print tracking
    GOVUK.analyticsPlugins.error({filenameMustMatch: /gov\.uk/});
    GOVUK.analyticsPlugins.printIntent();
    GOVUK.analyticsPlugins.mailtoLinkTracker();
    GOVUK.analyticsPlugins.externalLinkTracker();
    GOVUK.analyticsPlugins.downloadLinkTracker({
      selector: 'a[href*="/government/uploads"], a[href*="assets.publishing.service.gov.uk"]'
    });

    function setPixelDensityDimension() {
      if (window.devicePixelRatio) {
        analytics.setDimension(11, window.devicePixelRatio);
      }
    }

    function setTLSVersionDimension() {
      var tls_version = GOVUK.cookie('TLSversion') || 'unknown';
      analytics.setDimension(16, tls_version);
    }

    function setHTTPStatusCodeDimension() {
      analytics.setDimension(15, window.httpStatusCode || 200);
    }

  };

  StaticAnalytics.prototype.callOnNextPage = function(method, params) {
    params = params || [];

    if (!$.isArray(params)) {
      params = [params];
    }

    if (GOVUK.cookie && typeof this[method] === "function") {
      params.unshift(method);
      GOVUK.cookie('analytics_next_page_call', JSON.stringify(params));
    }
  };

  StaticAnalytics.prototype.callMethodRequestedByPreviousPage = function() {
    if (GOVUK.cookie && GOVUK.cookie('analytics_next_page_call') !== null) {
      var params, method;

      try {
        params = JSON.parse(GOVUK.cookie('analytics_next_page_call'));
        method = params.shift();
      } catch(e) {}

      if (method && typeof this[method] === "function") {
        this[method].apply(this, params);
      }

      // Delete cookie
      GOVUK.cookie('analytics_next_page_call', null);
    }
  };

  StaticAnalytics.load = function() {
    GOVUK.Analytics.load();
  };

  StaticAnalytics.prototype.setDimensionsFromMetaTags = function() {
    var $metas = $('meta[name^="govuk:"]'),
        dimensions = {};

    $metas.each(function() {
      var $meta = $(this),
          key = $meta.attr('name').split('govuk:')[1],
          value = $meta.attr('content');

      dimensions[key] = value;
    });

    // Set defaults first, so that we get a stable ordering in tests
    this.setDimensionsThatHaveDefaultValues(dimensions);
    this.setDimensionsThatDoNotHaveDefaultValues(dimensions);
  };

  StaticAnalytics.prototype.setDimensionsThatHaveDefaultValues = function(dimensions) {
    this.setThemesDimension(dimensions['themes']);
    this.setNavigationPageTypeDimension(dimensions['navigation-page-type']);
    this.setUserJourneyStage(dimensions['user-journey-stage']);
    this.setNavigationDocumentTypeDimension(dimensions['navigation-document-type']);
    this.setContentIdDimension(dimensions['content-id']);
    this.setTaxonSlugDimension(dimensions['taxon-slug']);
    this.setTaxonIdDimension(dimensions['taxon-id']);
    this.setTaxonSlugsDimension(dimensions['taxon-slugs']);
    this.setTaxonIdsDimension(dimensions['taxon-ids']);
    this.setTotalNumberOfSections();
    this.setTotalNumberOfSectionLinks();
  };

  StaticAnalytics.prototype.setDimensionsThatDoNotHaveDefaultValues = function(dimensions) {
    this.setSectionDimension(dimensions['section']);
    this.setFormatDimension(dimensions['format']);
    this.setResultCountDimension(dimensions['search-result-count']);
    this.setPublishingGovernmentDimension(dimensions['publishing-government']);
    this.setPoliticalStatusDimension(dimensions['political-status']);
    this.setOrganisationsDimension(dimensions['analytics:organisations']);
    this.setWorldLocationsDimension(dimensions['analytics:world-locations']);
    this.setRenderingApplicationDimension(dimensions['rendering-application']);
    this.setSchemaNameDimension(dimensions['schema-name']);
  };

  StaticAnalytics.prototype.setAbTestDimensionsFromMetaTags = function() {
      var $abMetas = $('meta[name^="govuk:ab-test"]'),
          staticAnalytics = this,
          // This is the block of dimensions assigned to A/B tests
          minAbTestDimension = 40,
          maxAbTestDimension = 49;

      $abMetas.each(function() {
        var $meta = $(this),
        dimension = parseInt($meta.data('analytics-dimension')),
        testNameAndBucket = $meta.attr('content');

        if (dimension >= minAbTestDimension && dimension <= maxAbTestDimension) {
          staticAnalytics.setDimension(dimension, testNameAndBucket);
        }
      });
  }

  StaticAnalytics.prototype.trackPageview = function(path, title, options) {
    this.analytics.trackPageview(path, title, options);
  };

  StaticAnalytics.prototype.trackEvent = function(category, action, options) {
    this.analytics.trackEvent(category, action, options);
  };

  StaticAnalytics.prototype.setDimension = function(index, value, name, scope) {
    if (typeof value === "undefined") {
      return;
    }

    this.analytics.setDimension(index, value, name, scope);
  };

  StaticAnalytics.prototype.trackShare = function(network) {
    this.analytics.trackShare(network);
  };

  StaticAnalytics.prototype.addLinkedTrackerDomain = function(trackerId, name, domain) {
    this.analytics.addLinkedTrackerDomain(trackerId, name, domain);
  };

  StaticAnalytics.prototype.setSectionDimension = function(section) {
    this.setDimension(1, section);
  };

  StaticAnalytics.prototype.setFormatDimension = function(format) {
    this.setDimension(2, format);
  };

  StaticAnalytics.prototype.setThemesDimension = function(themes) {
    this.setDimension(3, themes || 'other');
  };

  StaticAnalytics.prototype.setContentIdDimension = function(contentId) {
    this.setDimension(4, contentId || '00000000-0000-0000-0000-000000000000');
  };

  StaticAnalytics.prototype.setResultCountDimension = function(count) {
    this.setDimension(5, count);
  };

  StaticAnalytics.prototype.setPublishingGovernmentDimension = function(government) {
    this.setDimension(6, government);
  };

  StaticAnalytics.prototype.setPoliticalStatusDimension = function(status) {
    this.setDimension(7, status);
  };

  StaticAnalytics.prototype.setOrganisationsDimension = function(orgs) {
    this.setDimension(9, orgs);
  };

  StaticAnalytics.prototype.setWorldLocationsDimension = function(locations) {
    this.setDimension(10, locations);
  };

  StaticAnalytics.prototype.setRenderingApplicationDimension = function(app) {
    this.setDimension(20, app);
  };

  StaticAnalytics.prototype.setSearchPositionDimension = function(position) {
    this.setDimension(21, position);
  };

  StaticAnalytics.prototype.setSchemaNameDimension = function(position) {
    this.setDimension(17, position);
  };

  StaticAnalytics.prototype.setTotalNumberOfSections = function() {
    var sidebarSections = $('[data-track-count="sidebarRelatedItemSection"]').length;
    var sidebarTaxons = $('[data-track-count="sidebarTaxonSection"]').length;
    var accordionSubsections = $('[data-track-count="accordionSection"]').length;
    var gridSections = $('a[data-track-category="navGridLinkClicked"]').length;
    var totalNumberOfSections = sidebarSections || sidebarTaxons || accordionSubsections || gridSections;
    this.setDimension(26, totalNumberOfSections);
  };

  StaticAnalytics.prototype.setTotalNumberOfSectionLinks = function() {
    var relatedLinks = $('a[data-track-category="relatedLinkClicked"]').length;
    var accordionLinks = $('a[data-track-category="navAccordionLinkClicked"]').length;
    // Grid links are counted both as "sections" (see dimension 26), and as part of the total link count
    var gridLinks = $('a[data-track-category="navGridLinkClicked"]').length
      + $('a[data-track-category="navGridLeafLinkClicked"]').length;
    var leafLinks = $('a[data-track-category="navLeafLinkClicked"]').length;
    var totalNumberOfSectionLinks = relatedLinks || accordionLinks || gridLinks || leafLinks;
    this.setDimension(27, totalNumberOfSectionLinks);
  };

  StaticAnalytics.prototype.setNavigationPageTypeDimension = function(pageType) {
    this.setDimension(32, pageType || 'none');
  };

  StaticAnalytics.prototype.setUserJourneyStage = function(journeyStage) {
    // Track the stage of a user's journey through GOV.UK. If the page does not
    // set a page type in a meta tag, default to "thing", which identifes a page
    // as containing content rather than some kind of navigation.
    this.setDimension(33, journeyStage || "thing");
  };

  StaticAnalytics.prototype.setNavigationDocumentTypeDimension = function(documentType) {
    this.setDimension(34, documentType || "other");
  };

  StaticAnalytics.prototype.setTaxonSlugDimension = function(taxonSlug) {
    this.setDimension(56, taxonSlug || "other");
  };

  StaticAnalytics.prototype.setTaxonIdDimension = function(taxonId) {
    this.setDimension(57, taxonId || "other");
  };

  StaticAnalytics.prototype.setTaxonSlugsDimension = function(taxonSlugs) {
    this.setDimension(58, taxonSlugs || "other");
  };

  StaticAnalytics.prototype.setTaxonIdsDimension = function (taxonIds) {
    this.setDimension(59, taxonIds || "other");
  };

  GOVUK.StaticAnalytics = StaticAnalytics;
})();
