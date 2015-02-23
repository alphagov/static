/*globals $, GOVUK, suchi */
/*jslint
 white: true,
 browser: true */

$(function() {
  "use strict";
  function browserWarning() {
    var container = $('<div id="global-browser-prompt"></div>'),
        text = $('<p><a href="/help/browsers">Upgrade your web browser</a> (the software you use to access the internet), it’s out of date</p>'),
        closeLink = $('<a href="#" class="dismiss" title="Dismiss this message">Close</a>');

    return container.append(text.append(closeLink));
  }

  // we don't show the message when the cookie warning is also there
  if (GOVUK.cookie('seen_cookie_message')) {
    if (suchi.isOld(navigator.userAgent)) {
      if(GOVUK.cookie('govuk_not_first_visit') !== null && GOVUK.cookie('govuk_browser_upgrade_dismissed') === null){
        var $prompt = browserWarning();
        $('#global-cookie-message').after($prompt);
        $prompt.show();
        GOVUK.analytics.trackEvent('browser-check', 'prompt-shown', '', 1, true);
        $prompt.on("click", ".dismiss", function(e) {
          $prompt.hide();
          // the warning is dismissable for 4 weeks, for users who are not in a
          // position to upgrade right now or unable to (no control of browser)
          GOVUK.cookie('govuk_browser_upgrade_dismissed', 'yes', { days: 28 });
        });
      }
    }

    // We're not showing the message on first visit
    GOVUK.cookie('govuk_not_first_visit', 'yes', { days: 28 });
  }
});
