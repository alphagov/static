//= require libs/jquery/jquery-ui-1.10.2.custom
//= require vendor/jquery/jquery.player.min

(function(Modules) {
  "use strict";

  Modules.YoutubeVideoLinks = function() {

    this.start = function($el) {

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
        $el.find("a[href*='youtube.com'], a[href*='youtu.be']").each(function (i){

          var $link = $(this);

          if (shouldConvertToEmbeddedPlayer($link)) {
            var videoId = parseYoutubeVideoId($link.attr('href'));

            if(typeof videoId !== 'undefined') {

              var $holder = $('<span class="media-player" />'),
                  $captions = $link.siblings('.captions');

              $link.parent().replaceWith($holder);
              $holder.player({
                id: 'youtube-'+i,
                media: videoId,
                captions: $captions.length > 0 ? $captions.attr('href') : null,
                url: (document.location.protocol + '//www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=')
              });
            }
          }
        });
      }

      var $element = $('.govuk-govspeak');
      enhanceYoutubeVideoLinks($element);

    };
  };

})(window.GOVUK.Modules);
