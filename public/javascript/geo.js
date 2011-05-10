/**
 * Alphagov Locator jQuery plugin
 * @name locator-0.4.js
 * @author Matt Patterson
 * @version 0.4
 * @date April 29, 2011
 * @category jQuery plugin
 */
(function($) {
  /**
   * $ is an alias to jQuery object
   */
  $.fn.locator = function(settings) {
    var locator_form = this.closest('form'),
        locator_box = this,
        settings = settings || {},
        ignore_location_known_on_page_load = settings.ignore_location_known_on_page_load || false,
        error_area_selector = settings.error_area_selector || '#global-app-error',
        submit_form_without_ajax = settings.submit_form_without_ajax || false,
        ask_ui = locator_box.find('.ask_location'),
        locating_ui = locator_box.find('.finding_location'),
        found_ui = locator_box.find('.found_location'),
        all_ui = ask_ui.add(locating_ui).add(found_ui),
        geolocate_ui;

    /* Helper functions */
    var setup_geolocation_api_ui = function() {
      var geolocation_ui_node = ask_ui.find('.locate-me');
      if (geolocation_ui_node.length > 0) return geolocation_ui_node;
      return $('<p class="locate-me">or <a href="#">locate me automatically</a></p>').appendTo(ask_ui);
    };
    var show_ui = function(ui_to_show) {
      all_ui.addClass('hidden');
      ui_to_show.removeClass('hidden');
    };
    var update_geo_labels = function(geo_data) {
      found_ui.find('h3').text(geo_data.locality);
      found_ui.find('a').text('Not in ' + geo_data.locality + '?');
    };
    var update_geo_fields = function(geo_data) {
      locator_box.find('input[name=lat]').val(geo_data.lat);
      locator_box.find('input[name=lon]').val(geo_data.lon);
    };
    var clear_geo_fields = function() {
      locator_box.find('input[name=lat]').val('');
      locator_box.find('input[name=lon]').val('');
    };
    var dispatch_location = function(response_data) {
      if (response_data.current_location === undefined) {
        $(error_area_selector).empty().append("<p>Please enter a valid UK postcode.</p>").removeClass('hidden');
        show_ui(ask_ui);
      } else if (! response_data.current_location.locality) {
        $(error_area_selector).empty().append("<p>Sorry, that postcode was not recognised.</p>").removeClass('hidden');
        show_ui(ask_ui);
      } else {
        $(error_area_selector).empty().addClass("hidden");
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
    // Locator setup
    found_ui.find('a').click(function (e) {
      $(document).trigger('location-removed');
      e.preventDefault();
    });
    if (navigator.geolocation) {
      var geolocate_ui = setup_geolocation_api_ui();
      geolocate_ui.bind('location-started', function () {
        show_ui(locating_ui);
      });
      geolocate_ui.bind('location-failed', function () {
        $(this).text('We were not able to locate you.');
        show_ui(ask_ui);
      });
      geolocate_ui.bind('location-completed', function (event, details) {
        update_geo_fields(details);
        if (settings.submit_form_without_ajax) {
          locator_form.submit();
        }
        else {
          $.post(locator_form[0].action, locator_form.serialize(), dispatch_location, 'json');
        }
      });
      geolocate_ui.find('a').click(function (e) {
        var parent_element = $(this).closest('.locate-me');

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

        e.preventDefault();
        // return false;
      });
    }
    if (!ignore_location_known_on_page_load) {
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
    locator_form.submit(function(e) {
      clear_geo_fields();
      if (!settings.submit_form_without_ajax) {
        e.preventDefault();
        $.post(locator_form[0].action, locator_form.serialize(), dispatch_location, 'json');
      }
      show_ui(locating_ui);
    });
  }
})(jQuery);

var no_location_change_animation;
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

  locationCoords: function() {
    var geo_json = AlphaGeo.readAndParseJSONCookie('geo');
    if (geo_json && geo_json["fuzzy_point"]) {
      return {lat: geo_json.fuzzy_point.lat, lon: geo_json.fuzzy_point.lon};
    } else {
      return {lat: null, lon: null};
    }
  },

  locator_object: function() {
    return {
      locality: AlphaGeo.locationName(),
      lat: AlphaGeo.locationCoords().lat,
      lon: AlphaGeo.locationCoords().lon,
      councils: AlphaGeo.councils()
    }
  },

  deleteGeoCookie: function() {
    Alphagov.delete_cookie('geo');
  }
};

$(document).ready(function() {
  $('#large-locator-form').locator();
  $('#global-locator-form').locator({
    ignore_location_known_on_page_load: true, 
    error_area_selector: '#global-locator-error'
  });
  var set_location_known = function(current_location, highlight_func) {
    highlight_func();
    
    //show correct message
    $('#location-set-message').show();
    $('#location-unset-message').hide();
    
    //set the name of the place
    $("#location-name").html(current_location.locality);
    
    //set local info
    $('#location-notifications').click(
      function(){
        $('#local-info').show();
        $('#local-info-box .close').click(
          function(){
            $('#local-info').hide();
          }
        );
        return false;        
      }
    );
  };
  var setup_location_change_highlight = function() {
    if ($("#global-user-location span.text-highlight").length == 0) {
      $('<span class="text-highlight"></span>').prependTo("#global-user-location p").hide();
    }
  }
  var flash_location_change_state = function() {
    if (!no_location_change_animation && no_location_change_animation != true) {
      var pins = $("#global-user-location");
      var scale_back = function() { pins.removeClass('changing'); }
      var scale_up = function() { pins.addClass('changing'); }
      window.setTimeout(scale_up, 200);
      window.setTimeout(scale_back, 850);
      $('#global-user-location p span.text-highlight').fadeIn(750).fadeOut(750);
    }
  }
  var set_location_unknown = function(highlight_func) {
    if (highlight_func != undefined) {
      highlight_func();
    }
    //set class on the geo elements
    $("#global-user-location").addClass('removing');
    setup_location_change_highlight();
    $("#global-user-location").removeClass('set');
    flash_location_change_state();

    //show correct message
    $('#location-set-message').hide();
    $('#location-unset-message').show();

    //delete cookie
    AlphaGeo.deleteGeoCookie();
  }
  $(document).bind('location-known', function(e, data) {
    set_location_known(data.current_location, function() {
      $("#global-user-location").addClass('set');
    })
  });
  $(document).bind('location-changed', function(e, data) {
    set_location_known(data.current_location, function() {
      $("#global-user-location").addClass('setting');
      setup_location_change_highlight();
      $("#global-user-location").addClass('set');
      flash_location_change_state();
    });
  });
  $(document).bind('location-removed', function(e, message) {
    set_location_unknown();
  });
  // setup extra HTML
  var located = AlphaGeo.locationName();
  if (located) $(document).trigger('location-known', {current_location: AlphaGeo.locator_object()});
  $('#global-locator .close').click(function() {
    $('#global-locator').hide();
    return false;
  });

  var open_location_dialog = function() {
    $('#global-locator').show();
    $('#global-locator-form').trigger('reset-locator-form');
  };
  // Event handlers
  $(document).bind('request-location', open_location_dialog);
  $('#global-user-location .change-location').click(function() {
    $(document).trigger('request-location');
    return false;
  });
  $('#global-user-location .explain-location').click(function() {
    $(document).trigger('request-location');
    return false;
  });
  $('#forget-location').click(function() {
    $(document).trigger('location-removed');
    $('#global-locator').hide();
    return false;
  });
  $(document).bind('location-changed', function() {
    $('#global-locator').hide();
  });
});
