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
          count = viewCount();

      $el.on('click', '.dismiss', hide);

      if ($el.is(':visible')) {
        incrementViewCount(count);
        track('Viewed');
      }

      function hide(evt) {
        $el.hide();
        GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, 999, {days: 84});
        track('Manually dismissed');
        $('html').removeClass('show-global-bar');
        evt.preventDefault();
      }

      function incrementViewCount(count) {
        count = count + 1;
        GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, count, {days: 84});

        if (count == 2) {
          track('Automatically dismissed');
        }
      }

      function viewCount() {
        var viewCountCookie = GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE),
            viewCount = parseInt(viewCountCookie, 10);

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
