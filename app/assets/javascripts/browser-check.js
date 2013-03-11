$(function() {
	var $prompt = $("#global-browser-prompt");

	if($("#global-cookie-warning").length == 0){
		if ( suchi.isOld(navigator.userAgent) ) {
			if(getCookie('not_first_visit') == "yes" && getCookie('browser_upgrade_dismissed') == null){
				$prompt.show();
				$prompt.find(".dismiss").on("click", function(){
					$prompt.hide();
					setCookie('browser_upgrade_dismissed', 'yes', 14);
					return false;
				});
			}
		}
	
		setCookie('not_first_visit', 'yes', 28);
	}
	$prompt.show();
});
