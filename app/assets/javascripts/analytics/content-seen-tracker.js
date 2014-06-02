(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};
  window.GOVUK.Analytics = window.GOVUK.Analytics || {};

  window.GOVUK.Analytics.ContentSeenTracker = function ContentSeenTracker() {
    var ANALYTICS_CATEGORY      = 'Content',
        ANALYTICS_ACTION        = 'Seen',
        SCROLL_TIMEOUT_DURATION = 500;

    var trackedNodes = this.trackedNodes = [];
    var scrollTimeout;

    init();

    function init() {
      var trackedElements = $('*[data-track-seen]');
      if ( trackedElements.length === 0 ) {
        return;
      }

      for ( var i=0; i<trackedElements.length; i++ ) {
        trackedNodes.push(new TrackedNode(trackedElements[i]));
      }

      $(window).scroll(onScroll);
      trackCurrentlyVisible();
    }

    function onScroll() {
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(trackCurrentlyVisible, SCROLL_TIMEOUT_DURATION);
    }

    function trackCurrentlyVisible() {
      for ( var i=0; i<trackedNodes.length; i++ ) {
        if ( !trackedNodes[i].alreadyTracked && trackedNodes[i].isVisible() ) {
          trackedNodes[i].alreadyTracked = true;
          sendAnalyticsEvent(trackedNodes[i].identifier);
        }
      }
    }

    function sendAnalyticsEvent(node_identifier) {
      GOVUK.sendToAnalytics([
        '_trackEvent',
        ANALYTICS_CATEGORY,
        ANALYTICS_ACTION,
        node_identifier
      ]);
    }

    function TrackedNode(element) {
      var $element    = $(element);
      var positionTop = $element.offset().top;

      this.identifier     = $element.data('track-seen');
      this.alreadyTracked = false

      this.isVisible = function isVisible() {
        var $window = $(window);
        return ( positionTop > $window.scrollTop() && positionTop < ($window.scrollTop() + $window.height()) );
      };
    }
  };

  $().ready(function() {
    window.GOVUK.Analytics.contentSeenTracker = new window.GOVUK.Analytics.ContentSeenTracker();
  });
}());
