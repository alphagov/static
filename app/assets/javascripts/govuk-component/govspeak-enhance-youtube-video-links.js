//= require libs/jquery/jquery-ui-1.10.2.custom
//= require vendor/jquery/jquery.player.min

(function ($) {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  function GovspeakYoutubeVideoLinks () {

    function getProtocol(){
      var scheme = document.location.protocol;
      if (scheme == "file:") {
        scheme = "https:";
      }
      return scheme;
    }

    function parseYoutubeVideoId(string){
      if(string.indexOf('youtube.com') > -1){
        var i, _i, part, parts, params = {};
        parts = string.split('?');
        if (parts.length === 1){
          return;
        }
        parts = parts[1].split('&');
        for(i=0,_i=parts.length; i<_i; i++){
          part = parts[i].split('=');
          params[part[0]] = part[1];
        }
        return params.v;
      }
      if(string.indexOf('youtu.be') > -1){
        var parts = string.split('/');
        return parts.pop();
      }
    }

    function shouldConvertToEmbeddedPlayer($link){
      return $link.attr("data-youtube-player") != "off";
    }

    function enhanceYoutubeVideoLinks($el) {
      if ($($el).hasClass('disable-youtube')) return ;
      $el.find("a[href*='youtube.com'], a[href*='youtu.be']").each(function (i){

        var $link = $(this);

        if (shouldConvertToEmbeddedPlayer($link)) {
          var videoId = parseYoutubeVideoId($link.attr('href'));

          if(typeof videoId !== 'undefined') {

            var $holder = $('<span class="media-player" />'),
                $captions = $link.siblings('.captions');

            $link.parent().replaceWith($holder);
            var protocol = getProtocol();
            $holder.player({
              id: 'youtube-'+i,
              media: videoId,
              captions: $captions.length > 0 ? $captions.attr('href') : null,
              url: (protocol + '//www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=')
            });
          }
        }
      });
    }

    return {
      getProtocol: getProtocol,
      enhanceYoutubeVideoLinks: enhanceYoutubeVideoLinks
    }

  }

  GOVUK.enhanceYoutubeVideoLinks = new GovspeakYoutubeVideoLinks();
  GOVUK.enhanceYoutubeVideoLinks.enhanceYoutubeVideoLinks($('.govuk-govspeak'));

})(jQuery);
