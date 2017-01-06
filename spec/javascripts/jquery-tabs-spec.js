describe("jQuery tabs", function () {
  var TABS = '\
        <div class="tabs-container">\
          <div class="js-tabs nav-tabs">\
            <ul>\
                <li><a href="#tab-1">Tab 1</a></li>\
                <li><a href="#tab-2">Tab 2</a></li>\
                <li><a href="#tab-3">Tab 3</a></li>\
            </ul>\
          </div>\
          <div class="js-tab-content tab-content">\
            <div class="js-tab-pane tab-pane" id="tab-1">\
              Tab 1\
            </div>\
            <div class="js-tab-pane tab-pane" id="tab-2">\
              Tab 2\
            </div>\
            <div class="js-tab-pane tab-pane" id="tab-3">\
              Tab 3\
            </div>\
          </div>\
        </div>';
  var $tabs;

  beforeEach(function() {
    $tabs = $(TABS);
    document.location.hash = '';
    $('body').append($tabs);
  });

  afterEach(function() {
    $tabs.remove();
  });

  describe("starting tabs without floats creates accordion by default", function(){
    beforeEach(function() {
      $tabs.tabs();
    });

    it("removes list of tab links", function() {
      expect($tabs.find('.js-tabs li').length).toBe(0);
    });

    it("adds aria attributes to tab panes", function() {
      var tab2 = $tabs.find('#tab-2-enhanced');

      expect(tab2.attr('role')).toBe('tabpanel');
      expect(tab2.attr('aria-hidden')).toBe('true');
      expect(tab2.attr('aria-expanded')).toBe('false');
      expect(tab2.attr('aria-labelledby')).toBe('tab-tab-2');
    });

    it("adds aria attributes to tab links", function() {
      var tab2link = $tabs.find('.js-heading-tab a[href="#tab-2"]');
      expect(tab2link.attr('role')).toBe('tab');
      expect(tab2link.attr('aria-controls')).toBe('tab-2');
      expect(tab2link.attr('aria-flowto')).toBe('tab-2');
    });

    it("puts a heading link in each tab pane", function() {
      expect($tabs.find('.js-heading-tab').length).toBe(3);
      expect($tabs.find('.js-heading-tab').eq(0).text()).toBe('Tab 1');
    });

    it("hides all 3 tabs", function() {
      expect($tabs.find('.js-tab-pane:visible').length).toBe(0);
    });

    it("adds a scroll to top link in each tab", function() {
      expect($tabs.find('.tab-shiftlink').length).toBe(3);
      expect($tabs.find('.tab-shiftlink[href="#tab-1"]').text()).toBe('Return to top of section ↑');
    });

    describe("clicking a tab link", function() {
      beforeEach(function() {
        $tabs.find('a[href="#tab-1"]').trigger('click');
      });

      it("opens the selected tab", function() {
        expect($tabs.find('.js-tab-pane:visible').length).toBe(1);
        expect($tabs.find('#tab-1 .js-tab-pane:visible').length).toBe(1);
        expect($tabs.find('#tab-1 .js-heading-tab.active').length).toBe(1);
      });

      describe("clicking again", function() {
        it("closes the selected tab", function() {
          $tabs.find('a[href="#tab-1"]').trigger('click');
          expect($tabs.find('.js-tab-pane:visible').length).toBe(0);
        });
      });

      describe("clicking a different tab", function() {
        it("closes the old, opens the new", function() {
          $tabs.find('a[href="#tab-2"]').trigger('click');
          expect($tabs.find('.js-tab-pane:visible').length).toBe(1);
          expect($tabs.find('#tab-2 .js-tab-pane:visible').length).toBe(1);
          expect($tabs.find('#tab-2 .js-heading-tab.active').length).toBe(1);
        });
      });
    });
  });

  describe("starting tabs when tab links are floated", function(){
    beforeEach(function() {
      $tabs.find('li').attr('style', 'float: left');
      $tabs.tabs();
    });

    it("adds an active class to the first tab link", function() {
      expect($tabs.find('.js-tabs li.active:first-child').length).toBe(1);
    });

    it("adds aria attributes to tab panes", function() {
      var tab2 = $tabs.find('#tab-2-enhanced');

      expect(tab2.attr('role')).toBe('tabpanel');
      expect(tab2.attr('aria-hidden')).toBe('true');
      expect(tab2.attr('aria-expanded')).toBe('false');
      expect(tab2.attr('aria-labelledby')).toBe('tab-tab-2');
    });

    it("adds aria attributes to tab links", function() {
      var tab2link = $tabs.find('a[href="#tab-2"]');

      expect(tab2link.attr('role')).toBe('tab');
      expect(tab2link.attr('aria-controls')).toBe('tab-2');
      expect(tab2link.attr('aria-flowto')).toBe('tab-2');
      expect(tab2link.attr('aria-selected')).toBe('false');
    });

    it("hides all but the first tab", function() {
      var tab1 = $tabs.find('#tab-1-enhanced');

      expect(tab1.attr('aria-hidden')).toBe('false');
      expect(tab1.attr('aria-expanded')).toBe('true');
      expect($tabs.find('.js-tab-pane').length).toBe(3);
      expect($tabs.find('.js-tab-pane:first-child:visible').length).toBe(1);
    });

    describe("clicking a tab that's not showing", function() {
      beforeEach(function() {
        $tabs.find('a[href="#tab-3"]').trigger('click');
      });

      it("opens the selected tab", function() {
        var tab3 = $tabs.find('#tab-3-enhanced');

        expect(tab3.is('.js-tab-pane:visible')).toBe(true);
        expect(tab3.attr('aria-hidden')).toBe('false');
        expect(tab3.attr('aria-expanded')).toBe('true');
      });

      it("closes the previously opened tab", function() {
        var tab1 = $tabs.find('#tab-1-enhanced');

        expect($tabs.find('.js-tab-pane:visible').length).toBe(1);
        expect(tab1.is('.js-tab-pane:visible')).toBe(false);
        expect(tab1.attr('aria-hidden')).toBe('true');
        expect(tab1.attr('aria-expanded')).toBe('false');
      });
    });
  });
});
