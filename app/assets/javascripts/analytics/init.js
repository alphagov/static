(function() {
  "use strict";

  // Load Google Analytics libraries
  GOVUK.Analytics.Tracker.load();

  // Configure profiles, setup custom vars, track initial pageview
  var analytics = new GOVUK.Analytics.Tracker('UA-26179049-7', 'UA-26179049-1');

  // Make interface public for virtual pageviews and events
  GOVUK.analytics = analytics;
})();
