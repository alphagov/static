$(document).ready(function() {
	 // Event handlers
    $('.customisation-settings.js').click(function() {
      _gaq.push(['_trackEvent', 'Citizen-Accessibility', 'Open']);
      BetaPopup.popup($("#global-locator-box").html(), "customisation-tools");
      $('.personalise-options li a').click(function(){
        _gaq.push(['_trackEvent', 'Citizen-Accessibility', $(this).text()]);
      })
      return false;
    });
    
});