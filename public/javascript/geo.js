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

$(document).ready(function() {
  var set_location_known = function(current_location, highlight_func) {
    highlight_func();
    //show correct message
    $('#location-set-message').show();
    $('#location-unset-message').hide();
    //set the name of the place
    $("#location-name").html(current_location.locality);
  };
  var setup_location_change_highlight = function() {
    if ($("#global-user-location .highlight-change-icon").length == 0) {
      $('<div class="highlight-change-icon"></div>').appendTo("#global-user-location").hide();
      $('<span class="text-highlight"></span>').prependTo("#global-user-location p").hide();
    }
  }
  var flash_location_change_state = function(class_to_flash) {
    $("#global-user-location .highlight-change-icon").fadeIn(750).fadeOut(750, function() { $("#global-user-location").removeClass(class_to_flash); });
    $('#global-user-location p span.text-highlight').fadeIn(750).fadeOut(750);
  }
  var set_location_unknown = function(highlight_func) {
    if (highlight_func != undefined) {
      highlight_func();
    }
    //set class on the geo elements
    $("#global-user-location").addClass('removing');
    setup_location_change_highlight();
    $("#global-user-location").removeClass('set');
    flash_location_change_state('removing');

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
      flash_location_change_state('setting');
    });
  });
  $(document).bind('location-removed', function(e, message) {
    set_location_unknown();
  });
  // setup extra HTML
  var located = AlphaGeo.locationName();
  if (located) $(document).trigger('location-known', {current_location: {locality: located}});
  $('#global-locator .close').click(function() {
    $('#global-locator').hide();
    return false;
  });

  // Event handlers
  $('#global-locator h2').click(function() {
    $('#global-set-location, #global-explain-location').removeClass('selected');
    $(this).closest('div').addClass('selected');
  });
  $('#global-user-location .change-location').click(function() {
    $('#global-locator').show();
    $('#global-locator-form').trigger('reset-locator-form');
    return false;
  });
  $('#global-user-location .explain-location').click(function() {
    $('#global-locator').show();
    $('#global-locator-form').trigger('reset-locator-form');
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
