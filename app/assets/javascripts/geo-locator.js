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
		var cookie = AlphaGeo.read_and_parse_json_cookie('geo');
		if (cookie.current_location) {
			AlphaGeo.location = { lat: cookie.current_location.lat, lon: cookie.current_location.lon };
			AlphaGeo.full_location = cookie;
		}

		if (AlphaGeo.location) {
			// get full location
			if (AlphaGeo.full_location) {
				$(AlphaGeo).trigger('location-completed', AlphaGeo.full_location);
			} else {
				AlphaGeo.lookup_full_location( function() {
					$(AlphaGeo).trigger('location-completed', AlphaGeo.full_location);	
				});	
			}
		}

		$(AlphaGeo).bind('location-completed', function(e, location){
			AlphaGeo.save_location_to_cookie(location);			
		});
	},

	read_and_parse_json_cookie: function(name) {
		var cookie = Alphagov.read_cookie(name);
		if (cookie) {
			var json_cookie = $.base64Decode(cookie);
			var geo_json = jQuery.parseJSON(json_cookie);
      		return geo_json;
    	}
    	return false;
	},

	lookup_full_location: function(callback) {
		$.getJSON('/locator.json', AlphaGeo.location, function(data){
			if (data.location_error) {
				$(AlphaGeo).trigger('location-failed');
				return false;	
			} else {
				AlphaGeo.full_location = data;	
				callback();
			}
		});	
	},

	locate: function(postcode) {
		AlphaGeo.location = { 'postcode': postcode }
		AlphaGeo.lookup_full_location( function() {
			$(AlphaGeo).trigger('location-completed', AlphaGeo.full_location);
		});
	},

	notify: function() {
		if (AlphaGeo.full_location) {
			$(AlphaGeo).trigger('location-completed', AlphaGeo.full_location);
		}
	},

	geolocate: function() {
		if (navigator.geolocation) {
			$(AlphaGeo).trigger('geolocation-started');
			AlphaGeo.browser_geolocate();
			$(AlphaGeo).bind('geolocation-completed', function(e, position) {
				AlphaGeo.location = position;
				AlphaGeo.lookup_full_location( function() {
					$(AlphaGeo).trigger('location-completed', AlphaGeo.full_location);
				}); 
			});
		} else {
			$(AlphaGeo).trigger('geolocation-failed');	
		}
	},

	browser_geolocate: function() {
		navigator.geolocation.getCurrentPosition(
      function(position) {
      	coordinates = {lat: position.coords.latitude, lon: position.coords.longitude};
        $(AlphaGeo).trigger('geolocation-completed', coordinates);
      },
      function() {
      	$(AlphaGeo).trigger('geolocation-failed');
      }
    );				
	},

	save_location_to_cookie: function() {
		var cookie = $.base64Encode(JSON.stringify(AlphaGeo.full_location));
		Alphagov.write_cookie('geo', cookie);		
	},

	remove: function() {
		Alphagov.delete_cookie('geo');
		AlphaGeo.location = false;
		AlphaGeo.full_location = false;
		
		$(AlphaGeo).trigger('location-removed');	
	}

}

var AlphaGeoForm = function(selector) {
	
	var form 				= $(selector);
	var ask_ui 			= form.find('.ask_location');
	var finding_ui 	= form.find('.finding_location');
	var found_ui 		= form.find('.found_location');
	var all_ui			= [ask_ui, finding_ui, found_ui];

	if (AlphaGeo.full_location) {
		form.find('.location_error').hide().text('');
  	found_ui.find('strong, a span.friendly-name').text(AlphaGeo.full_location.current_location.locality);
  	show_ui(found_ui);	
	} else {
		show_ui(ask_ui);
	}

	function show_ui(selector) {
		$(all_ui).each(function(k, item){
			item.hide().css('visibility','hidden');			
		});
		selector.show().css('visibility','visible');
	}

	if (navigator.geolocation) {
    $('<p class="geolocate-me">or <a href="#">locate me automatically</a></p>').appendTo(ask_ui);
  
	  $(".geolocate-me a").live('click', function(e){
	    e.preventDefault();
	    AlphaGeo.geolocate();
	  });

	  $(AlphaGeo).bind("geolocation-started", function() {
	  	form.find('.location_error').hide().text('');
	  	show_ui(finding_ui);
		});

	  $(AlphaGeo).bind("geolocation-failed", function() {
	  	show_ui(ask_ui);
		});
	}

	$('a.change-location').live('click', function(e){
		e.preventDefault();
		AlphaGeo.remove();
	});

	$(AlphaGeo).bind("location-completed", function(e, location) {
		form.find('.location_error').hide().text('');
  	found_ui.find('strong, a span.friendly-name').text(location.current_location.locality);
  	ask_ui.find('input[type=submit]').removeAttr('disabled');
  	show_ui(found_ui);
	});

	$(AlphaGeo).bind("location-failed", function(e, location) {
		form.find('.location_error').text('Please enter a valid postcode.').show();
		ask_ui.find('input[type=submit]').removeAttr('disabled');
  	show_ui(ask_ui);
	});

	$(AlphaGeo).bind("location-removed", function(e, location) {
  	found_ui.find('strong, a span.friendly-name').text('');
  	ask_ui.find('input.postcode').val('');
  	show_ui(ask_ui);
	});

  form.live('submit', function(e) {
  	e.preventDefault();
  	form.find('input[type=submit]').attr('disabled','disabled');
  	AlphaGeo.locate( form.find('input.postcode').val() );
  });

}

$(document).ready( function() {
	AlphaGeo.initialize();
});