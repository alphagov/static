$(document).ready(function() {
	 // Event handlers
    $('.customise-options').click(function() {
      _gaq.push(['_trackEvent', 'Popup', 'Customisation', 'Opened']);
      BetaPopup.popup($("#global-locator-box").html());
      $('.personalise-options li a').click(function(){
        _gaq.push(['_trackEvent', 'Customise', 'Accessibility', $(this).text()]);
      })
      return false;
    });
    
});