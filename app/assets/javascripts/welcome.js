$(function() {
  var govUkWelcomeCopy = [
    "<div class='welcome-content'>",
    "<h2>Beta</h2><p class='close'><a href='#'>Close</a></p>",
    "<div class='welcome-inner'>",
    "<p>Welcome to GOV.UK, an experimental trial (\u2018beta\u2019) of a home for government information ",
    "and services, and the first steps towards a single government website.</p>",
    "<p><strong>PLEASE BE AWARE \u2013 this is a test website. It may contain ",
    "inaccuracies or be misleading. ",
    "<a href='http://www.direct.gov.uk'>Directgov</a> and <a href='http://businesslink.gov.uk'>Businesslink</a> remain the official ",
    "websites for government information and services.</strong></p>",
    "<p>Your suggestions will help us make this site better, so if ",
    "you have any comments please leave us feedback.</p>",
    "<p class='thanks'><a href='#' class='button thanks-dismiss' title='This will return you to the GOV.UK homepage'>Thanks, I\u2019ve ",
    "read the warning</a></p>",
    "<p><small>N.B. This site uses \u2018cookies\u2019 and Google Analytics. Closing ",
    "this page sets a cookie so you don\u2019t see it again. There\u2019s more information on cookies at ",
    "<a href='http://www.aboutcookies.org/'>AboutCookies.org</a>.</small></p>",
    "</div></div>"
  ].join('');

  var dpWelcomeCopy = [
    "<div class='welcome-content'>",
    "<h2>Alpha</h2><p class='close'><a href='#'>Close</a></p>",
    "<div class='welcome-inner'>",
    "<p>",
    "  Welcome to the first draft of the Design Principles for GOV.UK. This",
    "  is an \u2018alpha\u2019 draft \u2014 there\u2019s lots more work to be done and many more",
    "  resources to be added.",
    "</p>",
    "<p>These principles are intended to be \u2018carrot not stick\u2019. They\u2019re not a ",
    "list of bad things to be avoided, they\u2019re a set of principles to ",
    "inspire you, accompanied by examples which explain things further and ",
    "code and resources which will make the principles easier to follow.</p>",
    "<p>We\u2019d love to know what you think \u2014 will these principles and examples ",
    "be useful for you? Please let us know via <a href='mailto:govuk-feedback@digital.cabinet-office.gov.uk'>govuk-feedback@digital.cabinet-office.gov.uk</a>.</p>",
    "<p class='thanks'><a href='#' class='button thanks-dismiss' title='This will return you to design principles'>Thanks, I\u2019ve ",
    "read the warning</a></p>",
    "<p><small>N.B. This site uses \u2018cookies\u2019 and Google Analytics. Closing ",
    "this page sets a cookie so you don\u2019t see it again. There\u2019s more information on cookies at ",
    "<a href='http://www.aboutcookies.org/'>AboutCookies.org</a>.</small></p>",
    "</div></div>"
  ].join('');

  function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0, len = hashes.length; i < len; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  function getUrlVar(name){
    return getUrlVars()[name];
  }

  function onDesignPrinciples() {
    return !! window.location.pathname.match(/^\/designprinciples/)
  }

  function activeCookieName() {
    if (onDesignPrinciples()){
      return 'dp-tour';
    } else {
      return 'govuk-tour';
    }
  }

  function popupCopy() {
    if (onDesignPrinciples()){
      return dpWelcomeCopy;
    } else {
      return govUkWelcomeCopy;
    }
  }

  function showPopup() {
    if (getUrlVar('nopopup') != "true") {
      if(getCookie(activeCookieName()) != "dismiss"){
        BetaPopup.popup(popupCopy(), "welcome-tour");
      }
    }
  }

  showPopup();



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
    setCookie(activeCookieName(), "dismiss", 7);
    return;
  });

  $(".thanks-dismiss").live("click", function(){
    setCookie(activeCookieName(), "dismiss", 7);
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
