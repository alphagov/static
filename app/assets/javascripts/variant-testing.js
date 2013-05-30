var variants = {
    "rootnode": ".article-container .inner",
    "variants": [
        {
            'url': "www.gov.uk/driving-transaction-finished-v1",
            'analytics': "variant-1",
            'content': '<div class="summary"><p>Please join the NHS Organ Donor Register.</p></div><p><a rel="external" href="https://www.organdonation.nhs.uk/how_to_become_a_donor/registration/consent.asp?campaign=2244&v=1" title="Register to become an organ donor" class="button">Join</a> or <a rel="external" href="http://www.organdonation.nhs.uk/how_to_become_a_donor/questions/index.asp?campaign=2244&v=1" title="Learn more about organ donation">Find out more</a></p>'
        },
        {
            'url': "www.gov.uk/driving-transaction-finished-v2",
            'analytics': "variant-2",
             'content': '<div class="summary"><p>Please join the NHS Organ Donor Register.</p></div><p>Every day thousands of people who see this page decide to register.</p><p><a rel="external" href="https://www.organdonation.nhs.uk/how_to_become_a_donor/registration/consent.asp?campaign=2244&v=2" title="Register to become an organ donor" class="button">Join</a> or <a rel="external" href="http://www.organdonation.nhs.uk/how_to_become_a_donor/questions/index.asp?campaign=2244&v=2" title="Learn more about organ donation">Find out more</a></p>'
            
        },
        {
            'url': "www.gov.uk/driving-transaction-finished-v3",
            'analytics': "variant-3",
            'content': '<div class="summary"><p>Please join the NHS Organ Donor Register.</p></div><p class="organ-donor-photo">Every day thousands of people who see this page decide to register.</p><p><a rel="external" href="https://www.organdonation.nhs.uk/how_to_become_a_donor/registration/consent.asp?campaign=2244&v=3" title="Register to become an organ donor" class="button">Join</a> or <a rel="external" href="http://www.organdonation.nhs.uk/how_to_become_a_donor/questions/index.asp?campaign=2244&v=3" title="Learn more about organ donation">Find out more</a></p>'
        },
        {
            'url': "www.gov.uk/driving-transaction-finished-v4",
            'analytics': "variant-4",
            'content': '<div class="summary"><p>Please join the NHS Organ Donor Register.</p></div><p class="organ-donor-logo">Every day thousands of people who see this page decide to register.</p><p><a rel="external" href="https://www.organdonation.nhs.uk/how_to_become_a_donor/registration/consent.asp?campaign=2244&v=4" title="Register to become an organ donor" class="button">Join</a> or <a rel="external" href="http://www.organdonation.nhs.uk/how_to_become_a_donor/questions/index.asp?campaign=2244&v=4" title="Learn more about organ donation">Find out more</a></p>'
            
        },
        {
            'url': "www.gov.uk/driving-transaction-finished-v5",
            'analytics': "variant-5",
            'content': '<div class="summary"><p>Please join the NHS Organ Donor Register.</p></div><p>Three people die every day because there are not enough organ donors.</p><p><a rel="external" href="https://www.organdonation.nhs.uk/how_to_become_a_donor/registration/consent.asp?campaign=2244&v=5" title="Register to become an organ donor" class="button">Join</a> or <a rel="external" href="http://www.organdonation.nhs.uk/how_to_become_a_donor/questions/index.asp?campaign=2244&v=5" title="Learn more about organ donation">Find out more</a></p>'
        },
        {
            'url': "www.gov.uk/driving-transaction-finished-v6",
            'analytics': "variant-6",
            'content': '<div class="summary"><p>Please join the NHS Organ Donor Register.</p></div><p>You could save or transform up to 9 lives as an organ donor.</p><p><a rel="external" href="https://www.organdonation.nhs.uk/how_to_become_a_donor/registration/consent.asp?campaign=2244&v=6" title="Register to become an organ donor" class="button">Join</a> or <a rel="external" href="http://www.organdonation.nhs.uk/how_to_become_a_donor/questions/index.asp?campaign=2244&v=6" title="Learn more about organ donation">Find out more</a></p>'
            
        },
        {
            'url': "www.gov.uk/driving-transaction-finished-v7",
            'analytics': "variant-7",
            'content': '<div class="summary"><p>Please join the NHS Organ Donor Register.</p></div><p>If you needed an organ transplant would you have one? If so please help others.</p><p><a rel="external" href="https://www.organdonation.nhs.uk/how_to_become_a_donor/registration/consent.asp?campaign=2244&v=7" title="Register to become an organ donor" class="button">Join</a> or <a rel="external" href="http://www.organdonation.nhs.uk/how_to_become_a_donor/questions/index.asp?campaign=2244&v=7" title="Learn more about organ donation">Find out more</a></p>'
        },
        {
            'url': "www.gov.uk/driving-transaction-finished-v8",
            'analytics': "variant-8",
            'content': '<div class="summary"><p>Please join the NHS Organ Donor Register.</p></div><p>If you support organ donation please turn your support into action.</p><p><a rel="external" href="https://www.organdonation.nhs.uk/how_to_become_a_donor/registration/consent.asp?campaign=2244&v=8" title="Register to become an organ donor" class="button">Join</a> or <a rel="external" href="http://www.organdonation.nhs.uk/how_to_become_a_donor/questions/index.asp?campaign=2244&v=8" title="Learn more about organ donation">Find out more</a></p>'
            
        }         
    ]
};




(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;

  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var multivariateTest = {
    init: function(variations){
      var id = multivariateTest.randomSelect(variations.variants.length);

      multivariateTest.updateContent(variations.variants[id].content, variations.rootnode);

      multivariateTest.sendData(variations.variants[id].analytics);
    },

    randomSelect: function(total){
    	return Math.floor(Math.random() * (total));
    },

    updateContent: function(content, rootnode){
      $(rootnode).first().html(content);
    },

    sendData: function(analytics){
      root._gaq && _gaq.push(["_setCustomVar",12,"organ donation",analytics,3]); 
      root._gaq && _gaq.push(['_trackEvent', 'Variant Test', 'go', '-', 0, true]);	
    }
  }
  root.GOVUK.multivariateTest = multivariateTest;
}).call(this);


if($(".completed_transaction").length != 0){
  GOVUK.multivariateTest.init(variants);
};