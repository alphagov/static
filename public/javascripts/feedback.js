$(document).ready(function() {
	$("body").addClass("js-enabled");
	var selects = "<select id='feedback-type'>"+
	  "<option selected>Select feedback:</option>"+
	  "<option id='policy'>I disagree with a Government policy relating to this subject</option>"+
	  "<option id='info'>Some information is missing about this subject</option>"+
	  "<option id='suggestion'>I would like to make a suggestion about this subject</option>"+
	  "<option id='local'>I need to contact someone about this subject</option>"+
	  "<option id='error'>I received an error or the page isn't working properly</option>"+
	  "</select>";
	
	var html = "<div id='feedback-cta' class='left'><h2>Did you find what you're looking for?</h2><form><input id='cta-yes' type='button' value='Yes' /><input id='cta-no' type='button' value='No' /></form></div>";
	var delay = 6000;
	$("#feedback-options").append(selects);
	var popupContents = $("#feedback-popup").html();
	$("body").append(html);
	$("#cta-yes").click(function(){
	  // send to a collection bucket
	  _gaq.push(['_trackEvent', 'Citizen-Feedback', 'Yes']);
	  $("#feedback-cta").html("<h2>Thanks for letting us know</h2>");
	  $("#feedback-cta").delay(1500).fadeOut('slow');
	})
  $("#cta-no").click(function(){
    _gaq.push(['_trackEvent', 'Citizen-Feedback', "No"]);
    BetaPopup.popup(popupContents);
    _gaq.push(['_trackEvent', 'Citizen-Feedback', 'Open']);
    $("#feedback-cta").fadeOut('fast');
    $("#feedback-type").change(function(){
			var id = $(this).find('option:selected').attr('id');
			switch(id)
			{
			case "policy":
				$("#feedback-mechanism").html("<p>If you disagree with something relating to this subject, there are a couple of things you can do:</p><ul><li><a href='http://epetitions.direct.gov.uk/'>Start a petition</a></li><li><a href='http://www.writetothem.com/'>Contact your MP</a></li><ul>");
			  break;
			case "info":
				$("#feedback-mechanism").html("<label>Explain which information you believe is missing</label><textarea /><input type='submit' value='Send' /><p>We'll send this feedback to our editorial team</p>");
			  break;
			case "suggestion":
				$("#feedback-mechanism").html("<label>Send feedback</label><textarea /><input type='submit' value='Send' /><p>We'll send this feedback to our development team</p>");
				break;
			case "local":
				$("#feedback-mechanism").html("<p>Please call: 09865 987543</p>");
				break;
			case "error":
				$("#feedback-mechanism").html("<label>What were you trying to do and what went wrong?</label><textarea /><input type='submit' value='Send' /><p>We'll send this information and an error log to our development team</p>");
				break;
			default:
			  $("#feedback-mechanism").html();
			}
			
		});
  })
  $("#feedback-cta").delay(3000).fadeIn(1500);
});