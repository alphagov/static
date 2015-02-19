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
    this.universal.setDimension(index, value);
    this.classic.setCustomVariable(index, value, name, scope);
  };

  GOVUK.Analytics.Tracker = Tracker;
})();
