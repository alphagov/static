describe('GOVUK.OptionSelect', function() {

  var optionSelectHTML, optionSelect;

  beforeEach(function(){

    filter = '<div class="govuk-option-select" tabindex="0">'+
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

    filterHTML = $(filter);
    $('body').append(filterHTML);
    filter = new GOVUK.CheckboxFilter({$el:filterHTML});

  });

  afterEach(function(){
    filterHTML.remove();
  });

});
