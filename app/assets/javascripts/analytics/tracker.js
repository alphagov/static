(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};
  window.GOVUK.Analytics = window.GOVUK.Analytics || {};

  GOVUK.Analytics.Tracker = function(universalId, classicId) {
    this.universal = new GOVUK.Analytics.GoogleAnalyticsUniversalTracker(universalId, '.www.gov.uk');
    this.classic = new GOVUK.Analytics.GoogleAnalyticsClassicTracker(classicId, '.www.gov.uk');
    this.trackPageview();
  };

  GOVUK.Analytics.Tracker.load = function() {
    GOVUK.Analytics.GoogleAnalyticsClassicTracker.load();
    GOVUK.Analytics.GoogleAnalyticsUniversalTracker.load();
  };

  GOVUK.Analytics.Tracker.prototype.trackPageview = function(path, title) {
    this.classic.trackPageview(path);
    this.universal.trackPageview(path, title);
  }

  GOVUK.Analytics.Tracker.prototype.trackEvent = function(category, action, label, value) {
    this.classic.trackEvent(category, action, label, value);
    this.universal.trackEvent(category, action, label, value);
  }

  GOVUK.Analytics.Tracker.prototype.setDimension = function(index, value, name) {
    var PAGE_LEVEL_SCOPE = 3;
    this.universal.setDimension(index, value);
    this.classic.setCustomVariable(index, value, name, PAGE_LEVEL_SCOPE);
  };
})();
