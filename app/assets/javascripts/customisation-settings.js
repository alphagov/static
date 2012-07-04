$(document).ready(function() {
  var $cust = $(".customisation-settings");

  setStyleSheet(getCookie("govuk-accessibility"));
  $cust.attr("title", "The settings link will open an overlay panel when clicked");
  
  // Event handlers
  $cust.click(function(e) {
    if ($("#mask").length > 0) {
      e.preventDefault();
      return false;
    }

    $.get('/settings.raw', function(data){
      var html = $(data);
      html.eq(0).prepend("<p class='close'><a href='#' title='Click or press escape to close the settings panel'>Close</a></p>");
      BetaPopup.popup(html, "customisation-tools");

      if(getCookie("govuk-accessibility") == "wordsdifficult"){
        $('input[name=acc-options]:eq(1)').attr('checked', 'checked');
      } else{
        $('input[name=acc-options]:eq(0)').attr('checked', 'checked');
      }
    });

    $('.personalise-options').on("submit", function(){
      var id = $('input[name=acc-options]:checked').attr("id");
      _gaq.push(['_trackEvent', 'Citizen-Accessibility', id]);
      if(getCookie("govuk-accessibility")){
        deleteCookie("govuk-accessibility");
      }
      setCookie("govuk-accessibility", id, 4 * 30);
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
      $('input[name=acc-options]:eq(0)').attr('checked', 'checked');
    } else if(match == "wordsdifficult"){
      $(".wordsdifficult").attr("rel", "stylesheet");
      $(".wordsdifficult").removeAttr('disabled');
      $('input[name=acc-options]:eq(1)').attr('checked', 'checked');
    }

    $cust.find('.close').click();
  }

  function setCookie(name,value,days) {
    var expires;
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = "; expires="+date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  function deleteCookie(name) {
    setCookie(name,"",-1);
  }
});
