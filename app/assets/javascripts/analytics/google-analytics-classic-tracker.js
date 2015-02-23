(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var GoogleAnalyticsClassicTracker = function(id, cookieDomain) {
    window._gaq = window._gaq || [];
    configureProfile(id, cookieDomain);
    allowCrossDomainTracking();
    anonymizeIp();

    function configureProfile(id, cookieDomain) {
      _gaq.push(['_setAccount', id]);
      _gaq.push(['_setDomainName', cookieDomain]);
    }

    function allowCrossDomainTracking() {
      _gaq.push(['_setAllowLinker', true]);
    }

    // https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApi_gat#_gat._anonymizeIp
    function anonymizeIp() {
      _gaq.push(['_gat._anonymizeIp']);
    }
  };

  GoogleAnalyticsClassicTracker.load = function() {
    var ga = document.createElement('script'),
        s = document.getElementsByTagName('script')[0];

    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    s.parentNode.insertBefore(ga, s);
  };

  // https://developers.google.com/analytics/devguides/collection/gajs/asyncMigrationExamples#VirtualPageviews
  GoogleAnalyticsClassicTracker.prototype.trackPageview = function(path) {
    var pageview = ['_trackPageview'];

    if (typeof path === "string") {
      pageview.push(path);
    }

    _gaq.push(pageview);
  };

  // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
  GoogleAnalyticsClassicTracker.prototype.trackEvent = function(category, action, label, value, nonInteraction) {
    var evt = ["_trackEvent", category, action];

    // Label is optional
    if (typeof label === "string") {
      evt.push(label);
    }

    // Value is optional, but when used must be an
    // integer, otherwise the event will be invalid
    // and not logged
    if (value || value === 0) {
      value = parseInt(value, 10);
      if (typeof value === "number" && !isNaN(value)) {
        evt.push(value);
      }
    }

    // Prevents an event from affecting bounce rate
    // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#non-interaction
    if (nonInteraction) {
      evt.push(true);
    }

    _gaq.push(evt);
  };

  // https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingCustomVariables
  GoogleAnalyticsClassicTracker.prototype.setCustomVariable = function(index, value, name, scope) {
    _gaq.push(['_setCustomVar', index, name, String(value), scope]);
  };

  GOVUK.GoogleAnalyticsClassicTracker = GoogleAnalyticsClassicTracker;
})();
