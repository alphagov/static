describe('Links to YouTube in govspeak content', function () {
  "use strict";

  var $element;

  beforeEach(function() {
    $element = $('<div class="govuk-govspeak">\
                    <a href="https://youtu.be/OzjogCFO4Zo">\
                      This link to YouTube\
                    </a>\
                  </div>');
    var YoutubeVideoLinks = new GOVUK.Modules.YoutubeVideoLinks();
    YoutubeVideoLinks.start($element);
  });

  afterEach(function() {
    $(document).off();
  });

  describe('- A YouTube link to be converted to an embedded player', function () {

    it("does not have a data attribute - data-youtube-player", function () {
      var YoutubeVideoLink = $element.find('a');
      expect(YoutubeVideoLink).not.toHaveAttr('data-youtube-player');
    });
    it("is converted to an embedded player", function () {
      $element = $('<div class="govuk-govspeak">\
                    <span class="media-player"></span>\
                  </div>');
      var mediaPlayer = $element.find('.media-player');
      expect(mediaPlayer).toHaveLength(1);
    });
  });

  describe('- An external link to YouTube', function () {
    it("has a data attribute - data-youtube-player", function () {
      $element = $('<div class="govuk-govspeak">\
                    <a href="https://youtu.be/OzjogCFO4Zo" data-youtube-player="off">\
                      This link to YouTube\
                    </a>\
                  </div>');
      var govspeakLink = $element.find('a');
      expect(govspeakLink).toHaveAttr('data-youtube-player');
    });
    it("is not converted to an embedded player", function () {
      var mediaPlayer = $element.find('.media-player');
      expect(mediaPlayer).toHaveLength(0);
    });
  });

});
