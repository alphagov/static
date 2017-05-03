describe('Links to YouTube in govspeak content', function () {
  "use strict";

  var $enhanceYoutubeVideoLinksHTML, enhanceYoutubeVideoLinks;

  var $turnOffEnhanceYoutubeVideoLinksHTML;

  describe('- A YouTube link to be converted to an embedded player', function () {

    beforeEach(function() {

      $enhanceYoutubeVideoLinksHTML = $('<div class="govuk-govspeak">'+
                                          '<a href="https://youtu.be/OzjogCFO4Zo">'+
                                            'This link to YouTube'+
                                          '</a>'+
                                        '</div>');

      $('body').append($enhanceYoutubeVideoLinksHTML);
      GOVUK.enhanceYoutubeVideoLinks.enhanceYoutubeVideoLinks($('.govuk-govspeak'));
      spyOn(GOVUK.enhanceYoutubeVideoLinks, 'getProtocol').and.returnValue('https:');

    });

    afterEach(function() {
      $enhanceYoutubeVideoLinksHTML.remove();
      $('.media-player').remove();
    });

    it("does not have a data attribute - data-youtube-player", function () {
      expect($('.govuk-govspeak a')).not.toHaveAttr('data-youtube-player');
    });

    it("is converted to an embedded player", function () {
      expect($('.media-player')).toHaveLength(1);
    });

  });

  describe('- An external link to YouTube', function () {

    beforeEach(function() {

      $turnOffEnhanceYoutubeVideoLinksHTML = $('<div class="govuk-govspeak">'+
                                                '<a href="https://youtu.be/OzjogCFO4Zo" data-youtube-player="off">'+
                                                  'This link to YouTube'+
                                                '</a>'+
                                              '</div>');

      $('body').append($turnOffEnhanceYoutubeVideoLinksHTML);
      GOVUK.enhanceYoutubeVideoLinks.enhanceYoutubeVideoLinks($('.govuk-govspeak'));
    });

    afterEach(function() {
      $turnOffEnhanceYoutubeVideoLinksHTML.remove();
      $('.media-player').remove();
    });

    it("has a data attribute - data-youtube-player", function () {
      expect($('.govuk-govspeak a')).toHaveAttr('data-youtube-player');
    });

    it("is not converted to an embedded player", function () {
      expect($('.media-player')).not.toHaveLength(1);
    });
  });

  describe('- Link expansion disabled when disable-youtube class provided on parent', function () {

    beforeEach(function() {

      $turnOffEnhanceYoutubeVideoLinksHTML = $('<div class="govuk-govspeak disable-youtube">'+
                                                '<a href="https://youtu.be/OzjogCFO4Zo">'+
                                                  'This link to YouTube'+
                                                '</a>'+
                                              '</div>');

      $('body').append($turnOffEnhanceYoutubeVideoLinksHTML);
      GOVUK.enhanceYoutubeVideoLinks.enhanceYoutubeVideoLinks($('.govuk-govspeak:not(.disable-youtube)'));
    });

    afterEach(function() {
      $turnOffEnhanceYoutubeVideoLinksHTML.remove();
      $('.media-player').remove();
    });

    it("is not converted to an embedded player", function () {
      expect($('.media-player')).not.toHaveLength(1);
    });
  });

});
