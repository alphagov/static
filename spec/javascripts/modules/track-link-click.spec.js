describe('Breadcrumb click tracker', function() {
  "use strict";

  var tracker,
      element;

  beforeEach(function() {
    tracker = new GOVUK.Modules.TrackLinkClick();
  });

  it('tracks breadcrumb click events', function() {
    spyOn(GOVUK.analytics, 'setDimension');
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $(
      '<a data-track-category="breadcrumbClicked" \
          data-track-action="1" \
          data-track-label="/" \
          data-track-dimension="Home" \
          data-module="track-breadcrumb-click" \
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
          data-module="track-related-items-click" \
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
});
