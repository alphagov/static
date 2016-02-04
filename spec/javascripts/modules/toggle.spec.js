describe('A toggle module', function() {
  "use strict";

  var toggle,
      element;

  beforeEach(function() {
    toggle = new GOVUK.Modules.Toggle();
  });

  describe('when starting', function() {
    var element = $('\
      <div>\
        <a href="#" class="js-toggle" data-expanded="false" data-controls="target">Toggle</a>\
        <div id="target">Target</div>\
      </div>');

    it('adds aria attributes to toggles', function() {
      toggle.start(element);
      
      var $toggle = element.find('.js-toggle');
      expect($toggle.attr('role')).toBe('button');
      expect($toggle.attr('aria-expanded')).toBe('false');
      expect($toggle.attr('aria-controls')).toBe('target');
    });
  });

  describe('when clicking a toggle', function() {
    var element;

    beforeEach(function() {
      element = $('\
        <div>\
          <a href="#" class="js-toggle" data-expanded="false" data-controls="target">Toggle</a>\
          <div id="target" class="hidden">Target</div>\
        </div>');

      toggle.start(element);
      element.find('.js-toggle').trigger('click');
    });

    it('toggles the display of a target', function() {
      expect(element.find('#target').is('.hidden')).toBe(false);
      element.find('.js-toggle').trigger('click');
      expect(element.find('#target').is('.hidden')).toBe(true);
    });

    it('updates the aria-expanded attribute on the toggle', function() {
      expect(element.find('.js-toggle').attr('aria-expanded')).toBe('true');

      element.find('.js-toggle').trigger('click');
      expect(element.find('.js-toggle').attr('aria-expanded')).toBe('false');
    });
  });

  describe('when clicking a toggle that controls multiple targets', function() {
    it('toggles the display of each target', function() {
      var element = $('\
        <div>\
          <a href="#" class="js-toggle" data-expanded="false" data-controls="target another-target">Toggle</a>\
          <div id="target" class="hidden">Target</div>\
          <div id="another-target" class="hidden">Another target</div>\
        </div>');

      toggle.start(element);
      expect(element.find('#target').is('.hidden')).toBe(true);
      expect(element.find('#another-target').is('.hidden')).toBe(true);

      element.find('.js-toggle').trigger('click');
      expect(element.find('#target').is('.hidden')).toBe(false);
      expect(element.find('#another-target').is('.hidden')).toBe(false);

      element.find('.js-toggle').trigger('click');
      expect(element.find('#target').is('.hidden')).toBe(true);
      expect(element.find('#another-target').is('.hidden')).toBe(true);
    });
  });
});
