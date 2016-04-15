describe('A global bar module', function() {
  "use strict";

  var bar,
      element;

  beforeEach(function() {
    bar = new GOVUK.Modules.GlobalBar();
    element = $('<div>Bar message <a href="#" class="dismiss">Dismiss</a></div>');
    $('body').append(element);
  });

  afterEach(function() {
    element.remove();
  });

  describe('when no cookies are set', function() {
    beforeEach(function() {
      spyOn(GOVUK.analytics, 'trackEvent');
      spyOn(GOVUK, 'setCookie');
      spyOn(GOVUK, 'getCookie').and.returnValue(undefined);
      bar.start(element);
    });

    it('sets a new cookie with view count set to 1', function() {
      expect(GOVUK.setCookie).toHaveBeenCalledWith('global_bar_seen', 1, {days: 84});
    });

    it('tracks to analytics', function() {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('Global bar', 'Viewed', {nonInteraction: 1});
      expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalledWith('Global bar', 'Automatically dismissed', {nonInteraction: 1});
    });
  });

  describe('when a cookie has been set', function() {
    describe('when the bar is visible', function() {
      beforeEach(function() {
        spyOn(GOVUK.analytics, 'trackEvent');
        spyOn(GOVUK, 'setCookie');
        spyOn(GOVUK, 'getCookie').and.returnValue('1');
        bar.start(element);
      });

      it('increments the view count in the cookie', function() {
        expect(GOVUK.setCookie).toHaveBeenCalledWith('global_bar_seen', 2, {days: 84});
      });

      it('tracks to analytics', function() {
        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('Global bar', 'Viewed', {nonInteraction: 1});
        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('Global bar', 'Automatically dismissed', {nonInteraction: 1});
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

  describe('when a dismiss link is clicked', function() {
    it('hides the bar and sets a cookie so it doesn’t show again', function() {
      spyOn(GOVUK.analytics, 'trackEvent');
      spyOn(GOVUK, 'setCookie');
      spyOn(GOVUK, 'getCookie').and.returnValue('1');
      expect(element.is(':visible')).toBe(true);
      bar.start(element);

      element.find('.dismiss').trigger('click');
      expect(element.is(':visible')).toBe(false);
      expect(GOVUK.setCookie).toHaveBeenCalledWith('global_bar_seen', 999, {days: 84});
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('Global bar', 'Manually dismissed', {nonInteraction: 1});
    });
  });
});
