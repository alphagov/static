$(document).ready(function() {
  
    setStyleSheet(getCookie("govuk-accessibility"));
    
    // create the cutosmistion thinger
    
	 // Event handlers
    $('.customisation-settings').click(function() {
      _gaq.push(['_trackEvent', 'Citizen-Accessibility', 'Open']);
       $(document).trigger('customisation-opened');
      //BetaPopup.popup(, "customisation-tools");
      
      $("#global-locator-box").hide();

      $("body").append("<div id='mask'></div>");
  		$("body").append("<div id='popup' class='customision-tools'></div>");
  		$("#popup").append("<a href='#' class='close'>Close</a>");
  	  $("#global-locator-box").appendTo($("#popup"));
      
      $("#global-locator-box").show();
  		//Get the screen height and width
  		var maskHeight = $(document).height();
  		var maskWidth = $(window).width();

   		//Set heigth and width to mask to fill up the whole screen
  		$('#mask').css({'width':maskWidth,'height':maskHeight});

  		$('#mask').fadeTo("fast",0.6);  

  		//Get the window height and width
  		var winH = $(window).height();
  		var winW = $(window).width();

  		//Set the popup window to center
  		$("#popup").css('left', winW/2-$("#popup").width()/2);

  		$("#popup").delay(100).fadeIn('fast');
  		$(".customision-tools .close").click(function(){
  			$("#popup").slideUp('fast');	
  			$("#mask").fadeOut('fast');
  		//	$("#mask").remove();
  		//	$("#popup").remove();
  		  $("#global-locator-box").hide();
  			return false;
  		})
  		
  		AlphaGeo.locate("#popup #global-locator-form", "{ignoreKnown: false, errorSelector: '#global-locator-error', noJSSubmit: false}")
      
      $('.personalise-options li a').click(function(){
        _gaq.push(['_trackEvent', 'Citizen-Accessibility', $(this).attr("id")]);
        
        if(getCookie("govuk-accessibility")){
          deleteCookie("govuk-accessibility");
        }
        setCookie("govuk-accessibility",$(this).attr("id"),1);
        setStyleSheet($(this).attr("id")); 
      });
      
      
      return false;
    });
    
    
    function setStyleSheet(match){
      if(match == "core"){
        deleteCookie("govuk-accessibility");
        toggleStyleSheets("dyslexic")
       
      }
      else{
        toggleStyleSheets(match);
      }
    }
      
    function toggleStyleSheets(match){
      var cssLinks = $("link[type='text/css']");

      var i = cssLinks.length,
        currentSS;
        while(i--){
          currentSS = $(cssLinks[i]).attr("href");
          currentSS = currentSS.split("/stylesheets/");
          currentSS = currentSS[1].split(".css");
          if(currentSS[0] == match){
            if ($(cssLinks[i]).attr('disabled')){
              $(cssLinks[i]).attr("rel", "stylesheet");
              $(cssLinks[i]).removeAttr('disabled');
            }
            else {
              $(cssLinks[i]).attr("rel", "alternate stylesheet");
              $(cssLinks[i]).attr('disabled', 'disabled');
            }
          }
        }
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

    function deleteCookie(name) {
      setCookie(name,"",-1);
    }
});