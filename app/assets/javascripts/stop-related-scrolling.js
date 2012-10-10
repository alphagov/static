(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;

  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var stopRelatedScrolling = {
    _hasScrolled: false,
    _scrollTimeout: false,

    init: function(){
      stopRelatedScrolling.$related = $('.related-positioning');
      stopRelatedScrolling.footerTop = $('#footer').offset().top - 10;
      
      var relatedOffset = stopRelatedScrolling.$related.css('top');
      relatedOffset = parseInt(relatedOffset.substr(0, relatedOffset.length-2));
      stopRelatedScrolling.relatedOffset = relatedOffset;
      stopRelatedScrolling.relatedHeight = relatedOffset + $('#related').height();

      stopRelatedScrolling.state = 'fixed';

      if(stopRelatedScrolling._scrollTimeout === false) {
        $(window).scroll(stopRelatedScrolling.onScroll);
        stopRelatedScrolling._scrollTimeout = window.setInterval(stopRelatedScrolling.checkScroll, 25);
      }
      $(window).resize(stopRelatedScrolling.onResize);
      stopRelatedScrolling.checkScroll();
    },
    onScroll: function(){
      stopRelatedScrolling._hasScrolled = true;
    },
    checkScroll: function(){
      if(stopRelatedScrolling._hasScrolled === true){
        stopRelatedScrolling._hasScrolled = false;

        var bottomOfRelated = $(window).scrollTop() + stopRelatedScrolling.relatedHeight;

        if (bottomOfRelated > stopRelatedScrolling.footerTop){
          stopRelatedScrolling.stick();
        } else {
          stopRelatedScrolling.unstick();
        }
      }
    },
    stick: function(){
      if(stopRelatedScrolling.state === 'fixed'){
        stopRelatedScrolling.$related.css({ 'position': 'absolute', 'top': stopRelatedScrolling.footerTop + stopRelatedScrolling.relatedOffset - stopRelatedScrolling.relatedHeight });
        stopRelatedScrolling.state = 'absolute';
      }
    },
    unstick: function(){
      if(stopRelatedScrolling.state === 'absolute'){
        stopRelatedScrolling.$related.css({ 'position': '', 'top': '' });
        stopRelatedScrolling.state = 'fixed';
      }
    }
  }
  root.GOVUK.stopRelatedScrolling = stopRelatedScrolling;
}).call(this);

$(function(){
  if($(".related-positioning").css("position") != "absolute"){
    window.GOVUK.stopRelatedScrolling.init();
  }
})
