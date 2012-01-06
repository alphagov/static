$(document).ready(function() {
	
	var html = "<div id='feedback-cta' class='left'><h2>Helpful?</h2><p><a href='#' class='close' id='feedback-dismiss' title='Close'>x</a></p<form><input id='cta-yes' type='button' value='Yes' /><input id='cta-no' type='button' value='No' /></form></div>";
	var delay = 6000; 
	var popupContents = $("#feedback-popup").html();
	$("body").append(html);
	$("#cta-yes").click(function(){
	  // send to a collection bucket
	  _gaq.push(['_trackEvent', 'Citizen-Feedback', 'Yes']);
	  $("#feedback-cta").html("<h2>Thanks for letting us know</h2>");
	  $("#feedback-cta").delay(1500).fadeOut('slow');
	  // set cookie to dismiss it for good
	});
  $("#cta-no").click(function(){
    _gaq.push(['_trackEvent', 'Citizen-Feedback', "No"]);
    BetaPopup.popup(popupContents, "feedback-tools");
    _gaq.push(['_trackEvent', 'Citizen-Feedback', 'Open']);
    $("#feedback-cta").fadeOut('fast');
    
  });
  $("#feedback-dismiss").click(function(){
    $("#feedback-cta").remove();
  })
  $("#feedback-cta").delay(300).fadeIn(1500);
});