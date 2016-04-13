describe('A global bar module', function() {
  "use strict";

  var bar,
      element;

  beforeEach(function() {
    bar = new GOVUK.Modules.GlobalBar();
    element = $('<div>Bar message</div>');
    $('body').append(element);
  });

  afterEach(function() {
    element.remove();
  });

  describe('when no cookies are set', function() {
    it('sets a new cookie with view count set to 1', function() {
      spyOn(GOVUK, 'setCookie');
      spyOn(GOVUK, 'getCookie').and.returnValue(undefined);
      bar.start(element);

      expect(GOVUK.setCookie).toHaveBeenCalledWith('global_bar_seen', 1, {days: 28});
    });
  });

  describe('when a cookie has been set', function() {
    describe('when the bar is visible', function() {
      it('increments the view count in the cookie', function() {
        spyOn(GOVUK, 'setCookie');
        spyOn(GOVUK, 'getCookie').and.returnValue('1');
        bar.start(element);

        expect(GOVUK.setCookie).toHaveBeenCalledWith('global_bar_seen', 2, {days: 28});
      });
    });

    describe('when the bar is invisible', function() {
      it('leaves the view count in the cookie the same', function() {
        spyOn(GOVUK, 'setCookie');
        spyOn(GOVUK, 'getCookie').and.returnValue('1');
        element.hide();
        bar.start(element);

        expect(GOVUK.setCookie).not.toHaveBeenCalled();
      });
    });
  });
});
