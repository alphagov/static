//= require libs/GlobalBarHelper.js
//= require govuk_publishing_components/lib/cookie-functions

'use strict'
window.GOVUK = window.GOVUK || {}

// Bump this if you are releasing a major change to the banner
// This will reset the view count so all users will see the banner, even if previously seen
var BANNER_VERSION = 4;
var GLOBAL_BAR_SEEN_COOKIE = "global_bar_seen"

var globalBarInit = {
  getBannerVersion: function() {
    return BANNER_VERSION
  },

  getLatestCookie: function() {
    var currentCookie = window.GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE)

    if (currentCookie == null) {
      return currentCookie
    } else {
      return currentCookie
    }
  },

  urlBlockList: function() {
    var paths = [
      "/done",
      "/transition-check"
    ]

    var ctaLink = document.querySelector('.js-call-to-action')
    if (ctaLink) {
      paths.push(ctaLink.getAttribute('href'))
    }

    return new RegExp(paths.join("|")).test(window.location.pathname)
  },

  checkDuplicateCookie: function() {
    var cookies = document.cookie.split(';')
    var matches = 0

    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i] && cookies[i].indexOf('global_bar_seen') !== -1) {
        matches++
      }
    }

    if (matches > 1) {
      var possiblePaths = window.location.pathname.split("/")
      var pathString= ""

      // The duplicate cookie will have a path set to something other than "/".
      // The cookie will only surface on that path or it's sub-paths
      // As there isn't a way of directly finding out the path, we need to try cookie deletion with all path combinations possible on the current URL.
      for (var i = 0; i < possiblePaths.length; i++) {
        if (possiblePaths[i] !== "") {
          pathString = pathString + "/" + possiblePaths[i]
          document.cookie = 'global_bar_seen=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=' + pathString
        }
      }
    }
  },

  setBannerCookie: function() {
    var cookieCategory = window.GOVUK.getCookieCategory(GLOBAL_BAR_SEEN_COOKIE)
    var cookieConsent = GOVUK.getConsentCookie()

    if (cookieConsent && cookieConsent[cookieCategory]) {
      var value = JSON.stringify({count: 0, version: globalBarInit.getBannerVersion()})

      window.GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, value, {days: 84});
    }
  },

  makeBannerVisible: function() {
    document.documentElement.className = document.documentElement.className.concat(" show-global-bar")
  },

  init: function() {
    if (!globalBarInit.urlBlockList()) {
      // We had a bug which meant that the global_bar_seen cookie was sometimes set more than once.
      // This bug has now been fixed, but some users will be left with these duplicate cookies and therefore will continue to see the issue.
      // We need to check for duplicate cookies so we can delete them
      globalBarInit.checkDuplicateCookie()

      if (globalBarInit.getLatestCookie() === null) {
        globalBarInit.setBannerCookie()
        globalBarInit.makeBannerVisible()
      } else {
        var currentCookieVersion = parseCookie(globalBarInit.getLatestCookie()).version

        if (currentCookieVersion !== globalBarInit.getBannerVersion()) {
          globalBarInit.setBannerCookie()
        }

        var newCookieCount = parseCookie(globalBarInit.getLatestCookie()).count

        if (newCookieCount < 3) {
          globalBarInit.makeBannerVisible()
        }
      }
    }
  }
}

window.GOVUK.globalBarInit = globalBarInit;
