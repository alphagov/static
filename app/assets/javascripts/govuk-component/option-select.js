(function ($) {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  function OptionSelect(options){
    /* This JavaScript provides two functional enhancements to option-select components:
      1) A link that clears all of the checkboxes (referred to here as the "clearing link")
      2) Open/closing of the list of checkboxes - this is not provided for ie6 and 7 as the performance is too janky.
    */

    this.$optionSelect = options.$el;
    this.$options = this.$optionSelect.find("input[type='checkbox']");

    // Build clearing link
    this.$clearingLink = this.attachClearingLink();
    this.updateClearingLink();
    // Attach event listeners for clearing
    this.$clearingLink.on('click', this.resetOptions.bind(this));
    this.$options.on('click', this.updateClearingLink.bind(this));

  }

  OptionSelect.prototype.attachClearingLink = function attachClearingLink(){
    this.$optionSelect.find('.js-container-head').append('<a class="js-clear-selected">clear</a>');
    return this.$optionSelect.find('.js-clear-selected');
  };

  OptionSelect.prototype.resetOptions = function resetOptions(){
    this.$options.prop({
      indeterminate: false,
      checked: false
    }).trigger("change");
    this.$clearingLink.addClass('js-hidden');

    // Prevent the event from bubbling as there is a click handler on the parent
    // to open/close the option-select.
    return false;
  };

  OptionSelect.prototype.updateClearingLink = function updateClearingLink(){
    var anyOptions = this.$options.is(":checked"),
        clearingLinkHidden = this.$clearingLink.hasClass('js-hidden');

    if (anyOptions && clearingLinkHidden) {
      this.$clearingLink.removeClass('js-hidden');
    } else if (!anyOptions && !clearingLinkHidden) {
      this.$clearingLink.addClass('js-hidden');
    }
  };

  GOVUK.OptionSelect = OptionSelect;

  // Instantiate an option select for each one found on the page
  var filters = $('.govuk-option-select').map(function(){
    return new GOVUK.OptionSelect({$el:$(this)});
  });
})(jQuery);
