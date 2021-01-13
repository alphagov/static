//= require libs/GlobalBarHelper.js

/* global parseCookie */

/*
  Global bar

  Manages count of how many times a global bar has been seen
  using cookies.
*/
(function (Modules) {
  'use strict'

  Modules.GlobalBar = function () {
    this.start = function ($el) {
      var GLOBAL_BAR_SEEN_COOKIE = 'global_bar_seen'
      var alwaysOn = $el.data('global-bar-permanent')
      var cookieCategory = GOVUK.getCookieCategory(GLOBAL_BAR_SEEN_COOKIE)
      var cookieConsent = GOVUK.getConsentCookie()[cookieCategory]

      if (cookieConsent) {
        // If the cookie is not set, let's set a basic one
        if (GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE) === null || parseCookie(GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE)).count === undefined) {
          GOVUK.setCookie('global_bar_seen', JSON.stringify({ count: 0, version: 0 }), { days: 84 })
        }

        var currentCookie = parseCookie(GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE))
        var currentCookieVersion = currentCookie.version
        var count = viewCount()
      }

      $el.on('click', '.dismiss', hide)
      $el.on('click', '.js-call-to-action', handleCallToActionClick)

      if ($el.is(':visible')) {
        if (!alwaysOn) {
          incrementViewCount(count)
        }
      }

      function handleCallToActionClick () {
        var $link = $(this)
        var url = $link.attr('href')
        track(url)
      }

      function hide (evt) {
        var currentCookie = parseCookie(GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE))
        var cookieVersion = currentCookieVersion

        if (currentCookie) {
          cookieVersion = currentCookie.version
        }

        var cookieValue = JSON.stringify({ count: 999, version: cookieVersion })
        GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, cookieValue, { days: 84 })
        $('.global-bar-additional').removeClass('global-bar-additional--show')
        $('.global-bar__dismiss').removeClass('global-bar__dismiss--show')
        track('Manually dismissed')
        evt.preventDefault()
      }

      function incrementViewCount (count) {
        count = count + 1
        var cookieValue = JSON.stringify({ count: count, version: currentCookieVersion })
        GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, cookieValue, { days: 84 })

        if (count === 2) {
          track('Automatically dismissed')
        }
      }

      function viewCount () {
        var viewCountCookie = GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE)
        var viewCount = parseInt(parseCookie(viewCountCookie).count, 10)

        if (isNaN(viewCount)) {
          viewCount = 0
        }

        return viewCount
      }

      function track (action) {
        if (GOVUK.analytics && typeof GOVUK.analytics.trackEvent === 'function') {
          GOVUK.analytics.trackEvent('Global bar', action, { nonInteraction: 1 })
        }
      }
    }
  }
})(window.GOVUK.Modules)
