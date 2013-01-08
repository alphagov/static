var GOVUK = GOVUK || {};
GOVUK.Cookie = GOVUK.Cookie || function () {};
GOVUK.Cookie.prototype = (function() {
  var cookieDomain = function () {
    var hostParts = document.location.host.split(':')[0].split('.').slice(-3);
    return '.' + hostParts.join('.');
  };

  var daysInMilliseconds = function (days) {
    return days * 24 * 60 * 60 * 1000;
  };

  return {
    delete: function (key) {
      if (document.cookie && document.cookie !== '') {
        document.cookie = key + "=; expires=" + new Date(0).toGMTString() +
          "; domain=" + cookieDomain() + "; path=/";
      }
    },
    read: function (key) {
      var keyEQ = key + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(keyEQ) == 0) return c.substring(keyEQ.length, c.length);
      }

      return null;
    },
    write: function (key, value, days) {
      var duration;

      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + daysInMilliseconds(days));
        duration = date.toGMTString();
      } else {
        // 4 nominal 30-day months in the future.
        duration = daysInMilliseconds(4 * 30);
      }

      document.cookie = key + "=" + value + "; expires=" + duration +
        "; domain=" + cookieDomain() + "; path=/";
    }
  };
})();
