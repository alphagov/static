$(document).ready(function() {
  // Browse sections click actions
  if ($('.section-page').length > 0) {
    $('.filters').find('li.open').on('click', 'a', function (e) {
      var $this = $(this);
      
      if ($this.parents('ul.subsections').length < 1) {
        e.preventDefault();
        window.location.href = '#/';
        slug = 'popular';
        $('.subsections').find('.active').removeClass('active');
      } else {
        var $section = $(this).parent();
        var slug = $section.data('filter').match(/section-([\w-]+)/).pop();
        $section.addClass('active').siblings().removeClass('active');
      }

      $('#'+slug).removeClass('hidden').siblings().not('.summary').addClass('hidden');
    });
    
    if (window.location.hash != '' && window.location.hash != '#/') {
      // on page load parse hash
      var hash = window.location.hash.substring(2);
      $('.subsections li').filter(function() {
        return $(this).data('filter') == 'section-'+hash;
      }).find('a').click();
    }
  }
});