describe('HMRC webchat', function () {
  var INSERTION_HOOK = '<main id="content"><header></header></div>';

  beforeEach(function() {
    spyOn(GOVUK.webchat, 'shouldOpen').and.returnValue(true);
    spyOn(GOVUK.webchat, 'validOrigin').and.returnValue(true);
    setFixtures(INSERTION_HOOK);
    GOVUK.webchat.init();
  });

  afterEach(function() {
    $('.webchat-banner, body>iframe.hidden:last-child').remove();
  });


  it('should load a banner', function() {
    expect($('.webchat-banner').length).toBe(1);
  });

  it('should load a hidden iframe', function() {
    expect($('body>iframe.hidden:last-child').length).toBe(1);
  });

  describe('if it receives an open message', function(){

    beforeEach(function(done){
      window.postMessage(JSON.stringify({evt: 'opened'}), '*');
      $(window).on('message',done);
    });

    it('should show the banner', function() {
      expect($('.webchat-banner.open').length).toBe(1);
    });

  });

  describe('if it receives a closed message', function(){

    beforeEach(function(done){
      window.postMessage(JSON.stringify({evt: 'closed'}), '*');
      $(window).on('message',done);
    });

    it('should hide the banner', function() {
      expect($('.webchat-banner:not(.open)').length).toBe(1);
    });

  });

});
