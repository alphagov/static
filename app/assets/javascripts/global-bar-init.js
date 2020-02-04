//= require libs/GlobalBarHelper.js
//= require govuk_publishing_components/lib/cookie-functions

'use strict'
window.GOVUK = window.GOVUK || {}

// Bump this if you are releasing a major change to the banner
// This will reset the view count so all users will see the banner, even if previously seen
var BANNER_VERSION = 3;

var globalBarInit = {
  getBannerVersion: function() {
    return BANNER_VERSION
  },

  getLatestCookie: function() {
    var currentCookie = document.cookie.match("(?:^|[ ;])(?:global_bar_seen=)(.+?)(?:(?=;|$))")

    if (currentCookie == null) {
      return currentCookie
    } else {
      return currentCookie[1]
    }
  },

  blacklistedUrl: function() {
    var paths = [
      "/register-to-vote",
      "/done",
      "/transition",
      "/transition-check"
    ]

    return new RegExp(paths.join("|")).test(window.location.pathname)
  },

  setBannerCookie: function() {
      var value = JSON.stringify({count: 0, version: globalBarInit.getBannerVersion()})

      window.GOVUK.setCookie("global_bar_seen", value, {days: 84});
  },

  makeBannerVisible: function() {
    document.documentElement.className = document.documentElement.className.concat(" show-global-bar")
  },

  init: function() {
    if (!globalBarInit.blacklistedUrl()) {
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
