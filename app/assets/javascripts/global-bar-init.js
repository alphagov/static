//= require libs/GlobalBarHelper.js
//= require govuk_publishing_components/lib/cookie-functions

/* global parseCookie */

'use strict'
window.GOVUK = window.GOVUK || {}

// Bump this if you are releasing a major change to the banner
// This will reset the view count so all users will see the banner, even if previously seen
var BANNER_VERSION = 8
var GLOBAL_BAR_SEEN_COOKIE = 'global_bar_seen'

var globalBarInit = {
  getBannerVersion: function () {
    return BANNER_VERSION
  },

  getLatestCookie: function () {
    if (!window.GOVUK.cookie('cookies_policy')) {
      window.GOVUK.setDefaultConsentCookie()
    }
    var currentCookie = window.GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE)

    return currentCookie
  },

  urlBlockList: function () {
    var paths = [
      '^/coronavirus/.*$',
      '^/transition(.cy)?$',
      '^/transition-check/.*$',
      '^/eubusiness(\\..*)?$'
    ]

    var ctaLink = document.querySelector('.js-call-to-action')
    if (ctaLink) {
      var ctaPath = '^' + ctaLink.getAttribute('href') + '$'
      paths.push(ctaPath)
    }

    return new RegExp(paths.join('|')).test(window.location.pathname)
  },

  checkDuplicateCookie: function () {
    var cookies = document.cookie.split(';')
    var matches = 0
    var i

    for (i = 0; i < cookies.length; i++) {
      if (cookies[i] && cookies[i].indexOf('global_bar_seen') !== -1) {
        matches++
      }
    }

    if (matches > 1) {
      var possiblePaths = window.location.pathname.split('/')
      var pathString = ''

      // The duplicate cookie will have a path set to something other than "/".
      // The cookie will only surface on that path or it's sub-paths
      // As there isn't a way of directly finding out the path, we need to try cookie deletion with all path combinations possible on the current URL.
      for (i = 0; i < possiblePaths.length; i++) {
        if (possiblePaths[i] !== '') {
          pathString = pathString + '/' + possiblePaths[i]
          document.cookie = 'global_bar_seen=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=' + pathString
        }
      }
    }
  },

  setBannerCookie: function () {
    var cookieCategory = window.GOVUK.getCookieCategory(GLOBAL_BAR_SEEN_COOKIE)
    var cookieConsent = GOVUK.getConsentCookie()
    var value

    if (cookieConsent && cookieConsent[cookieCategory]) {
      // Coronavirus banner - auto hide after user has been on landing page
      if (window.location.pathname === '/coronavirus') {
        value = JSON.stringify({ count: 999, version: globalBarInit.getBannerVersion() })
      } else {
        value = JSON.stringify({ count: 0, version: globalBarInit.getBannerVersion() })
      }

      window.GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, value, { days: 84 })
    }
  },

  makeBannerVisible: function () {
    document.documentElement.className = document.documentElement.className.concat(' show-global-bar')
  },

  init: function () {
    var currentCookieVersion

    if (!globalBarInit.urlBlockList()) {
      // We had a bug which meant that the global_bar_seen cookie was sometimes set more than once.
      // This bug has now been fixed, but some users will be left with these duplicate cookies and therefore will continue to see the issue.
      // We need to check for duplicate cookies so we can delete them
      globalBarInit.checkDuplicateCookie()

      if (globalBarInit.getLatestCookie() === null) {
        globalBarInit.setBannerCookie()
        globalBarInit.makeBannerVisible()
      } else {
        currentCookieVersion = parseCookie(globalBarInit.getLatestCookie()).version

        if (currentCookieVersion !== globalBarInit.getBannerVersion()) {
          globalBarInit.setBannerCookie()
        }

        var newCookieCount = parseCookie(globalBarInit.getLatestCookie()).count

        // If banner has been manually dismissed, hide the additional info
        if (newCookieCount === 999) {
          var globalBarAdditional = document.querySelector('.global-bar-additional')
          if (globalBarAdditional) {
            globalBarAdditional.classList.remove('global-bar-additional--show')
          }
          var globarBarDismiss = document.querySelector('.global-bar__dismiss')
          if (globarBarDismiss) {
            globarBarDismiss.classList.remove('global-bar__dismiss--show')
          }
        }

        globalBarInit.makeBannerVisible()
      }
    } else {
      // If on a url in the blocklist, set cookie but don't show the banner
      if (globalBarInit.getLatestCookie() === null) {
        globalBarInit.setBannerCookie()
      } else {
        currentCookieVersion = parseCookie(globalBarInit.getLatestCookie()).version

        if (currentCookieVersion !== globalBarInit.getBannerVersion()) {
          globalBarInit.setBannerCookie()
        }
      }
    }
  }
}

window.GOVUK.globalBarInit = globalBarInit
