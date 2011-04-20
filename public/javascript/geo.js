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

     //set class on geo element 
     $("#global-user-location").addClass('set-intro');
     setTimeout(
         function(){
             $("#global-user-location").removeClass('set-intro');
             $("#global-user-location").addClass('set');
         },
         1000
    );
    
    //show correct message
    $('#location-set-message').show();
    $('#location-unset-message').hide();
    
    //set the name of the place
    $("#location-name").html(data.current_location.locality);
  });
  $(document).bind('location-removed', function(e, message) {
    //set class on the geo elements
    $("#global-user-location").removeClass('set');    
    
    //show correct message
    $('#location-set-message').show();
    $('#location-unset-message').hide();
    
    //delete cookie
    AlphaGeo.deleteGeoCookie();
  });
  var located = AlphaGeo.locationName();
  if (located) $(document).trigger('location-changed', {current_location: {locality: located}});
});
