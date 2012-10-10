(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var breadcrumbTruncate = {
    init: function(){
      var $els = $('.js-breadcrumb-truncate');

      if($els.length > 0){
        breadcrumbTruncate.$els = $els;
        breadcrumbTruncate.hideExtra();
      }

    },
    hideExtra: function(){
      breadcrumbTruncate.$els.each(function(i, el){
        var $el = $(el),
            children = $el.children().toArray(),
            $child;

        // shift off the home element before we enter the loop
        children.shift();

        while(breadcrumbTruncate.isMoreThanOneRow($el)){
          $child = $(children.shift());

          $child.html('<a href="#" class="hellip" title="Expand breadcrumb">&hellip;</a><span class="shrunk">'+ $child.html() +'</span>');

          $child.find('.hellip').click(function(e){
            e.preventDefault();

            var $el = $(e.target).parent();

            $el.find('.hellip').remove();
            $el.find('.shrunk').removeClass('shrunk').focus();
          });
        }
      });
    },
    isMoreThanOneRow: function($el){
      var offsetTop = $el.offset().top,
          $children = $el.children(),
          moreThanOneRow = false;

      $children.each(function(i, el){
        if($(el).offset().top - offsetTop > 0){
          moreThanOneRow = true;
        }
      });

      return moreThanOneRow;
    }
  };

  root.GOVUK.breadcrumbTruncate = breadcrumbTruncate;
}).call(this);

$(function() {
  GOVUK.breadcrumbTruncate.init();
})
