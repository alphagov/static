window.GOVUK.Modules = window.GOVUK.Modules || {};

(function(Modules) {
  "use strict";

  Modules.TrackClick = function () {
    this.start = function (element) {
      element.on('click', trackClick);

      var options = {transport: 'beacon'},
          category = element.attr('data-track-category'),
          action = element.attr('data-track-action'),
          label = element.attr('data-track-label'),
          dimension = element.attr('data-track-dimension'),
          dimensionIndex = element.attr('data-track-dimension-index');

      if (label) {
        options.label = label;
      }

      if (dimension && dimensionIndex) {
        options['dimension' + dimensionIndex] = dimension;
      }

      function trackClick() {
        if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
          GOVUK.analytics.trackEvent(category, action, options);
        }
      }
    };
  };
})(window.GOVUK.Modules);
