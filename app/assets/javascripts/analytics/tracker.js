(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};
  window.GOVUK.Analytics = window.GOVUK.Analytics || {};

  var Tracker = function(universalId, classicId) {
    var self = this;
    self.universal = new GOVUK.Analytics.GoogleAnalyticsUniversalTracker(universalId, '.www.gov.uk');
    self.classic = new GOVUK.Analytics.GoogleAnalyticsClassicTracker(classicId, '.www.gov.uk');

    setPixelDensityDimension();
    setHTTPStatusCodeDimension();
    shimNextPageParams();

    self.trackPageview();

    function setPixelDensityDimension() {
      var pixelRatioDimensionIndex = 11;

      if (window.devicePixelRatio) {
        self.setDimension(pixelRatioDimensionIndex, window.devicePixelRatio, 'Pixel Ratio', 2);
      }
    }

    function setHTTPStatusCodeDimension() {
      var statusCode = window.httpStatusCode || 200,
          statusCodeDimensionIndex = 15;

      self.setDimension(statusCodeDimensionIndex, statusCode, 'httpStatusCode');
    }

    function shimNextPageParams() {
      // A cookie is sometimes set by apps to declare the GA parameters that
      // should run on the subsequent page. These declare the actual methods
      // to call in classic analytics. This is a temporary shim to ensure these
      // are applied to both classic and universal before updating apps.
      if (GOVUK.cookie && GOVUK.cookie('ga_nextpage_params') !== null){
        var classicParams = GOVUK.cookie('ga_nextpage_params').split(',');

        if (classicParams[0] == "_setCustomVar") {
          // index, value, name, scope
          self.setDimension(classicParams[1], classicParams[3], classicParams[2], classicParams[4]);
        }

        // Delete cookie
        GOVUK.cookie('ga_nextpage_params', null);
      }
    }
  };

  Tracker.load = function() {
    GOVUK.Analytics.GoogleAnalyticsClassicTracker.load();
    GOVUK.Analytics.GoogleAnalyticsUniversalTracker.load();
  };

  Tracker.prototype.trackPageview = function(path, title) {
    this.classic.trackPageview(path);
    this.universal.trackPageview(path, title);
  }

  Tracker.prototype.trackEvent = function(category, action, label, value) {
    this.classic.trackEvent(category, action, label, value);
    this.universal.trackEvent(category, action, label, value);
  }

  Tracker.prototype.setDimension = function(index, value, name, scope) {
    var PAGE_LEVEL_SCOPE = 3;
    scope = scope || PAGE_LEVEL_SCOPE;

    if (typeof index !== "number") {
      index = parseInt(index, 10);
    }

    if (typeof scope !== "number") {
      scope = parseInt(scope, 10);
    }

    this.universal.setDimension(index, value);
    this.classic.setCustomVariable(index, value, name, scope);
  };

  GOVUK.Analytics.Tracker = Tracker;
})();
