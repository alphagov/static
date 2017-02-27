$(document).ready(function() {
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

  if (window.GOVUK) {
    if (GOVUK.userSurveys){
      GOVUK.userSurveys.init();
    }

    // for radio buttons and checkboxes
    var buttonsSelector = "label.selectable input[type='radio'], label.selectable input[type='checkbox']";
    new GOVUK.SelectionButtons(buttonsSelector);

    if (GOVUK.shimLinksWithButtonRole) {
      GOVUK.shimLinksWithButtonRole.init();
    }

    // HMRC webchat
    if (GOVUK.webchat) {
      GOVUK.webchat.init();
    }
  }
});
