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
      var hostname = $element.prop('hostname')

      if (GOVUK.analytics !== 'undefined') {
        GOVUK.analytics.addLinkedTrackerDomain(code, name, hostname)
      }
    }
  }
})(window.GOVUK.Modules, window)
