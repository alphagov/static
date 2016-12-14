window.GOVUK.Modules = window.GOVUK.Modules || {};

(function(Modules) {
  "use strict";

  Modules.TrackBreadcrumbClick = function () {
    this.start = function (element) {
      element.on('click', trackBreadcrumbClick);

      var titleDimensionId = 29,
          dimension = element.data('track-dimension'),
          trackClick = new GOVUK.Modules.TrackClick();

      trackClick.start(element);

      function trackBreadcrumbClick(e) {
        if (GOVUK.analytics && GOVUK.analytics.setDimension) {
          GOVUK.analytics.setDimension(titleDimensionId, dimension);
        }
      }
    };
  };
})(window.GOVUK.Modules);
