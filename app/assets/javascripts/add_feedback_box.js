/*
 * jQuery plugin to add a feedback box to an alphagov page
 *
 * To use this plugin you will need to include this file in the page
 * and then call:
 *
 *   $(selector).addFeedbackBox();
 *
 * This will append the relevant HTML to the element specified by
 * selector, and also assign the relevant delays, click behaviours
 * etc.
 *
 * Optionally you can provide an options object. The options are:
 *
 *    feedback_url = the URL to send the feedback message to
 *    delay_before_showing = the time in milliseconds to wait before showing the box
 *    time_for_animation = the duration of the "slide in" animation
 *
 */
(function($) {
  $.fn.addFeedbackBox = function(options) {
    var cookie = new GOVUK.Cookie();

    if(cookie.read('feedback_shown') != null){
      return false;
    }

    // Value lasts for 2 years.
    cookie.write('feedback_shown', 'true', 730);

    var settings = {
      // feedback_url: "http://stats.alpha.gov.uk/pepper/tonytrupp/behavior/api.php",
      delay_before_showing: 1800,
      time_for_animation: 900
    }
    
    $.extend(settings, options);

    var feedback_box_html = '<div class="alpha-feedback"> <a href="#close" class="close">x</a><h3>Did you find what you were looking for?</h3><p id="feedback-options"><a href="#yes" title="yes" class="yes">Yes</a> <a href="#no" title="no" class="no">No</a></p><h4 class="hidden">Thanks!</h4></div>';

    $(this).append(feedback_box_html);
    var feedback_box = $('.alpha-feedback');
    feedback_box.find('.close').click(function () { feedback_box.remove(); return false; });
    $('#feedback-options a').click(function () {
      // var url = settings.feedback_url + "?jsoncallback=?";
      // params = {
      //   eventName: $(this).attr('title'),
      //   sourceURL: window.decodeURI(document.URL)
      // };
      // 
      // var _gaq = _gaq || [];
      // _gaq.push( ['_trackEvent', 'Feedback', params.eventName, params.sourceURL]); 

      $('#feedback-options').addClass('hidden');
      feedback_box.find('h4').removeClass('hidden');
      feedback_box.addClass('submitted');
      $('.alpha-feedback').delay(1600).hide('slow');

      // $.getJSON(url, params, function (data) {});

      return false;
    }); 

    var left_point = $(document).width() - feedback_box.outerWidth();

    feedback_box.css({
      left: '2000px',
      right: null
    }).
    delay(settings.delay_before_showing).
    animate({left: left_point + 'px'}, settings.time_for_animation, 'linear', function () {
      feedback_box.css({left: '', right: '0px'});
    });
  }
})(jQuery);
