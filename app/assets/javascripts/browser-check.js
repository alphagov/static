/*globals $, getCookie, suchi, setCookie */
/*jslint
 white: true,
 browser: true */

$(function() {
  "use strict";
  function browserWarning() {
    var container = $('<div id="global-browser-prompt"></div>'),
        text = $('<p>For a safer, faster, better experience online you should upgrade your browser.</p>'),
        findMoreLink = $('<a href="/support/browsers">Find out more about browsers</a>'),
        closeLink = $('<a href="#" class="dismiss" title="Dismiss this message">Close</a>');

    return container.append(text.append(findMoreLink, closeLink));
  }

  // we don't show the message when the cookie warning is also there
  if (getCookie('seen_cookie_message')) {
    if (suchi.isOld(navigator.userAgent)) {
      if(getCookie('govuk_not_first_visit') !== null && getCookie('govuk_browser_upgrade_dismissed') === null){
        var $prompt = browserWarning();
        $('#global-cookie-message').after($prompt);
        $prompt.show();
        $prompt.on("click", ".dismiss", function(e) {
          $prompt.hide();
          // the warning is dismissable for 2 weeks
          setCookie('govuk_browser_upgrade_dismissed', 'yes', 14);
        });
      }
    }

    // We're not showing the message on first visit
    setCookie('govuk_not_first_visit', 'yes', 28);
  }
});
