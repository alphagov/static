var AlphaGeo = {
  readAndParseJSONCookie: function(name) {
    var cookie = Alphagov.read_cookie(name);
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

  deleteGeoCookie: function() {
    Alphagov.delete_cookie('geo');
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
