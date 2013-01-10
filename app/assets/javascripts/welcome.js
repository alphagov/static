$(function() {
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
    var pathName = window.location.pathname,
        isDP = !! pathName.match(/^\/designprinciples/),
        isPF;
    
    if (isDP) {
      // performance framework is in beta so return false to force that popup
      isPF = !! pathName.match(/^\/designprinciples\/performanceframework/);
      if (isPF) {
        return false;
      }
      
      return true;
    }
    
    return false;
  }

  function activeCookieName() {
    if (onDesignPrinciples()){
      return 'dp-tour';
    } else {
      return 'govuk-tour';
    }
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

function setCookie(name, value, days){
  var cookieString = name + "=" + value + "; path=/";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    cookieString = cookieString + "; expires=" + date.toGMTString();
  }
  if (document.location.protocol == 'https:'){
    cookieString = cookieString + "; Secure";
  }
  document.cookie = cookieString;
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

$(function() {
  var addStyle,
      $message = $('#global-cookie-message'),
      $relatedColumn = $('#wrapper .related-positioning');

  if ($message.length && getCookie('seen_cookie_message') === null) {
    if ($relatedColumn.length) {
      // correct the related module top position to consider the cookie bar
      $relatedColumn.addClass('related-with-cookie');
      // related content box needs to know the top position of the footer
      // this changes when content is split into tabs
      if (typeof GOVUK.stopScrollingAtFooter !== 'undefined') {
              GOVUK.stopScrollingAtFooter.updateFooterTop();
      }
    }
    $message.show();
    setCookie('seen_cookie_message', 'yes', 28);
  }
});
