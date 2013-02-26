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
      $relatedColumn = $('#wrapper .related-positioning'),
      hasCookieMessage = ($message.length && getCookie('seen_cookie_message') === null),
      release = ($('.beta-notice').length) ? 'beta' : 'live';
      addRelatedClass;

  function addRelatedClass() {
    var relatedClass = 'related-' + release;

    if (hasCookieMessage) {
      // correct the related module top position to consider the cookie bar
      relatedClass = relatedClass + '-with-cookie';
    } else if (release === 'live') {
      return;
    }

    if ($relatedColumn.length) {
      $relatedColumn.addClass(relatedClass);
    }
  };

  if (hasCookieMessage) {
    if ($relatedColumn.length) {
      // related content box needs to know the top position of the footer
      // this changes when content is split into tabs
      if (typeof GOVUK.stopScrollingAtFooter !== 'undefined') {
        GOVUK.stopScrollingAtFooter.updateFooterTop();
      }
    }
    $message.show();
    setCookie('seen_cookie_message', 'yes', 28);
  }

  addRelatedClass();
});
