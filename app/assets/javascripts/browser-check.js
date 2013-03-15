$(function() {
	
	// we don't show the message when the cookie warning is also there
  if (getCookie('seen_cookie_message')) {
		if ( suchi.isOld(navigator.userAgent) ) {
			if(getCookie('govuk_not_first_visit') !== null && getCookie('govuk_browser_upgrade_dismissed') === null){
				var $prompt = $("#global-browser-prompt");
				$prompt.show();
				$prompt.find(".dismiss").on("click", function(){
					$prompt.hide();
					// the warning is dismissable for 2 weeks
					setCookie('govuk_browser_upgrade_dismissed', 'yes', 14);
					return false;
				});
			}
		}
	

		// We're not showing the message on first visit
		setCookie('govuk_not_first_visit', 'yes', 28);
  }
});
