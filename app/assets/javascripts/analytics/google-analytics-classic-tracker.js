(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};
  window.GOVUK.Analytics = window.GOVUK.Analytics || {};

  GOVUK.Analytics.GoogleAnalyticsClassicTracker = function(id, cookieDomain) {
    configureProfile(id, cookieDomain);
    allowCrossDomainTracking();
    anonymizeIp();

    function configureProfile(id, cookieDomain) {
      _gaq.push(['_setAccount', id]);
      // TODO: Check that this is acceptable
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

  GOVUK.Analytics.GoogleAnalyticsClassicTracker.load = function() {
    var ga = document.createElement('script'),
        s = document.getElementsByTagName('script')[0];

    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    s.parentNode.insertBefore(ga, s);
  };

  // https://developers.google.com/analytics/devguides/collection/gajs/asyncMigrationExamples#VirtualPageviews
  GOVUK.Analytics.GoogleAnalyticsClassicTracker.prototype.trackPageview = function(path) {
    var pageview = ['_trackPageview'];

    if (typeof path === "string") {
      pageview.push(path);
    }

    _gaq.push(pageview);
  };

  // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
  GOVUK.Analytics.GoogleAnalyticsClassicTracker.prototype.trackEvent = function(category, action, label, value) {
    var evt = ["_trackEvent", category, action];

    // Label is optional
    if (typeof label === "string") {
      evt.push(label);
    }

    // Value is optional, but when used must be an
    // integer, otherwise the event will be invalid
    // and not logged
    if (value) {
      value = parseInt(value, 10);
      if (typeof value === "number" && !isNaN(value)) {
        evt.push(value);
      }
    }

    _gaq.push(evt);
  };

  // https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingCustomVariables
  GOVUK.Analytics.GoogleAnalyticsClassicTracker.prototype.setCustomVariable = function(index, value, name, scope) {
    _gaq.push(['_setCustomVar', index, name, String(value), scope]);
  };

})();
