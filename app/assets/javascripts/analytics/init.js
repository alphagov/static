(function() {
  "use strict";

  // Load Google Analytics libraries
  GOVUK.StaticAnalytics.load();

  // Use document.domain in dev, preview and staging so that tracking works
  // Otherwise explicitly set the domain as www.gov.uk (and not gov.uk).
  var cookieDomain = (document.domain == 'www.gov.uk') ? '.www.gov.uk' : document.domain;

  var universalId = 'UA-26179049-1'

  // Configure profiles, setup custom vars, track initial pageview
  var analytics = new GOVUK.StaticAnalytics({
    universalId: universalId,
    cookieDomain: cookieDomain
  });

  // Make interface public for virtual pageviews and events

  GOVUK.analytics = analytics;

  // Enable cross domain tracking to campaign site

  GOVUK.analytics.addLinkedTrackerDomain(universalId, "PlanForBritainCampaign", "planforbritain.gov.uk")
})();
