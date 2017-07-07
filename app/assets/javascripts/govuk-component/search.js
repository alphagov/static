(function ($) {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  function SearchBox($el){
    var $searchFocus = $el.find('.js-search-input-focus');
    if($searchFocus.val() !== '') {
      $searchFocus.addClass('focus');
    }

    $searchFocus.on('focus', function(e) {
      $(e.target).addClass('focus');
    });

    $searchFocus.on('blur', function(e) {
      if($(e.target).val() === '') {
        $(e.target).removeClass('focus');
      }
    });
  }

  GOVUK.SearchBox = SearchBox;

  $('.govuk-search').each(function(){
    GOVUK.SearchBox($(this));
  });

})(jQuery);
