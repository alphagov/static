describe('HMRC webchat', function () {
  var INSERTION_HOOK = '<main id="content"><header></header></div>';

  beforeEach(function() {
    spyOn(GOVUK.webchat, 'shouldOpen').and.returnValue(true);
    spyOn(GOVUK.webchat, 'validOrigin').and.returnValue(true);
    spyOn(GOVUK.webchat, 'sendMessage');
    spyOn(GOVUK.analytics, 'trackEvent');
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

    it('sends an "offered" event to GA', function() {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('webchat', 'offered');
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

    it('sends an "unavailable" event to GA', function() {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('webchat', 'unavailable');
    });

  });

  describe('if it receives an error message', function(){

    beforeEach(function(done){
      window.postMessage(JSON.stringify({evt: 'error'}), '*');
      $(window).on('message',done);
    });

    it('sends an "error" event to GA', function() {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('webchat', 'error');
    });

  });

  describe('interacting with the webchat banner', function() {
    beforeEach(function(done){
      window.postMessage(JSON.stringify({evt: 'opened'}), '*');
      $(window).on('message',done);
    });

    describe('by clicking the accept button', function() {
      beforeEach(function() {
        GOVUK.webchat.$banner.find('.accept').click();
      });

      it('sends an "accepted" event to GA', function() {
        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('webchat', 'accepted');
      });

      it('sends an "accept" message to the iframe', function() {
        expect(GOVUK.webchat.sendMessage).toHaveBeenCalledWith({ evt: 'accept'});
      });
    });

    describe('by clicking the reject button', function() {
      beforeEach(function() {
        GOVUK.webchat.$banner.find('.reject').click();
      });

      it('sends an "rejected" event to GA', function() {
        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('webchat', 'rejected');
      });

      it('sends an "reject" message to the iframe', function() {
        expect(GOVUK.webchat.sendMessage).toHaveBeenCalledWith({ evt: 'reject'});
      });
    });
  });

  describe('trackEvent', function () {
    it('sends the supplied status as the action to GA with a category of "webchat"', function () {
      GOVUK.webchat.trackEvent('chatting');
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('webchat', 'chatting');
    });

    it('does not send the status to GA again if the previous status was the same', function () {
      GOVUK.webchat.trackEvent('chatting');
      GOVUK.webchat.trackEvent('chatting');
      expect(GOVUK.analytics.trackEvent.calls.count()).toEqual(1);
      expect(GOVUK.analytics.trackEvent.calls.mostRecent().args[1]).toEqual('chatting');
    });

    it('sends the status to GA for each change in state (e.g. we only look at the previous state, we do not keep a full history)', function () {
      GOVUK.webchat.trackEvent('chatting');
      expect(GOVUK.analytics.trackEvent.calls.count()).toEqual(1);
      expect(GOVUK.analytics.trackEvent.calls.mostRecent().args[1]).toEqual('chatting');
      GOVUK.webchat.trackEvent('chatting');
      expect(GOVUK.analytics.trackEvent.calls.count()).toEqual(1);
      expect(GOVUK.analytics.trackEvent.calls.mostRecent().args[1]).toEqual('chatting');
      GOVUK.webchat.trackEvent('listening');
      expect(GOVUK.analytics.trackEvent.calls.count()).toEqual(2);
      expect(GOVUK.analytics.trackEvent.calls.mostRecent().args[1]).toEqual('listening');
      GOVUK.webchat.trackEvent('listening');
      expect(GOVUK.analytics.trackEvent.calls.count()).toEqual(2);
      expect(GOVUK.analytics.trackEvent.calls.mostRecent().args[1]).toEqual('listening');
      GOVUK.webchat.trackEvent('chatting');
      expect(GOVUK.analytics.trackEvent.calls.count()).toEqual(3);
      expect(GOVUK.analytics.trackEvent.calls.mostRecent().args[1]).toEqual('chatting');
      GOVUK.webchat.trackEvent('listening');
      expect(GOVUK.analytics.trackEvent.calls.count()).toEqual(4);
      expect(GOVUK.analytics.trackEvent.calls.mostRecent().args[1]).toEqual('listening');
    });
  });
});
