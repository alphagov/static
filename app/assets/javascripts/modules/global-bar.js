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
      }

      function hide(evt) {
        $el.hide();
        GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, 999, {days: 28});
        evt.preventDefault();
      }

      function incrementViewCount(count) {
        GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, count + 1, {days: 28});
      }

      function viewCount() {
        var viewCountCookie = GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE),
            viewCount = parseInt(viewCountCookie, 10);

        if (isNaN(viewCount)) {
          viewCount = 0;
        }

        return viewCount;
      }
    };
  };

})(window.GOVUK.Modules);
