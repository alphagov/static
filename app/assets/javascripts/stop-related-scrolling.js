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
    },
    checkOverflow: function(){
      if($(window).width() >= "768"){
        if($(".related-positioning").length !== 0){
          $(".related-positioning").css("position", "absolute");
          var viewPort = $(window).height();
          var relatedBox = $(".related").height();
          var boxOffset = $(".related-positioning").position();
          var topBoxOffset = boxOffset.top;
          if(relatedBox > (viewPort - topBoxOffset)){
            $(".related-positioning").css("position", "absolute");
            return true;
          }
          else{
            $(".related-positioning").css("position", "fixed");
            return false;
          }
        }
      }
    }
  }
  root.GOVUK.stopRelatedScrolling = stopRelatedScrolling;
}).call(this);

$(function(){
  if(!window.GOVUK.stopRelatedScrolling.checkOverflow()){
    window.GOVUK.stopRelatedScrolling.init();
  }
})
