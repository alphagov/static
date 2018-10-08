window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules, global) {
  'use strict'

  var $ = global.$

  Modules.crossDomainLinkedTrackers = []

  Modules.CrossDomainTracking = function () {
    this.start = function ($context) {
      var trackableLinkSelector = '[href][data-tracking-code][data-tracking-name]'

      if ($context.is(trackableLinkSelector)) {
        addLinkedTrackerDomain($context)
      } else {
        $context
          .find(trackableLinkSelector)
          .each(function () {
            var $element = $(this)
            var trackerName = $element.attr('data-tracking-name')
            if (Modules.crossDomainLinkedTrackers.indexOf(trackerName) === -1) {
              addLinkedTrackerDomain($element)
              Modules.crossDomainLinkedTrackers.push(trackerName)
            }
          })
      }
    }

    function addLinkedTrackerDomain ($element) {
      var code = $element.attr('data-tracking-code')
      var name = $element.attr('data-tracking-name')
      var trackEvent = ($element.attr('data-tracking-track-event') === 'true')
      var hostname = $element.prop('hostname')

      if (GOVUK.analytics !== 'undefined') {
        GOVUK.analytics.addLinkedTrackerDomain(code, name, hostname)

        if (trackEvent) {
          $element.click({ text: $element.text(), name: name }, function (e) {
            GOVUK.analytics.trackEvent("External Link Clicked", e.data.text, { trackerName: e.data.name })
          })
        }
      }
    }
  }
})(window.GOVUK.Modules, window)
