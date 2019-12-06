/*
  Global bar

  Manages count of how many times a global bar has been seen
  using cookies.
*/
//= require libs/GlobalBarHelper.js
(function(Modules) {
  "use strict";

  Modules.GlobalBar = function() {
    this.start = function($el) {
      var GLOBAL_BAR_SEEN_COOKIE = "global_bar_seen";
      var always_on = $el.data("global-bar-permanent");

      // If the cookie is not set, let's set a basic one
      if (GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE) === null || parseCookie(GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE))["count"] === undefined) {
        GOVUK.setCookie("global_bar_seen", JSON.stringify({count: 0, version: 0}), {days: 84});
      }

      var current_cookie = parseCookie(GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE)),
      current_cookie_version = current_cookie["version"],
      count = viewCount();

      $el.on('click', '.dismiss', hide);
      $el.on('click', '.js-call-to-action', handleCallToActionClick);


      if ($el.is(':visible')) {
        if (!always_on) {
          incrementViewCount(count);
        }
        track('Viewed');
      }

      function handleCallToActionClick () {
        var $link = $(this);
        var url = $link.attr('href')
        track(url);
      }

      function hide(evt) {
        $el.hide();
        var cookie_value = JSON.stringify({count: 999, version: current_cookie_version});
        GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, cookie_value, {days: 84});
        track('Manually dismissed');
        $('html').removeClass('show-global-bar');
        evt.preventDefault();
      }

      function incrementViewCount(count) {
        count = count + 1;
        var cookie_value = JSON.stringify({count: count, version: current_cookie_version});
        GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, cookie_value, {days: 84});

        if (count == 2) {
          track('Automatically dismissed');
        }
      }

      function viewCount() {
        var viewCountCookie = GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE),
            viewCount = parseInt(parseCookie(viewCountCookie)["count"],10);

        if (isNaN(viewCount)) {
          viewCount = 0;
        }

        return viewCount;
      }

      function track(action) {
        if (GOVUK.analytics && typeof GOVUK.analytics.trackEvent === "function") {
          GOVUK.analytics.trackEvent('Global bar', action, {nonInteraction: 1});
        }
      }
    };
  };

})(window.GOVUK.Modules);
