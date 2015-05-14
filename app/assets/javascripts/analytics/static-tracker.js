(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var StaticTracker = function(config) {

    // Create universal tracker
    // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md
    // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/javascripts/govuk/analytics/analytics.js
    var analytics = new GOVUK.Analytics(config);
    this.analytics = analytics;

    setPixelDensityDimension();
    setHTTPStatusCodeDimension();
    this.setDimensionsFromMetaTags();
    this.callMethodRequestedByPreviousPage();

    // Track initial pageview
    analytics.trackPageview();

    // Begin error and print tracking
    GOVUK.analyticsPlugins.error();
    GOVUK.analyticsPlugins.printIntent();

    function setPixelDensityDimension() {
      if (window.devicePixelRatio) {
        analytics.setDimension(11, window.devicePixelRatio);
      }
    }

    function setHTTPStatusCodeDimension() {
      analytics.setDimension(15, window.httpStatusCode || 200);
    }

  };

  StaticTracker.prototype.callOnNextPage = function(method, params) {
    params = params || [];

    if (!$.isArray(params)) {
      params = [params];
    }

    if (GOVUK.cookie && typeof this[method] === "function") {
      params.unshift(method);
      GOVUK.cookie('analytics_next_page_call', JSON.stringify(params));
    }
  };

  StaticTracker.prototype.callMethodRequestedByPreviousPage = function() {
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

  StaticTracker.load = function() {
    GOVUK.Analytics.load();
  };

  StaticTracker.prototype.setDimensionsFromMetaTags = function() {
    var $metas = $('meta[name^="govuk:"]'),
        dimensions = {};

    $metas.each(function() {
      var $meta = $(this),
          key = $meta.attr('name').split('govuk:')[1],
          value = $meta.attr('content');

      dimensions[key] = value;
    });

    this.setSectionDimension(dimensions['section']);
    this.setFormatDimension(dimensions['format']);
    this.setNeedIDsDimension(dimensions['need-ids']);
    this.setResultCountDimension(dimensions['search-result-count']);
    this.setPublishingGovernmentDimension(dimensions['publishing-government']);
    this.setPoliticalStatusDimension(dimensions['political-status']);
    this.setOrganisationsDimension(dimensions['analytics:organisations']);
    this.setWorldLocationsDimension(dimensions['analytics:world-locations']);
    this.setRenderingApplicationDimension(dimensions['rendering-application']);
  };

  StaticTracker.prototype.trackPageview = function(path, title) {
    this.analytics.trackPageview(path, title);
  };

  StaticTracker.prototype.trackEvent = function(category, action, options) {
    this.analytics.trackEvent(category, action, options);
  };

  StaticTracker.prototype.setDimension = function(index, value, name, scope) {
    if (typeof value === "undefined") {
      return;
    }

    this.analytics.setDimension(index, value, name, scope);
  };

  StaticTracker.prototype.trackShare = function(network) {
    this.analytics.trackShare(network);
  };

  StaticTracker.prototype.addLinkedTrackerDomain = function(trackerId, name, domain) {
    this.analytics.addLinkedTrackerDomain(trackerId, name, domain);
  };

  StaticTracker.prototype.setSectionDimension = function(section) {
    this.setDimension(1, section);
  };

  StaticTracker.prototype.setFormatDimension = function(format) {
    this.setDimension(2, format);
  };

  StaticTracker.prototype.setNeedIDsDimension = function(ids) {
    this.setDimension(3, ids);
  };

  StaticTracker.prototype.setResultCountDimension = function(count) {
    this.setDimension(5, count);
  };

  StaticTracker.prototype.setPublishingGovernmentDimension = function(government) {
    this.setDimension(6, government);
  };

  StaticTracker.prototype.setPoliticalStatusDimension = function(status) {
    this.setDimension(7, status);
  };

  StaticTracker.prototype.setOrganisationsDimension = function(orgs) {
    this.setDimension(9, orgs);
  };

  StaticTracker.prototype.setWorldLocationsDimension = function(locations) {
    this.setDimension(10, locations);
  };

  StaticTracker.prototype.setRenderingApplicationDimension = function(app) {
    this.setDimension(20, app, 'RenderingApps');
  };

  StaticTracker.prototype.setSearchPositionDimension = function(position) {
    this.setDimension(21, position);
  };

  GOVUK.StaticTracker = StaticTracker;
})();
