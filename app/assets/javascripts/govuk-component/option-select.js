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
    this.$labels = this.$optionSelect.find("label");
    this.$optionsContainer = this.$optionSelect.find('.options-container');
    this.$optionList = this.$optionsContainer.children('.js-auto-height-inner');

    // Build clearing link
    this.$clearingLink = this.attachClearingLink();
    this.updateClearingLink();

    // Attach event listeners for clearing
    this.$clearingLink.on('click', this.resetOptions.bind(this));
    this.$options.on('click', this.updateClearingLink.bind(this));

    // Performance in ie 6/7 is not good enough to support animating the opening/closing
    // so do not allow option-selects to be collapsible in this case
    var allowCollapsible = (typeof ieVersion == "undefined" || ieVersion > 7) ? true : false;
    if(allowCollapsible){

      // Add js-collapsible class to parent for CSS
      this.$optionSelect.addClass('js-collapsible');

      // Add the little arrow toggle image
      this.attachOpenCloseToggleIndicator();

      // Add open/close listeners
      this.$optionSelect.find('.js-container-head').on('click', this.toggleOptionSelect.bind(this));

      // Add key listeners the option-select is fully usable with a keyboard
      this.$optionSelect.on('focus', this.listenForKeys.bind(this));
      this.$optionSelect.on('blur', this.stopListeningForKeys.bind(this));

      // Add a listener to the checkboxes so if you navigate to them with the keyboard you can definitely see them
      this.$options.on('focus', this.open.bind(this));

      this.close();
    }
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

  OptionSelect.prototype.attachOpenCloseToggleIndicator = function attachOpenCloseToggleIndicator(){
    this.$optionSelect.find('.js-container-head').append('<div class="js-toggle-indicator"></div>');
  };

  OptionSelect.prototype.toggleOptionSelect = function toggleOptionSelect(){
    if (this.isClosed()) {
      this.open();
    } else {
      this.close();
    }
  };

  OptionSelect.prototype.open = function open(){
    if (this.isClosed()) {
      this.$optionSelect.removeClass('js-closed');
      this.setupHeight();
    }
  };

  OptionSelect.prototype.close = function close(){
    this.$optionSelect.addClass('js-closed');
  };

  OptionSelect.prototype.isClosed = function isClosed(){
    return this.$optionSelect.hasClass('js-closed');
  };

  OptionSelect.prototype.setContainerHeight = function setContainerHeight(height){
    this.$optionsContainer.css({
      'max-height': 'none', // Have to clear the 'max-height' set by the CSS in order for 'height' to be applied
      'height': height
    });
  };

  OptionSelect.prototype.isLabelVisible = function isLabelVisible(index, option){
    var $label = $(option);
    var initialOptionContainerHeight = this.$optionsContainer.height();
    var optionListOffsetTop = this.$optionList.offset().top;
    var distanceFromTopOfContainer = $label.offset().top - optionListOffsetTop;
    return distanceFromTopOfContainer < initialOptionContainerHeight;
  };

  OptionSelect.prototype.getVisibleLabels = function getVisibleLabels(){
    return this.$labels.filter(this.isLabelVisible.bind(this));
  };

  OptionSelect.prototype.setupHeight = function setupHeight(){
    var initialOptionContainerHeight = this.$optionsContainer.height();
    var height = this.$optionList.height();
    var lastVisibleLabel;

    if (height < initialOptionContainerHeight + 50) {
      // Resize if the list is only slightly bigger than its container
      this.setContainerHeight(height);
      return;
    }

    // Resize to cut last item cleanly in half
    lastVisibleLabel = this.getVisibleLabels().last();

    this.setContainerHeight(
      lastVisibleLabel.position().top +
      parseInt(lastVisibleLabel.css('border-top-width'), 10) +
      parseInt(lastVisibleLabel.css('padding-top'), 10) +
      (parseInt(
        "normal" == lastVisibleLabel.css('line-height') ?
          lastVisibleLabel.css('font-size') : lastVisibleLabel.css('line-height'),
        10
      ) / 2)
    );

  };

  OptionSelect.prototype.listenForKeys = function listenForKeys(){
    this.$optionSelect.keypress(this.checkForSpecialKeys.bind(this));
  };

  OptionSelect.prototype.checkForSpecialKeys = function checkForSpecialKeys(e){
    if(e.keyCode == 13) {

      // keyCode 13 is the return key.
      this.toggleOptionSelect();
    }
  };

  OptionSelect.prototype.stopListeningForKeys = function stopListeningForKeys(){
    this.$optionSelect.unbind('keypress');
  };

  GOVUK.OptionSelect = OptionSelect;

  // Instantiate an option select for each one found on the page
  var filters = $('.govuk-option-select').map(function(){
    return new GOVUK.OptionSelect({$el:$(this)});
  });
})(jQuery);
