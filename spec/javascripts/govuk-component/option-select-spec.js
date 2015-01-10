describe('GOVUK.OptionSelect', function() {

  var $optionSelectHTML, optionSelect;

  beforeEach(function(){

    optionSelectFixture = '<div class="govuk-option-select" tabindex="0">'+
      '<div class="container-head js-container-head">'+
        '<div class="option-select-label">Market sector</div>'+
      '</div>'+
      '<div class="options-container">'+
        '<div class="js-auto-height-inner">'+
          '<label for="aerospace">'+
            '<input name="market_sector[]" value="aerospace" id="aerospace" type="checkbox">'+
            'Aerospace'+
            '</label>'+
          '<label for="agriculture-environment-and-natural-resources">'+
            '<input name="market_sector[]" value="agriculture-environment-and-natural-resources" id="agriculture-environment-and-natural-resources" type="checkbox">'+
            'Agriculture, environment and natural resources'+
            '</label>'+
          '<label for="building-and-construction">'+
            '<input name="market_sector[]" value="building-and-construction" id="building-and-construction" type="checkbox">'+
            'Building and construction'+
            '</label>'+
          '<label for="chemicals">'+
            '<input name="market_sector[]" value="chemicals" id="chemicals" type="checkbox">'+
            'Chemicals'+
            '</label>'+
          '<label for="clothing-footwear-and-fashion">'+
            '<input name="market_sector[]" value="clothing-footwear-and-fashion" id="clothing-footwear-and-fashion" type="checkbox">'+
            'Clothing, footwear and fashion'+
            '</label>'+
          '<label for="defence">'+
            '<input name="market_sector[]" value="defence" id="defence" type="checkbox">'+
            'Defence'+
            '</label>'+
          '<label for="distribution-and-service-industries">'+
            '<input name="market_sector[]" value="distribution-and-service-industries" id="distribution-and-service-industries" type="checkbox">'+
            'Distribution and Service Industries'+
            '</label>'+
          '<label for="electronics-industry">'+
            '<input name="market_sector[]" value="electronics-industry" id="electronics-industry" type="checkbox">'+
            'Electronics Industry'+
            '</label>'+
          '<label for="energy">'+
            '<input name="market_sector[]" value="energy" id="energy" type="checkbox">'+
            'Energy'+
            '</label>'+
          '<label for="engineering">'+
            '<input name="market_sector[]" value="engineering" id="engineering" type="checkbox">'+
            'Engineering'+
            '</label>'+
          '</div>'+
        '</div>'+
      '</div>'

    $optionSelectHTML = $(optionSelectFixture);
    $('body').append($optionSelectHTML);
    optionSelect = new GOVUK.OptionSelect({$el:$optionSelectHTML});

  });

  afterEach(function(){
    $optionSelectHTML.remove();
  });

  describe('resetOptions', function(){

    it("unchecks any checked checkboxes", function(){

      // Check all checkboxes on this option select
      $optionSelectHTML.find('.checkbox-container input').prop("checked", true);
      expect($optionSelectHTML.find(':checked').length).toBe($('.checkbox-container input').length);

      // Reset them
      optionSelect.resetOptions();

      // They should not be checked
      expect($optionSelectHTML.find(':checked').length).toBe(0);
    });

    it("adds the class js-hidden to the clearing link", function(){
      // Ensure the clearing link isn't hidden
      optionSelect.$clearingLink.removeClass('js-hidden');

      // This should hide it
      optionSelect.resetOptions();

      // Check it's hidden
      expect(optionSelect.$clearingLink.hasClass('js-hidden')).toBe(true);
    });
  });

  describe("updateClearingLink", function(){

    it("doesn't add js-hidden unless a checkbox is checked",function(){

      // Ensure all checkboxes are unchecked
      $('input[type=checkbox]').prop("checked", false);

      // Ensure the clearing link is hidden
      optionSelect.$clearingLink.addClass('js-hidden');

      optionSelect.updateClearingLink();

      // clearing link should still be hidden if updateClearingLink is called but no checkboxes are checked
      expect(optionSelect.$clearingLink.hasClass('js-hidden')).toBe(true);

      // Check a checkbox
      $('input[type=checkbox]').first().prop("checked", true);

      optionSelect.updateClearingLink();

      // Clearing link should now be visible because one of the boxes is checked
      expect(optionSelect.$clearingLink.hasClass('js-hidden')).toBe(false);
    });

    it("removes the js-hidden class if any checkboxes are checked",function(){
      // Remove js-hidden
      optionSelect.$clearingLink.removeClass('js-hidden');

      // Uncheck all checkboxes
      $('input[type=checkbox]').prop("checked", false);

      optionSelect.updateClearingLink();

      // Clearing link should be hidden
      expect(optionSelect.$clearingLink.hasClass('js-hidden')).toBe(true);
    });

  });
});
