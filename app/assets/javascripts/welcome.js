$(function() {
  var welcomeCopy = [
    "<div class='welcome-content'>",
    "<h2>Beta</h2><p class='close'><a href='#'>Close</a></p>",
    "<div class='welcome-inner'>",
    "<p>Welcome to GOV.UK, an experimental trial (\u2018beta\u2019) replacement for ",
    "<a href='http://www.direct.gov.uk'>Directgov</a> and the first step ",
    "towards a single government website.</p>",
    "<p><strong>PLEASE BE AWARE \u2013 this is a test website. It may contain ",
    "inaccuracies or be misleading. ",
    "<a href='http://www.direct.gov.uk'>Directgov</a> remains the official ",
    "website for government information and services.</strong></p>",
    "<p>Your suggestions will help us make this site better, so if ",
    "you have any comments please leave us feedback.</p>",
    "<p class='thanks'><a href='#' class='button thanks-dismiss' title='This will return you to the GOV.UK homepage'>Thanks, I\u2019ve ",
    "read the warning</a></p>",
    "<p><small>N.B. This site uses \u2018cookies\u2019 and Google Analytics. Closing ",
    "this page sets a cookie so you don\u2019t see it again. There\u2019s more information on cookies at ",
    "<a href='http://www.aboutcookies.org/'>AboutCookies.org</a>.</small></p>",
    "</div></div>"
  ].join('');

  $.extend({
    getUrlVars: function(){
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0, len = hashes.length; i < len; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },
    getUrlVar: function(name){
      return $.getUrlVars()[name];
    }
  });

  if($.getUrlVar('nopopup') != "true"){
    if(getCookie("govuktour") != "dismiss"){
      BetaPopup.popup(welcomeCopy, "welcome-tour"); 
      
    }
  }

  function setCookie(name, value, days){
    var expires;
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function getCookie(name){
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0, len = ca.length; i < len; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }
  
  $(".welcome-tour .close").live("click", function(){
    setCookie("govuktour", "dismiss", 4 * 30);
    return;
  });
  
  $(".thanks-dismiss").live("click", function(){
    setCookie("govuktour", "dismiss", 4 * 30);
    closePopup();
    return false;
  });

  closePopup = function(){
    $("#popup").fadeOut(400, function(){
      $("#mask").slideUp('fast');
      $("#mask").remove();
      $("#popup").remove();
    });

    $(".header-global h1 a").focus();
  };
  
 
});
