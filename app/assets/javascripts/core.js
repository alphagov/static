$(document).ready(function() {
  $('.print-link a').attr('target', '_blank');

  var $searchFocus = $('.js-search-focus');
  $searchFocus.each(function(i, el){
    if($(el).val() !== ''){
      $(el).addClass('focus');
    }
  });
  $searchFocus.on('focus', function(e){
    $(e.target).addClass('focus');
  });
  $searchFocus.on('blur', function(e){
    if($(e.target).val() === ''){
      $(e.target).removeClass('focus');
    }
  });

  $("nav").delegate('a', 'click', function(){
    var hash;
    var href = $(this).attr('href');
    if(href.charAt(0) === '#'){
      hash = href;
    }
    else if(href.indexOf("#") > 0){
      hash = "#" + href.split("#")[1];
    }
    if($(hash).length == 1){
      $("html, body").animate({scrollTop: $(hash).offset().top - $("#global-header").height()},10);
    }
  });

  // hover, active and focus states for buttons in IE<8
  if ($.browser.msie && $.browser.version < 8) {
    $('.button').not('a')
      .on('click focus', function (e) {
        $(this).addClass('button-active');
      })
      .on('blur', function (e) {
        $(this).removeClass('button-active');
      });

    $('.button')
      .on('mouseover', function (e) {
        $(this).addClass('button-hover');
      })
      .on('mouseout', function (e) {
        $(this).removeClass('button-hover');
      });
  }

  if (window.GOVUK) {
    if (GOVUK.userSatisfaction){
      var currentURL = window.location.pathname;

      function stringContains(str, substr) {
        return str.indexOf(substr) > -1;
      }

      // We don't want the satisfaction survey appearing for users who
      // have completed a transaction as they may complete the survey with
      // the department's transaction in mind as opposed to the GOV.UK content.
      if (!stringContains(currentURL, "/done") &&
          !stringContains(currentURL, "/transaction-finished") &&
          !stringContains(currentURL, "/driving-transaction-finished")) {
        GOVUK.userSatisfaction.randomlyShowSurveyBar();
      }
    }
  }
});


