$(document).ready(function() {
  
	var selects = $("#govuk-feedback #feedback-options").html();
	
	var html = "<div id='feedback-cta' class='left'><h2>Helpful?</h2><p><a href='#' class='close' id='feedback-dismiss' title='Close'>x</a></p<form><input id='cta-yes' type='button' value='Yes' /><input id='cta-no' type='button' value='No' /></form></div>";
	var delay = 6000; 
//	$("#feedback-options").append(selects);
	var popupContents = $("#govuk-feedback").html();
	$("body").append(html);
	$("#cta-yes").click(function(){
	  // send to a collection bucket
	  _gaq.push(['_trackEvent', 'Citizen-Feedback', 'Yes']);
	  $("#feedback-cta").html("<h2>Thanks for letting us know</h2>");
	  $("#feedback-cta").delay(1500).fadeOut('slow');
	  setCookie("govukfeedback","dismiss",7);
	  // set cookie to dismiss it for good
	})
  $("#cta-no").click(function(){
    _gaq.push(['_trackEvent', 'Citizen-Feedback', "No"]);
    BetaPopup.popup(popupContents, "feedback-tools");
    _gaq.push(['_trackEvent', 'Citizen-Feedback', 'Open']);
    $("#feedback-cta").fadeOut('fast');
    $("#feedback-type").live("change", function(){
      
			var id = $(this).find('option:selected').attr('id');

			switch(id)
			{
			case "policy":
				$("#popup #feedback-mechanism").html("<p>If you disagree with something relating to this subject, there are a couple of things you can do:</p><ul><li><a href='http://epetitions.direct.gov.uk/'>Start a petition</a></li><li><a href='http://www.writetothem.com/'>Contact your MP</a></li><ul>");
			  break;
			case "info":
				$("#popup #feedback-mechanism").html("<label>Explain which information you believe is missing</label><textarea /><input type='submit' value='Send' /><p>We'll send this feedback to our editorial team</p>");
			  break;
			case "suggestion":
				$("#popup #feedback-mechanism").html("<label>Send feedback</label><textarea /><input type='submit' value='Send' /><p>We'll send this feedback to our development team</p>");
				break;
			/*case "local":
				$("#popup #feedback-mechanism").html("<p>Please call: 09865 987543</p>");
				break;*/
			case "error":
				$("#popup #feedback-mechanism").html("<label>What were you trying to do and what went wrong?</label><textarea /><input type='submit' value='Send' /><p>We'll send this information and an error log to our development team</p>");
				break;
			default:
			  $("#popup #feedback-mechanism").html();
			}
			
			setCookie("govukfeedback","dismiss",7)
		});
  });
  $("#feedback-dismiss").click(function(){
    $("#feedback-cta").remove();
    _gaq.push(['_trackEvent', 'Citizen-Feedback', 'Dismiss']);
    setCookie("govukfeedback","dismiss",7);
  })
  
  if(getCookie("govukfeedback") != "dismiss"){
    $("#feedback-cta").delay(30000).fadeIn(1500);
  }
  
  function setCookie(name,value,days) {
      if (days) {
          var date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          var expires = "; expires="+date.toGMTString();
      }
      else var expires = "";
      document.cookie = name+"="+value+expires+"; path=/";
  }

  function getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }

});