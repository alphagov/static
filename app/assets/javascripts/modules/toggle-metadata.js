/*
  Toggle the display of metadata lists where there are lots of items
  Assumes items to hide are wrapped in a span of class js-truncatedwrap
  Toggles visibility of said
*/

;(function (Modules) {
  'use strict'

  Modules.ToggleMetadata = function () {
    this.start = function ($el) {
      $('.js-truncated').attr('aria-hidden', 'true')
      $('.js-truncated-toggle').on('click', function (e) {
        e.preventDefault()
        var $parentElement = $(this).closest('.js-truncated-wrap')
        if ($(this).attr('aria-expanded') == 'true') {
          $(this).attr('aria-expanded', 'false')
          $(this).html($(this).attr('data-text'))
          $parentElement.find('.js-truncated').attr('aria-hidden', 'true')
        } else {
          $(this).attr('aria-expanded', 'true')
          $(this).html('- show less')
          $parentElement.find('.js-truncated').attr('aria-hidden', 'false')
        }
      })
    }
  }
})(window.GOVUK.Modules)
