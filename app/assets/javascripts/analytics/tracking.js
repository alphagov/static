(function() {
  "use strict";

  window.GOVUK = window.GOVUK || {};
  window._gaq = window._gaq || [];

  GOVUK.sendToAnalytics = function (analyticsData) {
    window._gaq.push(analyticsData);
  };
}());
