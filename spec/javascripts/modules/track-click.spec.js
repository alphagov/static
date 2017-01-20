describe('A click tracker', function() {
  "use strict";

  var tracker,
      element;

  beforeEach(function() {
    tracker = new GOVUK.Modules.TrackClick();
  });

  it('tracks click events using "beacon" as transport', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $('\
      <div \
        data-track-category="category"\
        data-track-action="action"\
        data-track-label="Foo">\
        Bar!\
      </div>\
    ');

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', {label: 'Foo', transport: 'beacon'});
  });

  it('tracks clicks with custom dimensions', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $(
      '<a data-track-category="category" \
          data-track-action="1" \
          data-track-label="/" \
          data-track-dimension="dimension-value" \
          data-track-dimension-index="29" \
          data-module="track-click" \
          href="/">Home</a>'
    );

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'category',
      '1',
      { label: '/', dimension29: 'dimension-value', transport: 'beacon' }
    );
  });

  it('does not set dimension if dimension is not present', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $('\
      <div \
        data-track-category="category"\
        data-track-action="action"\
        data-track-label="Foo"\
        data-track-dimension-index="29">\
        Bar!\
      </div>\
    ');

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', {label: 'Foo', transport: 'beacon'});
  });

  it('does not set dimension if dimension index is not present', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $('\
      <div \
        data-track-category="category"\
        data-track-action="action"\
        data-track-label="Foo"\
        data-track-dimension="Home">\
        Bar!\
      </div>\
    ');

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', {label: 'Foo', transport: 'beacon'});
  });
});
