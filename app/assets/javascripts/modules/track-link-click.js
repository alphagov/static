window.GOVUK.Modules = window.GOVUK.Modules || {};

(function(Modules) {
  "use strict";

  Modules.TrackLinkClick = function () {
    this.start = function (element) {

      var LINK_TEXT_CUSTOM_DIMENSION_SLOT = 29;

      element.on('click', onClick);

      var titleDimensionId = LINK_TEXT_CUSTOM_DIMENSION_SLOT,
          dimension = element.data('track-dimension'),
          trackClick = new GOVUK.Modules.TrackClick();

      trackClick.start(element);

      function onClick(e) {
        if (GOVUK.analytics && GOVUK.analytics.setDimension) {
          GOVUK.analytics.setDimension(titleDimensionId, dimension);
        }
      }
    };
  };
})(window.GOVUK.Modules);
