$(document).ready(function() {
  
    setStyleSheet(getCookie("govuk-accessibility"));
    $(".customisation-settings").attr("title", "The settings link will open an overlay panel when clicked");
    $(document).keydown( function(e) {
      if (e.keyCode == 27) {
        $("#popup").slideUp('fast').remove(); 
        $("#mask").fadeOut('fast').remove();  
      }  
    });

	 // Event handlers
    $('.customisation-settings').click(function(e) {
       $(document).trigger('customisation-opened');
      //BetaPopup.popup(, "customisation-tools");

      $("body").prepend("<div id='mask'></div>");
  		$("body").prepend("<div id='popup' class='customisation-tools'></div>");

      $.get('/settings.raw', function(data){
        $('#popup').html(data).prepend("<p class='close'><a href='#' title='Click or press escape to close the settings panel'>Close</a></a>"); 
      });
  	  
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

  		$("#popup").delay(100).fadeIn('fast', function(){
  		  $(".customisation-tools h2").attr("tabindex",-1).focus();
  		  // if we get outside the lightbox, trap the focus and send it back
  		  $("#popup").live('blur', function(){
  		    $(".customisation-tools h2").attr("tabindex",-1).focus();
  		  })
  		  if($(".wordsdifficult").attr("rel", "alternate stylesheet")){
  		    // alt set
		    }
		    else{
		      // core set
		    }
  		});
  		
  		
  		
  		$(".customisation-tools .close").live('click', function(e){
  			e.preventDefault();
  			$("#popup").unbind('blur');
        $("#popup").slideUp('fast').remove();	
  			$("#mask").fadeOut('fast').remove();
  			$(".customisation-settings").focus();
  		  // $("#global-locator-box").hide();
  		});
  		
      
      $('.personalise-options').live("submit", function(){

        var id = $('input[name=acc-options]:checked').val();
        _gaq.push(['_trackEvent', 'Citizen-Accessibility', $(this).attr("id")]);
        if(getCookie("govuk-accessibility")){
          deleteCookie("govuk-accessibility");
        }
        setCookie("govuk-accessibility",id,1);
        setStyleSheet(id); 
      return false;
      });
      
      e.preventDefault();
      
    });
    
    
    function setStyleSheet(match){
      if(match == "core"){
        deleteCookie("govuk-accessibility");
        $(".wordsdifficult").attr("rel", "alternate stylesheet");
        $(".wordsdifficult").attr('disabled', 'disabled');
       // toggleStyleSheets("wordsdifficult")
       
      }
      else{
        $(".wordsdifficult").attr("rel", "stylesheet");
        $(".wordsdifficult").removeAttr('disabled');
      }
    }
      
    /*function toggleStyleSheets(match){
      //var cssLinks = $("link[type='text/css']");
      if($("."+match).attr("disabled")){
        $("."+match).attr("rel", "stylesheet");
        $("."+match).removeAttr('disabled');
      }
      else {
        $("."+match).attr("rel", "alternate stylesheet");
        $("."+match).attr('disabled', 'disabled');
      }
      var i = cssLinks.length,
        currentSS;
        while(i--){
          currentSS = $(cssLinks[i]).attr("id");
         // currentSS = currentSS.split("/stylesheets/");

       //   currentSS = currentSS[1].split(".css");
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
    }*/
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