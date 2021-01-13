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

  if (window.GOVUK) {
    // for radio buttons and checkboxes
    var buttonsSelector = "label.selectable input[type='radio'], label.selectable input[type='checkbox']"
    new GOVUK.SelectionButtons(buttonsSelector) // eslint-disable-line no-new

    if (GOVUK.shimLinksWithButtonRole) {
      GOVUK.shimLinksWithButtonRole.init()
    }
  }
})
