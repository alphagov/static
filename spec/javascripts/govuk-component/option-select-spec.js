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

  describe('toggleOptionSelect', function(){
    it("calls optionSelect.close() if the optionSelect is currently open", function(){
      $optionSelectHTML.removeClass('js-closed');
      spyOn(optionSelect, "close");
      optionSelect.toggleOptionSelect();
      expect(optionSelect.close.calls.count()).toBe(1);
    });

    it("calls optionSelect.open() if the optionSelect is currently closed", function(){
      $optionSelectHTML.addClass('js-closed');
      spyOn(optionSelect, "open");
      optionSelect.toggleOptionSelect();
      expect(optionSelect.open.calls.count()).toBe(1);
    });
  });

  describe('open', function(){

    it ('calls isClosed() and opens if isClosed is true', function(){
      spyOn(optionSelect, "isClosed").and.returnValue(true);
      optionSelect.open();
      expect(optionSelect.isClosed.calls.count()).toBe(1);
      expect($optionSelectHTML.hasClass('js-closed')).toBe(false);
    });

    it('opens the option-select', function(){
      optionSelect.close();
      expect(optionSelect.isClosed()).toBe(true);
      optionSelect.open();
      expect(optionSelect.isClosed()).toBe(false);
    });

    it ('calls setupHeight()', function(){
      $optionSelectHTML.addClass('closed');
      spyOn(optionSelect, "setupHeight");
      optionSelect.open();
      expect(optionSelect.setupHeight.calls.count()).toBe(1);
    });

  });

  describe('close', function(){
    it('closes the option-select', function(){
      optionSelect.open();
      expect(optionSelect.isClosed()).toBe(false);
      optionSelect.close();
      expect(optionSelect.isClosed()).toBe(true);
    });
  });

  describe('isClosed', function(){
    it('returns true if the optionSelect has the class `.js-closed`', function(){
      $optionSelectHTML.addClass('js-closed');
      expect(optionSelect.isClosed()).toBe(true);
    });

    it('returns false if the optionSelect doesnt have the class `.js-closed`', function(){
      $optionSelectHTML.removeClass('js-closed');
      expect(optionSelect.isClosed()).toBe(false);
    });
  });

  describe ('setupHeight', function(){
    var checkboxContainerHeight, stretchMargin;

    beforeEach(function(){

      // Set the height of option-select-container to 200 (this is done in the CSS IRL)
      optionSelectHeight = 200;
      $checkboxList = $optionSelectHTML.find('.options-container');
      $checkboxList.height(optionSelectHeight);

      $checkboxListInner = $checkboxList.find(' > .js-auto-height-inner');
      listItem = "<input type='checkbox' name='ca98'id='ca89'><label for='ca89'>CA89</label>";

    });

    it('expands the checkbox-container to fit checkbox list if the list is < 50px larger than the container', function(){
      $checkboxListInner.height(201);
      optionSelect.setupHeight();

      // Wrapping HTML should adjust to fit inner height
      expect($checkboxList.height()).toBe($checkboxListInner.height());
    });

    it('does nothing if the height of the checkbox list is longer than the height of the container by more than 50px', function(){
      $checkboxListInner.height(251);
      optionSelect.setupHeight();

      // Wrapping HTML should not stretch as 251px is too big.
      expect($checkboxList.height()).toBe(optionSelectHeight);
    });
  });

  describe('listenForKeys', function(){

    it('binds an event handler to the keypress event', function(){
      spyOn(optionSelect, "checkForSpecialKeys");
      optionSelect.listenForKeys();

      // Simulate keypress
      $optionSelectHTML.trigger('keypress');
      expect(optionSelect.checkForSpecialKeys.calls.count()).toBe(1);
    });

  });

  describe('checkForSpecialKeys', function(){

    it ("calls toggleOptionSelect() if the key event passed in is a return character", function(){
      spyOn(optionSelect, "toggleOptionSelect");
      optionSelect.listenForKeys();

      // 13 is the return key
      optionSelect.checkForSpecialKeys({keyCode:13});

      expect(optionSelect.toggleOptionSelect.calls.count()).toBe(1);
    });

    it ('does nothing if the key is not return', function(){
      spyOn(optionSelect, "toggleOptionSelect");
      optionSelect.listenForKeys();

      optionSelect.checkForSpecialKeys({keyCode:11});
      expect(optionSelect.toggleOptionSelect.calls.count()).toBe(0);
    });

  });

  describe('stopListeningForKeys', function(){

    it('removes the event handler for the keypress event', function(){
      spyOn(optionSelect, "checkForSpecialKeys");
      optionSelect.listenForKeys();
      optionSelect.stopListeningForKeys();

      // Simulate keypress
      $optionSelectHTML.trigger("keypress");
      expect(optionSelect.checkForSpecialKeys.calls.count()).toBe(0);
    });

  });

});
