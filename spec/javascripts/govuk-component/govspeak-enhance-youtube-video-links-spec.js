describe('Links to YouTube in govspeak content', function () {

  describe('A YouTube link to be converted to an embedded player', function () {

    var $enhanceYoutubeVideoLinksFixture, enhanceYoutubeVideoLinks;

    beforeEach(function() {

      $enhanceYoutubeVideoLinksFixture = $('<div class="govuk-govspeak">'+
                                            '<a href="https://youtu.be/OzjogCFO4Zo">'+
                                              'This link to YouTube'+
                                            '</a>'+
                                          '</div>');
      $('body').append($enhanceYoutubeVideoLinksFixture);
      enhanceYoutubeVideoLinks = new GOVUK.enhanceYoutubeVideoLinks($('.govuk-govspeak'));

    });

    afterEach(function() {
      $('.govuk-govspeak').remove();
      $('.media-player').remove();
    });

    it("does not have a data attribute - data-youtube-player", function () {
      expect($('.govuk-govspeak a')).not.toHaveAttr('data-youtube-player');
    });

    it("creates a media player", function () {
      expect($('.media-player')).toExist();
    });

  });

  describe('An external link to YouTube', function () {

    var $externalYoutubeVideoLinksFixture, externalYoutubeVideoLinks;

    beforeEach(function() {

      $externalYoutubeVideoLinksFixture = $('<div class="govuk-govspeak">'+
                                            '<a href="https://youtu.be/OzjogCFO4Zo" data-youtube-player="off">'+
                                              'This link to YouTube'+
                                            '</a>'+
                                          '</div>');
      $('body').append($externalYoutubeVideoLinksFixture);
      externalYoutubeVideoLinks = new GOVUK.enhanceYoutubeVideoLinks($('.govuk-govspeak'));

    });

    afterEach(function() {
      $('.govuk-govspeak').remove();
      $('.media-player').remove();
    });

    it("has a data attribute - data-youtube-player that prevents the link being converted to a player", function () {
      expect($('.govuk-govspeak a')).toHaveAttr('data-youtube-player');
    });

    it("does not create a media player", function () {
      expect($('.media-player')).not.toExist();
    });

  });

});
