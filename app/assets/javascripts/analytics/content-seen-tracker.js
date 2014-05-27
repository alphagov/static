(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};
  window.GOVUK.Analytics = window.GOVUK.Analytics || {};

  window.GOVUK.Analytics.contentSeenTracker = {
    ANALYTICS_CATEGORY: 'Content',
    ANALYTICS_ACTION: 'Seen',
    SCROLL_TIMEOUT: 500,

    trackedNodes: [],

    init: function init() {
      var trackedElements = $('*[data-track-seen]');
      if ( trackedElements.length === 0 ) {
        return;
      }
      for ( var i=0; i<trackedElements.length; i++ ) {
        this.trackedNodes.push(new this.TrackedNode(trackedElements[i]));
      }

      $(window).scroll($.proxy(this.onScroll, this));
      this.trackCurrentlyVisible();
    },

    onScroll: function onScroll() {
      window.clearTimeout(this.scrollTimeout);
      this.scrollTimeout = window.setTimeout($.proxy(this.trackCurrentlyVisible, this), this.SCROLL_TIMEOUT);
    },

    trackCurrentlyVisible: function trackCurrentlyVisible() {
      for ( var i=0; i<this.trackedNodes.length; i++ ) {
        if ( !this.trackedNodes[i].alreadyTracked && this.trackedNodes[i].isVisible() ) {
          this.trackedNodes[i].alreadyTracked = true;
          this.sendAnalyticsEvent(this.trackedNodes[i].identifier);
        }
      }
    },

    sendAnalyticsEvent: function sendAnalyticsEvent(node_identifier) {
      GOVUK.sendToAnalytics([
        '_trackEvent',
        window.GOVUK.Analytics.contentSeenTracker.ANALYTICS_CATEGORY,
        window.GOVUK.Analytics.contentSeenTracker.ANALYTICS_ACTION,
        node_identifier
      ]);
    },

    TrackedNode: function TrackedNode(element) {
      var self = this;
      this.element        = $(element);
      this.identifier     = this.element.data('track-seen');
      this.positionTop    = this.element.offset().top;
      this.alreadyTracked = false

      this.isVisible = function isVisible() {
        var $window = $(window);
        return ( self.positionTop > $window.scrollTop() && self.positionTop < ($window.scrollTop() + $window.height()) );
      };
    }
  };

  $().ready($.proxy(window.GOVUK.Analytics.contentSeenTracker.init, window.GOVUK.Analytics.contentSeenTracker));
}());
