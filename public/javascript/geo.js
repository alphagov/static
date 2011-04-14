var AlphaGeo = {
  readCookie: function(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  },

  readAndParseJSONCookie: function(name) {
    var cookie = AlphaGeo.readCookie(name);
    if (cookie) {
      var json_cookie = $.base64Decode(cookie);
      var geo_json = jQuery.parseJSON(json_cookie);
      return geo_json;
    }
    return false;
  },

  locationName: function() {
    var geo_json = AlphaGeo.readAndParseJSONCookie('geo');
    if (geo_json && geo_json["friendly_name"]) {
      return geo_json["friendly_name"];
    } else {
      return null;
    }
  },

  deleteCookie: function(name) {
    if (document.cookie && document.cookie != '') {
      var date = new Date();
      date.setTime(date.getTime()-(24*60*60*1000)); // 1 day ago
      document.cookie = name + "=; expires=" + date.toGMTString() + "; domain=.alphagov.co.uk; path=/";
    }
  },

  deleteGeoCookie: function() {
    AlphaGeo.deleteCookie('geo');
  }
};

jQuery(document).ready(function() {
  $(document).bind('location-changed', function(e, data) {
    $("#global-user-location").html("<p>I think you're in " +  data.current_location.locality + ".</p>");
  });
  $(document).bind('location-removed', function(e, message) {
    $("#global-user-location").text("");
    AlphaGeo.deleteGeoCookie();
  });
  var located = AlphaGeo.locationName();
  if (located) $(document).trigger('location-changed', {current_location: {locality: located}});
});
