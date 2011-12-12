$(document).ready(function() {
  
    setStyleSheet(getCookie("govuk-accessibility"));
    
    
	 // Event handlers
    $('.customisation-settings').click(function() {
      _gaq.push(['_trackEvent', 'Citizen-Accessibility', 'Open']);
      BetaPopup.popup($("#global-locator-box").html(), "customisation-tools");
      $('.personalise-options li a').click(function(){
        _gaq.push(['_trackEvent', 'Citizen-Accessibility', $(this).attr("id")]);
        
        if(getCookie("govuk-accessibility")){
          deleteCookie("govuk-accessibility");
        }
        setCookie("govuk-accessibility",$(this).attr("id"),1);
        setStyleSheet($(this).attr("id"));
        
        
      })
      return false;
    });
    
    
    function setStyleSheet(match){
      if(match == "reset"){
        deleteCookie("govuk-accessibility");
      }
      else{
        var cssLinks = $("link[type='text/css']");

        var i = cssLinks.length,
          currentSS;
          while(i--){
            currentSS = $(cssLinks[i]).attr("href");
            currentSS = currentSS.split("/stylesheets/");
            currentSS = currentSS[1].split(".css");
            if(currentSS[0] == match){
              $(cssLinks[i]).attr("rel", "stylesheet");
              $(cssLinks[i]).removeAttr("disabled")
            }
          }
      }
    }
    // check for cookie
      // if set, get link attrs
      // set type on matching
      
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