/* globals suchi */

$(function () {
  'use strict'
  function browserWarning () {
    var container = $('<div id="global-browser-prompt"></div>')
    var text = $('<p><a href="/help/browsers">Upgrade your web browser</a> (the software you use to access the internet), it’s out of date</p>')
    var closeLink = $('<a href="#" class="dismiss" title="Dismiss this message">Close</a>')

    return container.append(text.append(closeLink))
  }

  // we don't show the message when the cookie warning is also there
  if (GOVUK.cookie('seen_cookie_message')) {
    var tlsCookie = GOVUK.getCookie('TLSversion')
    var tlsIsOld = (tlsCookie === 'TLSv1' || tlsCookie === 'TLSv1.1')
    var browserIsOld = suchi.isOld(navigator.userAgent)

    if (browserIsOld || tlsIsOld) {
      if (GOVUK.cookie('govuk_not_first_visit') !== null && GOVUK.cookie('govuk_browser_upgrade_dismissed') === null) {
        var $prompt = browserWarning()
        $('#global-cookie-message').after($prompt)
        $prompt.show()

        GOVUK.analytics.trackEvent('browser-check', 'prompt-shown', { value: 1, nonInteraction: true })
        if (tlsIsOld && !browserIsOld) {
          GOVUK.analytics.trackEvent('browser-check', 'prompt-shown-tls', { value: 1, nonInteraction: true })
        }

        $prompt.on('click', '.dismiss', function (e) {
          $prompt.hide()
          // the warning is dismissable for 4 weeks, for users who are not in a
          // position to upgrade right now or unable to (no control of browser)
          GOVUK.cookie('govuk_browser_upgrade_dismissed', 'yes', { days: 28 })
        })
      }
    }

    // We're not showing the message on first visit
    GOVUK.cookie('govuk_not_first_visit', 'yes', { days: 28 })
  }
})
