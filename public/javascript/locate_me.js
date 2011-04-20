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
  $.fn.locator = function(settings) {
    var locator_form = this,
        ask_ui = locator_form.find('.ask_location'),
        locating_ui = locator_form.find('.finding_location'),
        found_ui = locator_form.find('.found_location'),
        all_ui = ask_ui.add(locating_ui).add(found_ui),
        geolocate_ui;
        
    /* Helper functions */
    var setup_geolocation_api_ui = function() {
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
      if (response_data.current_location.lat != '0.0') {
        update_geo_labels(response_data.current_location);
        show_ui(found_ui);
        $(document).trigger('location-changed', response_data);
      } else {
        if (ask_ui.find('.error-response').length == 0) {
          ask_ui.prepend('<p class="error-response"></p>');
        }
        ask_ui.find('.error-response').text("Sorry, we couldn't find a match for that postcode. Please check you entered it correctly.  If the postcode was correct, try the Automatically Locate Me button.");
        show_ui(ask_ui);
      }
    }

    /* Locator setup */
    found_ui.find('a').click(function (e) {
      locator_form.find('input[name=lat]').val('');
      locator_form.find('input[name=lon]').val('');
      found_ui.find('h3').text('');
      show_ui(ask_ui);
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
        locator_form.find('input[name=lat]').val(details.lat);
        locator_form.find('input[name=lon]').val(details.lon);
        locator_form.trigger('submit');
      });
      geolocate_ui.find('a').click(function (e) {
        var parent_element = $(this).closest('.locate-me');

        geolocate_ui.trigger('location-started');
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(
          function(position) {
            var new_location = {lat: position.coords.latitude, lon: position.coords.longitude};
            geolocate_ui.trigger('location-completed', new_location)
          },
          function() {
            geolocate_ui.trigger('location-failed')
          }
        );
        
        e.preventDefault();
        // return false;
      });
    }
    locator_form.submit(function(e) {
      $.getJSON(this.action, $(this).serialize(), dispatch_location);  
      show_ui(locating_ui);
      e.preventDefault();
    });
  }
})(jQuery);

$(function() {
  $('#large-locator-form').locator();
});
