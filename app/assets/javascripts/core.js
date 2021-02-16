$(document).ready(function () {
  $('.print-link a').attr('target', '_blank')

  var $searchFocus = $('.js-search-focus')
  $searchFocus.each(function (i, el) {
    if ($(el).val() !== '') {
      $(el).addClass('focus')
    }
  })

  $searchFocus.on('focus', function (e) {
    $(e.target).addClass('focus')
  })

  $searchFocus.on('blur', function (e) {
    if ($(e.target).val() === '') {
      $(e.target).removeClass('focus')
    }
  })
})
