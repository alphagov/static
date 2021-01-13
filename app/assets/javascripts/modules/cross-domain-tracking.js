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
            addLinkedTrackerDomain($(this))
          })
      }
    }

    function addLinkedTrackerDomain ($element) {
      var name = $element.attr('data-tracking-name')
      var code = $element.attr('data-tracking-code')
      var trackEvent = ($element.attr('data-tracking-track-event') === 'true')

      if (GOVUK.analytics !== 'undefined') {
        if (Modules.crossDomainLinkedTrackers.indexOf(name) === -1) {
          var hostname = $element.prop('hostname')

          GOVUK.analytics.addLinkedTrackerDomain(code, name, hostname)

          Modules.crossDomainLinkedTrackers.push(name)
        }

        if (trackEvent) {
          $element.click({ text: $element.text(), name: name }, function (e) {
            GOVUK.analytics.trackEvent('External Link Clicked', e.data.text, { trackerName: e.data.name })
          })
        }
      }
    }
  }
})(window.GOVUK.Modules, window)
