$(function() {
	var $prompt = $("#global-browser-prompt");

	// we don't show the message when the cookie warning is also there
	if($("#global-cookie-warning").length === 0){
		if ( suchi.isOld(navigator.userAgent) ) {
			if(getCookie('not_first_visit') !== null && getCookie('browser_upgrade_dismissed') === null){
				$prompt.show();
				$prompt.find(".dismiss").on("click", function(){
					$prompt.hide();
					// the warning is dismissable for 2 weeks
					setCookie('browser_upgrade_dismissed', 'yes', 14);
					return false;
				});
			};
		};
	
		// We're not showing the message on first visit
		setCookie('not_first_visit', 'yes', 28);
	};
});
