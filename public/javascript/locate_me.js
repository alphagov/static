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
  $.fn.locator = function(ignore_location_known_on_page_load, error_area_selector) {
    var locator_form = this.closest('form'),
        locator_box = this,
        ignore_location_known_on_page_load = ignore_location_known_on_page_load || false,
        error_area_selector = error_area_selector || '#global-app-error',
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
      if (response_data.current_location != undefined) {
        $(error_area_selector).empty().addClass("hidden");
        $(document).trigger('location-changed', response_data);
      }
      else {
        $(error_area_selector).empty().append("<p>Sorry, we couldn't find a match for that postcode. Please check you entered it correctly. If the postcode was correct, try the Automatically Locate Me button.</p>").removeClass('hidden');
        show_ui(ask_ui);
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
        $.post(this.action, locator_form.serialize(), dispatch_location, 'json');
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
      e.preventDefault();
      clear_geo_fields();
      $.post(this.action, locator_form.serialize(), dispatch_location, 'json');
      show_ui(locating_ui);
    });
  }
})(jQuery);

$(function() {
  $('#large-locator-form').locator();
});
