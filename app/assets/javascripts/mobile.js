// Scripts for behaviour specific to use on mobile (non-desktop) devices

(function () {
  var GOVUK = GOVUK || {};

  GOVUK.mobileGuideTabs = {
    init : function () {
      var $navbar = $('div.article-container aside nav.page-navigation'),
          $navList = $navbar.find('ol')
          $showAllLink = $('<a href="#" class="show-all-parts">Show all parts of this guide</a>'),
          $pageHeader = $('.multi-page article header h1 span');

      $showAllLink.insertBefore($navbar);
      $pageHeader.html($pageHeader.html().replace(/Part\s(\d+)/, 'Part $1 of ' + $navList.find('li').length));
      $showAllLink.on('click', function (e) {
        var $this = $(this);

        if(!$this.hasClass('show-all-parts-open')) {
          $this.addClass('show-all-parts-open');
          $this.text($this.text().replace(/Show/, 'Hide'));
          $navList.show();
          $navbar.addClass('page-navigation-open');
        } else {
          $this.removeClass('show-all-parts-open');
          $this.text($this.text().replace(/Hide/, 'Show'));
          $navList.hide();
          $navbar.removeClass('page-navigation-open');
        }

        return false;
      });

      $navList.hide();
    }
  };
  GOVUK.mobileGuideTabs.init();
}(jQuery));
