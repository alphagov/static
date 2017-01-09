window.GOVUK.Modules = window.GOVUK.Modules || {};

(function(Modules) {
  "use strict";

  Modules.TrackLinkClick = function () {
    this.start = function (element) {

      var LINK_TEXT_CUSTOM_DIMENSION_SLOT = 29;

      element.on('click', trackClick);

      var options = {},
          category = element.attr('data-track-category'),
          action = element.attr('data-track-action'),
          label = element.attr('data-track-label'),
          dimension = element.data('track-dimension');

      if (label) {
        options.label = label;
      }

      function trackClick() {
        if (GOVUK.analytics && GOVUK.analytics.setDimension && GOVUK.analytics.trackEvent) {
          GOVUK.analytics.setDimension(LINK_TEXT_CUSTOM_DIMENSION_SLOT, dimension);
          GOVUK.analytics.trackEvent(category, action, options);
        }
      }
    };
  };
})(window.GOVUK.Modules);
