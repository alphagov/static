$(document).ready(function() {
  var popupContents;
  
	$("#cta-no").live("click", function(){
	  // send to a collection bucket
	  _gaq.push(['_trackEvent', 'Citizen-Feedback', 'No']);
	  $("#feedback-cta").html("<h2>Feedback</h2><p>Thanks for letting us know</p>");
	  //$("#feedback-cta").delay(1500).fadeOut('slow');
	  setCookie("govukfeedback","dismiss",7);
	})
  $("#cta-yes").live("click", function(){
    _gaq.push(['_trackEvent', 'Citizen-Feedback', "Yes"]);
    BetaPopup.popup(popupContents, "feedback-tools");
    $("#popup h2").focus;
    //$("#feedback-cta").fadeOut('fast');
    
		$("#popup form").live("submit", function(){
		  $.ajax({
        type: 'GET',
        url: this.action,
        data: $(this).serialize(),
        complete: function(){
          $("#popup form").html("<p class='feedback-thanks'>Thanks for your feedback</p><p>We'll send this feedback to the team.</p>")
        }
      });
		  return false;
		})	
		
		setCookie("govukfeedback","dismiss",7);
  });
  /*$("#feedback-dismiss").live("click", function(){
   // $("#feedback-cta").addClass("hide");
    _gaq.push(['_trackEvent', 'Citizen-Feedback', 'Dismiss']);
    setCookie("govukfeedback","dismiss",7);
    return;
  })*/
  
  if($("meta[name=x-section-format]").length != 0){
    setUpFeedback()
    if(getCookie("govukfeedback") == "dismiss"){
      $("#feedback-cta").addClass("hide"); 
    }
    else{
      setTimeout('$("#feedback-cta").addClass("hide");',5000);
    }
  }
  
  function setUpFeedback(){
    var html = "<div id='feedback-cta' class='left'><div class='inner'><h2>Feedback</h2><p>Can this page be better?</p><form><input id='cta-yes' type='button' value='Yes' /><input id='cta-no' type='button' value='No' /><p class='sets-cookie'><a href='/help/cookies#feedbackcookies' title='These buttons set a feedback cookie'>Sets a cookie</a></p></form></div></div>";
  	$("#entry_3").val(location.href);

  	popupContents = $("#govuk-feedback").html();
  	$("body").append(html);
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