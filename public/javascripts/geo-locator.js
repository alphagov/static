/**
	@name Alphageo V2
	@description Methods to handle geolocation across gov.uk
	@requires core.js
*/
var AlphaGeo = {
	
	location: false,
	full_location: false,

	initialize: function() {
		// look for cookie

		if (AlphaGeo.location) {
			
			// get full location
			if (AlphaGeo.full_location) {
				AlphaGeo.trigger('location-completed', AlphaGeo.full_location);
			} else {
				AlphaGeo.lookup_full_location( function() {
					AlphaGeo.trigger('location-completed', AlphaGeo.full_location);	
				});	
			}

		}
	},

	lookup_full_location: function(callback) {
		$.getJSON('/locator.json', AlphaGeo.location, function(data){
			AlphaGeo.full_location = data;	
			callback();
		});	
	},

	geolocate: function() {
		alert("Here!")
		if (navigator.geolocation) {
			$(AlphaGeo).trigger('geolocation-started');
			var browser_location = AlphaGeo.browser_geolocate();
			if (browser_location == false) {
				AlphaGeo.trigger('geolocation-failed');
			} else {
				AlphaGeo.trigger('geolocation-completed');
				AlphaGeo.location = browser_location;
				AlphaGeo.lookup_full_location( function() {
					AlphaGeo.trigger('location-completed', AlphaGeo.full_location);
				}); 
			}
		} else {
			AlphaGeo.trigger('geolocation-failed');
		}
	},

	browser_geolocate: function() {
		var coordinates = false;
		navigator.geolocation.getCurrentPosition(
      function(position) {
        coordinates = {lat: position.coords.latitude, lon: position.coords.longitude};
      },
      function() {
      	coordinates = false;
      }
    );				
    return coordinates;
	}

}

AlphaGeo.initialize();

/** Logging **/
$(AlphaGeo).bind("geolocation-started", function() {
	window.console.log("Geolocation started");	
});