(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var sticky = {
    _hasScrolled: false,
    _scrollTimeout: false,

    init: function(){
      var $els = $('.js-stick-at-top-when-scrolling');

      if($els.length > 0){
        sticky.$els = $els;

        if(sticky._scrollTimeout === false) {
          $(window).scroll(sticky.onScroll);
          sticky._scrollTimeout = window.setInterval(sticky.checkScroll, 50);
        }
        $(window).resize(sticky.onResize);
      }
    },
    onScroll: function(){
      sticky._hasScrolled = true;
    },
    checkScroll: function(){
      if(sticky._hasScrolled === true){
        sticky._hasScrolled = false;

        var windowVerticalPosition = $(window).scrollTop();
        sticky.$els.each(function(i, el){
          var $el = $(el),
              scrolledFrom = $el.data('scrolled-from');

          if (scrolledFrom && windowVerticalPosition < scrolledFrom){
            sticky.release($el);
          } else if($(window).width() > 768 && windowVerticalPosition >= $el.offset().top) {
            sticky.stick($el);
          } else {
            sticky.release($el);
          }
        });
      }
    },
    stick: function($el){
      if (!$el.hasClass('content-fixed')) {
        $el.data('scrolled-from', $el.offset().top);
        $el.before('<div class="shim" style="width: '+ $el.width() + 'px; height: ' + $el.height() + 'px">&nbsp;</div>');
        $el.css('width', $el.width() + "px").addClass('content-fixed');
      }
    },
    release: function($el){
      if($el.hasClass('content-fixed')){
        $el.data('scrolled-from', false);
        $el.removeClass('content-fixed').css('width', '');
        $el.siblings('.shim').remove();
      }
    }
  }
  root.GOVUK.stickAtTopWhenScrolling = sticky;
}).call(this);

// We require the below init as Inside Gov, where this script is originally from, split their inits out into a separate file. When this javascript is a shared cross-proposition asset, will no longer be required
$(function() {
  GOVUK.stickAtTopWhenScrolling.init();
})