$(document).ready(function() {
	 // Event handlers
    $('.customise-options').click(function() {
      _gaq.push(['_trackEvent', 'Citizen-Accessibility', 'Open']);
      BetaPopup.popup($("#global-locator-box").html());
      $('.personalise-options li a').click(function(){
        _gaq.push(['_trackEvent', 'Citizen-Accessibility', $(this).text()]);
      })
      return false;
    });
    
});