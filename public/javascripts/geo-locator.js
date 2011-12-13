/**
	@name Alphagov
	@namespace
	@description A set of resuable methods for setting, changing and removing cookies 
	@requires core.js
*/
var Alphagov = {
	/**
		@name Alphagov.cookie_domain
		@function
		@description 

		@returns A string with the entire host path

		@example
			Alphagov.cookie_domain()
	*/
  cookie_domain: function() {
    var host_parts = document.location.host.split(':')[0].split('.').slice(-3);
    return '.' + host_parts.join('.');
  },

	/**
		@name Alphagov.read_cookie
		@function
		@description 

		@param String name Name of the cookie

		@returns The value found for the matching cookie

		@example
			Alphagov.read_cookie("qwerty")
	*/
  read_cookie: function(name) {
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

	/**
		@name Alphagov.delete_cookie
		@function
		@description 

		@param String name Name of the cookie

		@returns The value found for the matching cookie

		@example
			Alphagov.delete_cookie("qwerty")
	*/
  delete_cookie: function(name) {
    if (document.cookie && document.cookie != '') {
      var date = new Date();
      date.setTime(date.getTime()-(24*60*60*1000)); // 1 day ago
      document.cookie = name + "=; expires=" + date.toGMTString() + "; domain=" + Alphagov.cookie_domain() + "; path=/";
    }
  },

	/**
		@name Alphagov.write_permanent_cookie
		@function
		@description 

		@param String name Name of the cookie
		@param String value Value of the cookie

		@returns The value found for the matching cookie

		@example
			Alphagov.write_permanent_cookie("foo", "bar")
	*/
  write_permanent_cookie: function(name, value) {
    var date = new Date(2021, 12, 31);
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + date.toGMTString() + "; domain=" +  Alphagov.cookie_domain() + "; path=/";
  },

	/**
		@name Alphagov.get_display_place_name
		@function
		@description 

		@param String locality_name Locality name
		@param String council_name Council name

		@returns Result

		@example
			Alphagov.get_display_place_name("foo", "bar")
	*/
  get_display_place_name: function(locality_name, council_name){
    var result = '';

    //get long/short version of council name
    council_short_name =  council_name.replace(' Borough Council', '').replace(' County Council', '').replace(' District Council', '').replace(' Council', '');

    if(council_short_name != '' && council_short_name != undefined){
      result = locality_name + ', ' + council_short_name;
    }else{
      result = locality_name;
    }
    
    return result;
  } 
}


/**
	@name AlphaGeo
	@namespace
	@description Set of methods for getting geo information
	@requires AlphaGov, core.js
*/
var AlphaGeo = {
	/**
		@name AlphaGeo.locate
		@function
		@description Based on Matt Patterson's original Alphagov Locator jQuery plugin.  
		This has various features for setting up a location widget.
			This feature is expecting to find a container with at least a form element containing within it 

		@param String id Selector ID for the element containing the location feature 
		  widget (Can be the form ID or the container)
		@param {Object} [opts] Options.
			Options
			@param boolean ignoreKnown Set to false if you want to ignore the known value if it has been set, on page load. 
			@param String errorSelector A selector where error messages will be shown. Default will be "#global-app-error"
			@param boolean noJSSubmit Set to false if you would prefer to reload 
			  the page and not use JS to retrieve and set the value when clicking submit

		@returns false

		@example
			AlphaGeo.locate("#global-locator-form", "{ 
				ignoreKnown: false, 
				errorSelector: '#global-locator-error',
				noJSSubmit: false
				}")
	*/
	
	locate: function(id, opts){
		var locator_form = $(id).closest('form'),
			locator_box = $(id),
			opts = opts || {},
			ignoreKnown = opts.ignoreKnown || false,
			errorSelector = opts.errorSelector || '#global-app-error',
			noJSSUbmit = opts.noJSSUbmit || false,
			ask_ui = locator_box.find('.ask_location'),
			locating_ui = locator_box.find('.finding_location'),
			found_ui = locator_box.find('.found_location'),	
			all_ui = ask_ui.add(locating_ui).add(found_ui),
			geolocate_ui;
			
			
			/* offer the auto locate if the geo api in browser was found */
	    var setup_geolocation_api_ui = function() {
	      var geolocation_ui_node = ask_ui.find('.locate-me');
	      if (geolocation_ui_node.length > 0) return geolocation_ui_node;
	      return $('<p class="locate-me">or <a href="#">locate me automatically</a></p>').appendTo(ask_ui);
	    };
	
			/* display results */ 
	    var show_ui = function(ui_to_show) {
	      all_ui.addClass('hidden');
	      ui_to_show.removeClass('hidden');
	    };
	
			/* set geo labels */
	    var update_geo_labels = function(geo_data) {
	      if (geo_data.councils && geo_data.councils.length > 0) {  
	        display_name = Alphagov.get_display_place_name(geo_data.locality, geo_data.councils[geo_data.councils.length - 1].name);
	      } else {
	        display_name = geo_data.locality;
	      }

	      $('#popup #friendly-location-name').text("We think you're in "+display_name);
	    //  found_ui.find('a').text('Not in ' + geo_data.locality + '?');
	    };
	
			/* set geo lat/long */
	    var update_geo_fields = function(geo_data) {
	      locator_box.find('input[name=lat]').val(geo_data.lat);
	      locator_box.find('input[name=lon]').val(geo_data.lon);
	    };
	
			/* clear any already set geo fields */
	    var clear_geo_fields = function() {
	      locator_box.find('input[name=lat]').val('');
	      locator_box.find('input[name=lon]').val('');
	    };
	
	
			/* this checks the response we're getting back */
	    var dispatch_location = function(response_data) {
	      if (response_data.current_location === undefined || !response_data.current_location) {
	        $(errorSelector).empty().append("<p>Please enter a valid UK postcode.</p>").removeClass('hidden');
	        show_ui(ask_ui);
	      } else if (! response_data.current_location.ward) {
	        $(errorSelector).empty().append("<p>Sorry, that postcode was not recognised.</p>").removeClass('hidden');
	        show_ui(ask_ui);
	      } else {
	        $(errorSelector).empty().addClass("hidden");
	        $(document).trigger('location-changed', response_data);
	      }
	    }
	    var changed_location = function(data) {
	      if (data.current_location != undefined) {
	        update_geo_labels(data.current_location);
	        update_geo_fields(data.current_location);
	        show_ui(found_ui);
	        locator_box.data('located', true);
	      }
	      else {
	        show_ui(ask_ui);
	        locator_box.data('located', false);
	      }
	    }
	    var reset_location = function() {
	      clear_geo_fields();
	      found_ui.find('h3').text('');
	      show_ui(ask_ui);
	      locator_box.data('located', false);
	    }

	    // Check to see if we're starting located
	    locator_box.data('located', !found_ui.hasClass('hidden'))
	  
			
			/* event for clicks on links in .found_location ? (probably forget location link?) */
			found_ui.find('a').click(function (e) {
				$(document).trigger('location-removed');
				e.preventDefault();
			});
	    
			/* use geo location api for auto-detection, if available in the browser */
			if (navigator.geolocation) {
	      var geolocate_ui = setup_geolocation_api_ui();
	
	
	      geolocate_ui.bind('location-started', function () {
					show_ui(locating_ui);
	      });
	      geolocate_ui.bind('location-failed', function () {
	        $(id).text('We were not able to locate you.');
	        show_ui(ask_ui);
	      });
	      geolocate_ui.bind('location-completed', function (event, details) {
	        update_geo_fields(details);
	        if (noJSSUbmit) {
	          locator_form.submit();
	        }
	        else {
	          $.post(locator_form[0].action, locator_form.serialize(), dispatch_location, 'json');
	        }
	      });
	      $(".locate-me a").live("click", function(){
	        geolocate_ui.trigger('location-started');
	        browserSupportFlag = true;
	        navigator.geolocation.getCurrentPosition(
	          function(position) {
	            var new_location = {lat: position.coords.latitude, lon: position.coords.longitude};
	            geolocate_ui.trigger('location-completed', new_location);
	          },
	          function() {
	            geolocate_ui.trigger('location-failed');
	          }
	        );
	      })
	     
	    }
	    if (!ignoreKnown) {
	      $(document).bind('location-known', function(e, data) {
	        changed_location(data);
	      });
	    }
	    $(document).bind('location-changed', function(e, data) {
	      changed_location(data);
	    });
	    $(document).bind('location-removed', function() {
	      reset_location();
	    });
	    locator_box.bind('reset-locator-form', function() {
	      reset_location();
	    });
	    locator_box.bind('check-locator-form-state', function() {
	      show_ui(locator_box.data('located') ? found_ui : ask_ui);
	    });
	
	
			/* if we don't have a geo api in the browser, or the user just wants to submit on 
			the form anyway, we want to submit the form and get back the json that way */
	    $("#global-locator-form").live("submit", function(e) {
	      clear_geo_fields();
	      if (!noJSSUbmit) {
	        e.preventDefault();
	        $.post(this.action, {"postcode": $("#popup #postcode_box").val()}, dispatch_location, 'json');
	      }
	      show_ui(locating_ui);
	      return false;
	    });
	  

	},

	/**
		@name AlphaGeo.readAndParseJSONCookie
		@function
		@description 

		@param String name Name of the cookie

		@returns A JSON object or false if no match found

		@example
			AlphaGeo.readAndParseJSONCookie("qwerty")
	*/
	readAndParseJSONCookie: function(name) {
		var cookie = Alphagov.read_cookie(name);
		if (cookie) {
			var json_cookie = $.base64Decode(cookie);
			var geo_json = jQuery.parseJSON(json_cookie);
      		return geo_json;
    	}
    	return false;
	},
	
	/**
		@name AlphaGeo.locationName
		@function
		@description 

		@returns A string containing the current "friendly name" 
		for the current location, set in the cookie, or false if no cookie found.

		@example
			AlphaGeo.locationName()
	*/
	locationName: function() {
		var geo_json = AlphaGeo.readAndParseJSONCookie('geo');
		if (geo_json && geo_json["friendly_name"]) {
			return geo_json["friendly_name"];
		} else {
			return null;
		}
	},
	
	/**
		@name AlphaGeo.councils
		@function
		@description 

		@returns A string containing the current "friendly name" 
		for the current location, set in the cookie, or false if no cookie found.

		@example
			AlphaGeo.councils()
	*/
	councils: function() {
		var geo_json = AlphaGeo.readAndParseJSONCookie('geo');
		var councils = [];
		if (geo_json && geo_json["ward"]) {
			councils = councils.concat(geo_json["ward"]);
		} 
		if (geo_json && geo_json["council"]) {
			councils = councils.concat(geo_json["council"]);
		} 
		return councils;
	},
	
	/**
		@name AlphaGeo.locationCoords
		@function
		@description 

		@returns A string containing the current "friendly name" for the current location, 
		  set in the cookie, or false if no cookie found.

		@example
			AlphaGeo.locationCoords()
	*/
	locationCoords: function() {
		var geo_json = AlphaGeo.readAndParseJSONCookie('geo');
		if (geo_json && geo_json["fuzzy_point"]) {
			return {lat: geo_json.fuzzy_point.lat, lon: geo_json.fuzzy_point.lon};
		} else {
			return {lat: null, lon: null};
		}
	},
	
	/**
		@name AlphaGeo.locator_object
		@function
		@description 

		@returns A string containing the current "friendly name" for the current location, 
		set in the cookie, or false if no cookie found.

		@example
			AlphaGeo.locator_object()
	*/
	locator_object: function() {
		return {
			locality: AlphaGeo.locationName(),
			lat: AlphaGeo.locationCoords().lat,
			lon: AlphaGeo.locationCoords().lon,
			councils: AlphaGeo.councils()
		}
	},
	
	/**
		@name AlphaGeo.deleteGeoCookie
		@function
		@description Removes any currently set geo cookies

		@returns true

		@example
			AlphaGeo.deleteGeoCookie()
	*/
	deleteGeoCookie: function() {
		Alphagov.delete_cookie('geo');
	}
};


/* global header geo */
$(document).ready(function() {

    AlphaGeo.locate("#global-locator-form", "{ignoreKnown: false, errorSelector: '#global-locator-error', noJSSubmit: false}")
  
    
    var show_known_location = function(current_location) {
     $("#friendly-location-name").text("We think you're in "+current_location);
     $(".ask_location").hide();
    };

    var show_unknown_location = function() {
      $(".found_location").addClass('removing').removeClass('set').hide();
      $(".ask_location").addClass('set').removeClass('removing').show();
      $("#friendly-name-location").text("");
      //show correct message
      $('#location-set-message').hide();
      $('#location-unset-message').show();
    }


    if(AlphaGeo.readAndParseJSONCookie("geo")){
      show_known_location(AlphaGeo.readAndParseJSONCookie("geo").friendly_name)
    }

    $('#forget-location a').live("click", function() {
      $(document).trigger('location-removed');
      return false;
    });

    $(document).bind('location-removed', function(e, message) {
      show_unknown_location();
      Alphagov.delete_cookie("geo");
    });
    
    $(document).bind('location-changed', function(e, data) {
      $('#global-locator').hide();
      $("#global-user-location").addClass('set');
      show_known_location(data.current_location);
    });
		
    $("#global-locator-form").attr('action', '/locator.json');
  });
