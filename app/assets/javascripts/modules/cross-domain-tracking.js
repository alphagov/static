window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules, global) {
  'use strict'

  var $ = global.$

  Modules.CrossDomainTracking = function () {
    this.start = function ($context) {
      var trackableLinkSelector = '[href][data-tracking-code][data-tracking-name]'

      if ($context.is(trackableLinkSelector)) {
        addLinkedTrackerDomain($context)
      } else {
        $context
          .find(trackableLinkSelector)
          .each(function () {
            addLinkedTrackerDomain($(this))
          })
      }
    }

    function addLinkedTrackerDomain ($element) {
      var code = $element.attr('data-tracking-code')
      var name = $element.attr('data-tracking-name')
      // The legacy behaviour is to always track page views
      // so make sure this is explicitly disabled.
      var trackPageView = ($element.attr('data-tracking-track-page-view') !== 'false')
      var hostname = $element.prop('hostname')

      if (GOVUK.analytics !== 'undefined') {
        GOVUK.analytics.addLinkedTrackerDomain(code, name, hostname, trackPageView)

        if (!trackPageView) {
          $element.click({ text: $element.text(), name: name }, function (e) {
            GOVUK.analytics.trackEvent("External Link Clicked", e.data.text, { trackerName: e.data.name })
          })
        }
      }
    }
  }
})(window.GOVUK.Modules, window)
