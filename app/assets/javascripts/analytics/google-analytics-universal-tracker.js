(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};
  window.GOVUK.Analytics = window.GOVUK.Analytics || {};

  var GoogleAnalyticsUniversalTracker = function(id, cookieDomain) {
    configureProfile(id, cookieDomain);
    allowCrossDomainTracking();
    anonymizeIp();

    function configureProfile(id, cookieDomain) {
      sendToGa('create', id, {'cookieDomain': cookieDomain});
    }

    function allowCrossDomainTracking() {
      //TODO: Does Universal need this? Classic has it.
    }

    function anonymizeIp() {
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#anonymizeip
      sendToGa('set', 'anonymizeIp', true);
    }
  };

  GoogleAnalyticsUniversalTracker.load = function() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                             m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  };

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
  GoogleAnalyticsUniversalTracker.prototype.trackPageview = function(path, title) {
    if (typeof path === "string") {
      var pageviewObject = {
            page: path
          };

      if (typeof title === "string") {
        pageviewObject.title = title;
      }
      sendToGa('send', 'pageview', pageviewObject);
    } else {
      sendToGa('send', 'pageview');
    }
  };

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
  GoogleAnalyticsUniversalTracker.prototype.trackEvent = function(category, action, label, value, nonInteraction) {
    var evt = {
          hitType: 'event',
          eventCategory: category,
          eventAction: action
        };

    // Label is optional
    if (typeof label === "string") {
      evt.eventLabel = label;
    }

    // Value is optional, but when used must be an
    // integer, otherwise the event will be invalid
    // and not logged
    if (value || value === 0) {
      value = parseInt(value, 10);
      if (typeof value === "number" && !isNaN(value)) {
        evt.eventValue = value;
      }
    }

    // Prevents an event from affecting bounce rate
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/events#implementation
    if (nonInteraction) {
      evt.nonInteraction = 1;
    }

    sendToGa('send', evt);
  };

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets
  GoogleAnalyticsUniversalTracker.prototype.setDimension = function(index, value) {
    sendToGa('set', 'dimension' + index, String(value));
  };

  function sendToGa() {
    if (typeof window.ga === "function") {
      ga.apply(window, arguments);
    }
  }

  GOVUK.Analytics.GoogleAnalyticsUniversalTracker = GoogleAnalyticsUniversalTracker;
})();
