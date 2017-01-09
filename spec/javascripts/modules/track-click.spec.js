describe('A click tracker', function() {
  "use strict";

  var tracker,
      element;

  beforeEach(function() {
    tracker = new GOVUK.Modules.TrackClick();
  });

  it('tracks click events', function() {
    spyOn(GOVUK.analytics, 'setDimension');
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

    expect(GOVUK.analytics.setDimension).not.toHaveBeenCalled();
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', {label: 'Foo'});
  });

  it('tracks breadcrumb click events', function() {
    spyOn(GOVUK.analytics, 'setDimension');
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $(
      '<a data-track-category="breadcrumbClicked" \
          data-track-action="1" \
          data-track-label="/" \
          data-track-dimension="Home" \
          data-track-custom-dimension="29" \
          data-module="track-click" \
          href="/">Home</a>'
    );

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.setDimension).toHaveBeenCalledWith(29, 'Home');
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'breadcrumbClicked',
      '1',
      { label: '/' }
    );
  });

  it('tracks related item click events', function() {
    spyOn(GOVUK.analytics, 'setDimension');
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $(
      '<a data-track-category="relatedLinkClicked" \
          data-track-action="1.1" \
          data-track-label="/item" \
          data-track-dimension="Related" \
          data-track-custom-dimension="29" \
          data-module="track-click" \
          href="/">Related</a>'
    );

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.setDimension).toHaveBeenCalledWith(29, 'Related');
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'relatedLinkClicked',
      '1.1',
      { label: '/item' }
    );
  });

  it('does not set dimension if dimension is not present', function() {
    spyOn(GOVUK.analytics, 'setDimension');
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $('\
      <div \
        data-track-category="category"\
        data-track-action="action"\
        data-track-label="Foo"\
        data-track-custom-dimension="29">\
        Bar!\
      </div>\
    ');

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.setDimension).not.toHaveBeenCalled();
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', {label: 'Foo'});
  });

  it('does not set dimension if custom dimension is not present', function() {
    spyOn(GOVUK.analytics, 'setDimension');
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

    expect(GOVUK.analytics.setDimension).not.toHaveBeenCalled();
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', {label: 'Foo'});
  });
});
