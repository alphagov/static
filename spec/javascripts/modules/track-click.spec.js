describe('A click tracker', function() {
  "use strict";

  var tracker,
      element;

  beforeEach(function() {
    tracker = new GOVUK.Modules.TrackClick();
  });

  it('tracks click events', function() {
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

  it('tracks breadcrumb click events', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $(
      '<a data-track-category="breadcrumbClicked" \
          data-track-action="1" \
          data-track-label="/" \
          data-track-dimension="Home" \
          data-track-dimension-index="29" \
          data-module="track-click" \
          href="/">Home</a>'
    );

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'breadcrumbClicked',
      '1',
      { label: '/', dimension29: 'Home', transport: 'beacon' }
    );
  });

  it('tracks related item click events', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $(
      '<a data-track-category="relatedLinkClicked" \
          data-track-action="1.1" \
          data-track-label="/item" \
          data-track-dimension="Related" \
          data-track-dimension-index="29" \
          data-module="track-click" \
          href="/">Related</a>'
    );

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'relatedLinkClicked',
      '1.1',
      { label: '/item', dimension29: 'Related', transport: 'beacon' }
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
