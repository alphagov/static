/*
  Global bar

  Manages count of how many times a global bar has been seen
  using cookies.
*/
(function(Modules) {
  "use strict";

  Modules.GlobalBar = function() {
    this.start = function($el) {
      var GLOBAL_BAR_SEEN_COOKIE = "global_bar_seen",
          current_cookie_version = JSON.parse(GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE))["version"],
          count = viewCount();

      $el.on('click', '.dismiss', hide);
      $el.on('click', '.js-call-to-action', handleCallToActionClick);


      if ($el.is(':visible')) {
        incrementViewCount(count);
        track('Viewed');
      }

      function handleCallToActionClick () {
        var $link = $(this);
        var url = $link.attr('href')
        track(url);
      }

      function hide(evt) {
        $el.hide();
        var cookie_value = JSON.stringify({"count": 999, "version": current_cookie_version});
        GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, cookie_value, {days: 84});
        track('Manually dismissed');
        $('html').removeClass('show-global-bar');
        evt.preventDefault();
      }

      function incrementViewCount(count) {
        count = count + 1;
        var cookie_value = JSON.stringify({"count": count, "version": current_cookie_version});
        GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, cookie_value, {days: 84});

        if (count == 2) {
          track('Automatically dismissed');
        }
      }

      function viewCount() {
        var viewCountCookie = GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE),
            viewCount = parseInt(JSON.parse(viewCountCookie)["count"],10);

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
