//Reusable functions
var Alphagov = {
  cookie_domain: function() {
    var host_parts = document.location.host.split(':')[0].split('.').slice(-3);
    return '.' + host_parts.join('.');
  },
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
  delete_cookie: function(name) {
    if (document.cookie && document.cookie != '') {
      var date = new Date();
      date.setTime(date.getTime()-(24*60*60*1000)); // 1 day ago
      document.cookie = name + "=; expires=" + date.toGMTString() + "; domain=" + Alphagov.cookie_domain() + "; path=/";
    }
  },
  write_permanent_cookie: function(name, value) {
    var date = new Date(2021, 12, 31);
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + date.toGMTString() + "; domain=" +  Alphagov.cookie_domain() + "; path=/";
  }
}

//General page setup
jQuery(document).ready(function() {

    
  //Setup annotator links 
  $('a.annotation').each(function(index) {
    $(this).linkAnnotator();
  });

  //feedback
  $('#send_feedback').click(
    function(){
      feedback_widget.show();
      return false;
    }
  );

  //tour

  var has_no_tour_cookie = function() {
    return Alphagov.read_cookie('been_on_tour') == null;
  }
  var write_tour_coookie = function() {
    Alphagov.write_permanent_cookie('been_on_tour', 'true');
  }

  var launch_tour = function() {
    $('<div id="splash-back" class="popover-mask"></div>').appendTo($('body'));
    $('#splash-back').hide();
    $('#splash-back').load('/tour.html #splash', function() {
      $(document).trigger('tour-ready');
      $('#tour-close').click(close_tour);
      $('#splash-back').fadeIn();
    });
    return false;
  }

  var close_tour = function() {
    $('#splash-back').fadeOut().remove();
    return false;
  }

  //setup tour click event
  // $('#tour-launcher').click(launch_tour);

  //set initial cookie ?
  if (has_no_tour_cookie()) {
    write_tour_coookie();

    launch_tour();
  }
});

