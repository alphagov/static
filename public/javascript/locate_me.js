/**
 * Alphagov Locator jQuery plugin
 * @name locator-0.1.js
 * @author Matt Patterson
 * @version 0.1
 * @date March 23, 2011
 * @category jQuery plugin
 */
(function($) {
  /**
   * $ is an alias to jQuery object
   */
  $.fn.locator = function(ignore_location_known_on_page_load) {
    var locator_form = this.closest('form'),
        locator_box = this,
        ignore_location_known_on_page_load = ignore_location_known_on_page_load || false,
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
    }
    var show_ui = function(ui_to_show) {
      all_ui.addClass('hidden');
      ui_to_show.removeClass('hidden');
    }
    var update_geo_labels = function(geo_data) {
      found_ui.find('h3').text(geo_data.locality);
      found_ui.find('a').text('Not in ' + geo_data.locality + '?');
    }
    var dispatch_location = function(response_data) {
      $(document).trigger('location-changed', response_data);
    }
    var changed_location = function(data) {
      if (data.current_location.lat != '0.0') {
        update_geo_labels(data.current_location);
        show_ui(found_ui);
        locator_box.data('located', true);
      } 
      else {
        if (ask_ui.find('.error-response').length == 0) {
          ask_ui.prepend('<p class="error-response"></p>');
        }
        ask_ui.find('.error-response').text("Sorry, we couldn't find a match for that postcode. Please check you entered it correctly.  If the postcode was correct, try the Automatically Locate Me button.");
        show_ui(ask_ui);
        locator_box.data('located', false);
      }
    }
    var reset_location = function() {
      locator_box.find('input[name=lat]').val('');
      locator_box.find('input[name=lon]').val('');
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
        locator_box.find('input[name=lat]').val(details.lat);
        locator_box.find('input[name=lon]').val(details.lon);
        locator_form.trigger('submit');
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
      $.post(this.action, locator_form.serialize(), dispatch_location, 'json');
      show_ui(locating_ui);
    });
  }
})(jQuery);

$(function() {
  $('#large-locator-form').locator();
});
