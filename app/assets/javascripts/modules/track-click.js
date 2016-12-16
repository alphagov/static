window.GOVUK.Modules = window.GOVUK.Modules || {};

(function(Modules) {
  "use strict";

  Modules.TrackClick = function () {
    this.start = function (element) {
      element.on('click', trackClick);

      var options = {},
          category = element.attr('data-track-category'),
          action = element.attr('data-track-action'),
          label = element.attr('data-track-label');

      if (label) {
        options.label = label;
      }

      function trackClick() {
        if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
          GOVUK.analytics.trackEvent(category, action, options);
        }
      }
    };
  };
})(window.GOVUK.Modules);
