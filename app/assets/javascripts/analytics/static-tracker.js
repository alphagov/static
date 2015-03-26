(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var StaticTracker = function(config) {

    // Create universal and classic analytics tracker
    // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md
    // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/javascripts/govuk/analytics/tracker.js
    var tracker = new GOVUK.Tracker(config);
    this.tracker = tracker;

    setPixelDensityDimension();
    setHTTPStatusCodeDimension();
    this.setDimensionsFromMetaTags();
    this.callMethodRequestedByPreviousPage();

    // Track initial pageview
    tracker.trackPageview();

    // Begin error and print tracking
    GOVUK.analyticsPlugins.error();
    GOVUK.analyticsPlugins.printIntent();

    function setPixelDensityDimension() {
      if (window.devicePixelRatio) {
        tracker.setDimension(11, window.devicePixelRatio, 'Pixel Ratio', 2);
      }
    }

    function setHTTPStatusCodeDimension() {
      tracker.setDimension(15, window.httpStatusCode || 200, 'httpStatusCode');
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
    GOVUK.Tracker.load();
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
  };

  StaticTracker.prototype.trackPageview = function(path, title) {
    this.tracker.trackPageview(path, title);
  };

  StaticTracker.prototype.trackEvent = function(category, action, options) {
    this.tracker.trackEvent(category, action, options);
  };

  StaticTracker.prototype.setDimension = function(index, value, name, scope) {
    if (typeof value === "undefined") {
      return;
    }

    this.tracker.setDimension(index, value, name, scope);
  };

  StaticTracker.prototype.trackShare = function(network) {
    this.tracker.trackShare(network);
  };

  StaticTracker.prototype.setSectionDimension = function(section) {
    this.setDimension(1, section, 'Section');
  };

  StaticTracker.prototype.setFormatDimension = function(format) {
    this.setDimension(2, format, 'Format');
  };

  StaticTracker.prototype.setNeedIDsDimension = function(ids) {
    this.setDimension(3, ids, 'NeedID');
  };

  StaticTracker.prototype.setResultCountDimension = function(count) {
    this.setDimension(5, count, 'ResultCount');
  };

  StaticTracker.prototype.setPublishingGovernmentDimension = function(government) {
    this.setDimension(6, government, 'PublishingGovernment');
  };

  StaticTracker.prototype.setPoliticalStatusDimension = function(status) {
    this.setDimension(7, status, 'PoliticalStatus');
  };

  StaticTracker.prototype.setOrganisationsDimension = function(orgs) {
    this.setDimension(9, orgs, 'Organisations');
  };

  StaticTracker.prototype.setWorldLocationsDimension = function(locations) {
    this.setDimension(10, locations, 'WorldLocations');
  };

  StaticTracker.prototype.setSearchPositionDimension = function(position) {
    this.setDimension(21, position, 'searchPosition');
  };

  GOVUK.StaticTracker = StaticTracker;
})();
