(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var StaticTracker = function(config) {
    var classicQueue,
        tracker;

    classicQueue = getClassicAnalyticsQueue();
    resetClassicAnalyticsQueue();

    tracker = new GOVUK.Tracker(config);
    this.tracker = tracker;

    setPixelDensityDimension();
    setHTTPStatusCodeDimension();
    shimNextPageParams();
    shimClassicAnalyticsQueue(classicQueue);

    // Track initial pageview
    tracker.trackPageview();

    // Begin error and print tracking
    GOVUK.analyticsPlugins.error();
    GOVUK.analyticsPlugins.printIntent();

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
      if (window.devicePixelRatio) {
        tracker.setDimension(11, window.devicePixelRatio, 'Pixel Ratio', 2);
      }
    }

    function setHTTPStatusCodeDimension() {
      tracker.setDimension(15, window.httpStatusCode || 200, 'httpStatusCode');
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
      tracker.setDimension(customVar[1], customVar[3], customVar[2], customVar[4]);
    }

  };

  StaticTracker.load = function() {
    GOVUK.Tracker.load();
  };

  StaticTracker.prototype.trackPageview = function(path, title) {
    this.tracker.trackPageview(path, title);
  }

  StaticTracker.prototype.trackEvent = function(category, action, options) {
    this.tracker.trackEvent(category, action, options);
  };

  StaticTracker.prototype.setDimension = function(index, value, name, scope) {
    this.tracker.setDimension(index, value, name, scope);
  };

  StaticTracker.prototype.trackShare = function(network) {
    this.tracker.trackShare(network);
  };

  StaticTracker.prototype.setSearchPositionDimension = function(position) {
    this.tracker.setDimension(21, position, 'searchPosition');
  };

  StaticTracker.prototype.setResultCountDimension = function(count) {
    this.tracker.setDimension(5, count, 'ResultCount');
  };

  StaticTracker.prototype.setSectionDimension = function(section) {
    this.tracker.setDimension(1, section, 'Section');
  };

  GOVUK.StaticTracker = StaticTracker;
})();
