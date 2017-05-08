(function () {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var StaticAnalytics = function (config) {

    // Create universal tracker
    // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md
    // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/javascripts/govuk/analytics/analytics.js
    this.analytics = new GOVUK.Analytics(config);

    this.callMethodRequestedByPreviousPage();
    var trackingOptions = getOptionsFromCookie();

    // Track initial pageview
    this.trackPageview(null, null, trackingOptions);

    // Begin error and print tracking
    GOVUK.analyticsPlugins.error({filenameMustMatch: /gov\.uk/});
    GOVUK.analyticsPlugins.printIntent();
    GOVUK.analyticsPlugins.mailtoLinkTracker();
    GOVUK.analyticsPlugins.externalLinkTracker();
    GOVUK.analyticsPlugins.downloadLinkTracker({
      selector: 'a[href*="/government/uploads"], a[href*="assets.publishing.service.gov.uk"]'
    });
  };

  // TODO: Remove once we're using setOptionsForNextPageview instead
  StaticAnalytics.prototype.callOnNextPage = function (method, params) {
    params = params || [];

    if (!$.isArray(params)) {
      params = [params];
    }

    if (GOVUK.cookie && typeof this[method] === "function") {
      params.unshift(method);
      GOVUK.cookie('analytics_next_page_call', JSON.stringify(params));
    }
  };

  // TODO: Remove once we're using setOptionsForNextPageview instead
  StaticAnalytics.prototype.callMethodRequestedByPreviousPage = function () {
    if (GOVUK.cookie && GOVUK.cookie('analytics_next_page_call') !== null) {
      var params, method;

      try {
        params = JSON.parse(GOVUK.cookie('analytics_next_page_call'));
        method = params.shift();
      } catch (e) {
      }

      if (method && typeof this[method] === "function") {
        this[method].apply(this, params);
        // Delete cookie
        GOVUK.cookie('analytics_next_page_call', null);
      }
    }
  };

  StaticAnalytics.load = function () {
    GOVUK.Analytics.load();
  };

  // TODO: Remove this, and its corresponding call in collections
  StaticAnalytics.prototype.setSectionDimension = function () {
  };

  // TODO: We're setting this at a session level, because it's called in frontend's live-search.js to update
  // the search count. We should make this consistent with the other dimensions and pass the dimension
  // directly into the pageview arguments.
  StaticAnalytics.prototype.setResultCountDimension = function (count) {
    this.setDimension(5, count);
  };

  // TODO: We're setting this at a session level, because it's used by search through callOnNextPage. We should
  // make this consistent with the other dimensions and pass the dimension directly into the pageview arguments.
  StaticAnalytics.prototype.setSearchPositionDimension = function (position) {
    this.setDimension(21, position);
  };

  StaticAnalytics.prototype.trackPageview = function (path, title, options) {
    var trackingOptions = this.customDimensions();
    $.extend(trackingOptions, options);
    this.analytics.trackPageview(path, title, trackingOptions);
  };

  StaticAnalytics.prototype.trackEvent = function (category, action, options) {
    this.analytics.trackEvent(category, action, options);
  };

  // TODO: Check for usage external to this file, and remove
  StaticAnalytics.prototype.setDimension = function (index, value, name, scope) {
    if (typeof value === "undefined") {
      return;
    }

    this.analytics.setDimension(index, value, name, scope);
  };

  StaticAnalytics.prototype.trackShare = function (network) {
    this.analytics.trackShare(network);
  };

  StaticAnalytics.prototype.addLinkedTrackerDomain = function (trackerId, name, domain) {
    this.analytics.addLinkedTrackerDomain(trackerId, name, domain);
  };

  StaticAnalytics.prototype.customDimensions = function () {
    var dimensions = $.extend(
      {},
      customDimensionsFromBrowser(),
      customDimensionsFromMetaTags(),
      customDimensionsFromDom(),
      abTestCustomDimensions()
    );

    return $.each(dimensions, function (key, value) {
      dimensions[key] = String(value);
    });
  };

  StaticAnalytics.prototype.setOptionsForNextPageview = function (options) {
    if (typeof options !== 'object') {
      return;
    }

    var cookieOptions = getOptionsFromCookie();
    $.extend(cookieOptions, options);

    this.setCookie('analytics_next_page_call', cookieOptions);
  };

  StaticAnalytics.prototype.setCookie = function (cookieName, object) {
    if (!GOVUK.cookie) {
      return;
    }

    if (!object) {
      GOVUK.cookie(cookieName, null);
    } else {
      // Singly-stringified JSON sometimes gets escaped when put into a cookie, but inconsistently. The command-line
      // tests will escape, but browser tests will not. Double-stringify in order to get consistently-escaped strings.
      GOVUK.cookie(cookieName, JSON.stringify(JSON.stringify(object)));
    }
  };

  StaticAnalytics.prototype.getCookie = function(cookieName) {
    if (!GOVUK.cookie) {
      return;
    }

    try {
      return JSON.parse(JSON.parse(GOVUK.cookie(cookieName)));
    } catch (error) {
      return null;
    }
  };

  function customDimensionsFromBrowser() {
    var customDimensions = {
      dimension15: window.httpStatusCode || 200,
      dimension16: GOVUK.cookie('TLSversion') || 'unknown'
    };

    if (window.devicePixelRatio) {
      customDimensions.dimension11 = window.devicePixelRatio;
    }

    return customDimensions;
  }

  function customDimensionsFromMetaTags() {
    var dimensionMappings = {
      'section': {dimension: 1},
      'format': {dimension: 2},
      'themes': {dimension: 3, defaultValue: 'other'},
      'content-id': {dimension: 4, defaultValue: '00000000-0000-0000-0000-000000000000'},
      'search-result-count': {dimension: 5},
      'publishing-government': {dimension: 6},
      'political-status': {dimension: 7},
      'analytics:organisations': {dimension: 9},
      'analytics:world-locations': {dimension: 10},
      'schema-name': {dimension: 17},
      'rendering-application': {dimension: 20},
      'navigation-page-type': {dimension: 32, defaultValue: 'none'},
      'user-journey-stage': {dimension: 33, defaultValue: 'thing'},
      'navigation-document-type': {dimension: 34, defaultValue: 'other'},
      'taxon-slug': {dimension: 56, defaultValue: 'other'},
      'taxon-id': {dimension: 57, defaultValue: 'other'},
      'taxon-slugs': {dimension: 58, defaultValue: 'other'},
      'taxon-ids': {dimension: 59, defaultValue: 'other'}
    };

    var $metas = $('meta[name^="govuk:"]');
    var customDimensions = {};
    var tags = {};

    $metas.each(function () {
      var $meta = $(this);
      var key = $meta.attr('name').split('govuk:')[1];

      var dimension = dimensionMappings[key];
      if (dimension) {
        tags[key] = $meta.attr('content');
      }
    });

    $.each(dimensionMappings, function (key, dimension) {
      var value = tags[key] || dimension.defaultValue;
      if (typeof value !== 'undefined') {
        customDimensions['dimension' + dimension.dimension] = value;
      }
    });

    return customDimensions;
  }

  function customDimensionsFromDom() {
    return {
      dimension26: totalNumberOfSections(),
      dimension27: totalNumberOfSectionLinks()
    };

    function totalNumberOfSections() {
      var sidebarSections = $('[data-track-count="sidebarRelatedItemSection"]').length;
      var sidebarTaxons = $('[data-track-count="sidebarTaxonSection"]').length;
      var accordionSubsections = $('[data-track-count="accordionSection"]').length;
      var gridSections = $('a[data-track-category="navGridLinkClicked"]').length;
      var browsePageSections = $('#subsection ul:visible').length ||
        $('#section ul').length;
      return sidebarSections || sidebarTaxons || accordionSubsections || gridSections || browsePageSections;
    }

    function totalNumberOfSectionLinks() {
      var relatedLinks = $('a[data-track-category="relatedLinkClicked"]').length;
      var accordionLinks = $('a[data-track-category="navAccordionLinkClicked"]').length;
      // Grid links are counted both as "sections" (see dimension 26), and as part of the total link count
      var gridLinks = $('a[data-track-category="navGridLinkClicked"]').length
        + $('a[data-track-category="navGridLeafLinkClicked"]').length;
      var leafLinks = $('a[data-track-category="navLeafLinkClicked"]').length;
      var browsePageLinks = $('#subsection ul a:visible').length ||
        $('#section ul a').length;
      return relatedLinks || accordionLinks || gridLinks || leafLinks || browsePageLinks;
    }
  }

  function abTestCustomDimensions() {
    // This is the block of dimensions assigned to A/B tests
    var minAbTestDimension = 40;
    var maxAbTestDimension = 49;
    var $abMetas = $('meta[name^="govuk:ab-test"]');
    var customDimensions = {};

    $abMetas.each(function () {
      var $meta = $(this);
      var dimension = parseInt($meta.data('analytics-dimension'));
      var testNameAndBucket = $meta.attr('content');

      if (dimension >= minAbTestDimension && dimension <= maxAbTestDimension) {
        customDimensions['dimension' + dimension] = testNameAndBucket;
      }
    });

    return customDimensions;
  }

  function getOptionsFromCookie() {
    try {
      var cookie = StaticAnalytics.prototype.getCookie('analytics_next_page_call');
      StaticAnalytics.prototype.setCookie('analytics_next_page_call', null);
      return cookie || {};
    } catch (e) {
      return {};
    }
  }

  GOVUK.StaticAnalytics = StaticAnalytics;
})();
