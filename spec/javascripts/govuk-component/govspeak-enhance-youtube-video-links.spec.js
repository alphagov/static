describe('A YouTube link to be converted to an embedded player in govspeak content', function () {
  "use strict";

  it("is converted to an embedded player", function () {

    var enhanceYoutubeVideoLinksFixture, $enhanceYoutubeVideoLinksHTML;

    enhanceYoutubeVideoLinksFixture = '<div class="govuk-govspeak">'
    +'<p>This content has a YouTube video link, converted to an accessible embedded player by component JavaScript.</p>'
    +'<p><a href="https://www.youtube.com/watch?v=y6hbrS3DheU">Operations: a developers guide, by Anna Shipman</a></p>'
    +'</div>';

    $enhanceYoutubeVideoLinksHTML = $(enhanceYoutubeVideoLinksFixture);
    $('body').append($enhanceYoutubeVideoLinksHTML);
    GOVUK.enhanceYoutubeVideoLinks($(".govuk-govspeak"));

    expect($('.media-player')).toHaveLength(1);
  });

});
