(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var Tracker = function(universalId, classicId) {
    var self = this,
        classicQueue;

    classicQueue = getClassicAnalyticsQueue();
    resetClassicAnalyticsQueue();

    self.universal = new GOVUK.GoogleAnalyticsUniversalTracker(universalId, '.www.gov.uk');
    self.classic = new GOVUK.GoogleAnalyticsClassicTracker(classicId, '.www.gov.uk');

    setPixelDensityDimension();
    setHTTPStatusCodeDimension();
    shimNextPageParams();
    shimClassicAnalyticsQueue(classicQueue);

    self.trackPageview();

    function getClassicAnalyticsQueue() {
      // Slimmer inserts custom variables into the ga-params script tag
      // https://github.com/alphagov/slimmer/blob/master/lib/slimmer/processors/google_analytics_configurator.rb
      // Pickout these variables before continuing
      return (window._gaq && window._gaq.length) > 0 ? window._gaq.slice() : [];
    }

    function resetClassicAnalyticsQueue() {
      window._gaq = [];
    }

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
          setDimensionFromCustomVariable(classicParams);
        }

        // Delete cookie
        GOVUK.cookie('ga_nextpage_params', null);
      }
    }

    function shimClassicAnalyticsQueue(queue) {
      $.each(queue, function(index, classicParams) {
        if (classicParams[0] == "_setCustomVar") {
          setDimensionFromCustomVariable(classicParams);
        }
      });
    }

    function setDimensionFromCustomVariable(customVar) {
      // index, value, name, scope
      self.setDimension(customVar[1], customVar[3], customVar[2], customVar[4]);
    }

  };

  Tracker.load = function() {
    GOVUK.GoogleAnalyticsClassicTracker.load();
    GOVUK.GoogleAnalyticsUniversalTracker.load();
  };

  Tracker.prototype.trackPageview = function(path, title) {
    this.classic.trackPageview(path);
    this.universal.trackPageview(path, title);
  }

  Tracker.prototype.trackEvent = function(category, action, label, value, nonInteraction) {
    this.classic.trackEvent(category, action, label, value, nonInteraction);
    this.universal.trackEvent(category, action, label, value, nonInteraction);
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

  GOVUK.Tracker = Tracker;
})();
