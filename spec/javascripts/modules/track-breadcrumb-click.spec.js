describe('Breadcrumb click tracker', function() {
  "use strict";

  var tracker,
      element;

  beforeEach(function() {
    tracker = new GOVUK.Modules.TrackBreadcrumbClick();
  });

  it('tracks click events', function() {
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
      1,
      { label: '/' }
    );
  });
});
