(function() {
  "use strict";

  window.GOVUK           = window.GOVUK || {};
  window.GOVUK.Analytics = window.GOVUK.Analytics || {};

  var CONFIG = {
    '/': [
      ['Heading', 'Services and information'],
      ['Heading', 'More on GOV.UK'],
      ['Percent', 80] //To track 'Services and information' section in footer
    ],
    '/bank-holidays': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/foreign-travel-advice/egypt': [
      ['Heading', 'Summary'],
      ['Heading', 'Terrorism'],
      ['Heading', 'Sharm el Sheikh'],
      ['Heading', 'Hurghada'],
      ['Heading', 'Protests and demonstrations'],
      ['Heading', 'Overseas Business Risk']
    ],
    '/foreign-travel-advice/kenya': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/foreign-travel-advice/spain': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/foreign-travel-advice/syria': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/foreign-travel-advice/thailand': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/foreign-travel-advice/turkey': [
      ['Heading', 'Summary'],
      ['Heading', 'Demonstrations'],
      ['Heading', 'Terrorism'],
      ['Heading', 'Visas'],
      ['Heading', 'Earthquakes'],
      ['Heading', 'Overseas Business Risk'],
      ['Heading', 'Travel insurance']
    ],
    '/jobsearch': [
      ['Heading', 'Registration'],
      ['Heading', 'Help']
    ],
    '/renew-adult-passport': [
      ['Heading', 'Damaged and expired passports'],
      ['Heading', 'Lost or stolen passports'],
      ['Heading', 'Apply for a passport'],
      ['Heading', 'Tracking your passport application']
    ],
    '/student-finance-register-login': [
      ['Heading', 'Log in problems'],
      ['Heading', 'Manage your student finance']
    ],
    '/tax-disc': [
      ['Heading', 'Other ways to apply'],
      ['Heading', 'Help with tax discs']
    ],
    '/government/world': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ]
  };

  function ScrollTracker(sitewideConfig) {
    this.config = this.getConfigForCurrentPath(sitewideConfig);
    this.SCROLL_TIMEOUT_DELAY = 500;

    if ( !this.config ) {
      this.enabled = false;
      return;
    }
    this.enabled = true;

    this.trackedNodes = this.buildNodes(this.config);

    $(window).scroll($.proxy(this.onScroll, this));
    this.trackVisibleNodes();
  };

  ScrollTracker.prototype.getConfigForCurrentPath = function getConfigForCurrentPath(sitewideConfig) {
    for ( var path in sitewideConfig ) {
      if ( window.location.pathname == path ) return sitewideConfig[path];
    }
  };

  ScrollTracker.prototype.buildNodes = function buildNodes(config) {
    var nodes = [];
    var nodeConstructor, nodeData;

    for (var i=0; i<config.length; i++) {
      nodeConstructor = ScrollTracker[config[i][0] + "Node"];
      nodeData = config[i][1];
      nodes.push(new nodeConstructor(nodeData));
    }

    return nodes;
  };

  ScrollTracker.prototype.onScroll = function onScroll() {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout($.proxy(this.trackVisibleNodes, this), this.SCROLL_TIMEOUT_DELAY);
  };

  ScrollTracker.prototype.trackVisibleNodes = function trackVisibleNodes() {
    for ( var i=0; i<this.trackedNodes.length; i++ ) {
      if ( this.trackedNodes[i].isVisible() && !this.trackedNodes[i].alreadySeen ) {
        this.trackedNodes[i].alreadySeen = true;
        GOVUK.sendToAnalytics(["_trackEvent"].concat(this.trackedNodes[i].eventData).concat([0, true]));
        // Last 'true' sets non-interaction flag
        // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#non-interaction
      }
    }
  };



  ScrollTracker.PercentNode = function PercentNode(percentage) {
    this.percentage = percentage;
    this.eventData = ["ScrollTo", "Percent", String(percentage)];
  };

  ScrollTracker.PercentNode.prototype.isVisible = function isVisible() {
    return this.currentScrollPercent() >= this.percentage;
  };

  ScrollTracker.PercentNode.prototype.currentScrollPercent = function currentScrollPercent() {
    var $document = $(document);
    var $window = $(window);
    return( ($window.scrollTop() / ($document.height() - $window.height())) * 100.0 );
  };



  ScrollTracker.HeadingNode = function HeadingNode(headingText) {
    this.$element = getHeadingElement(headingText);
    this.eventData = ["ScrollTo", "Heading", headingText];

    function getHeadingElement(headingText) {
      var $headings = $('h1, h2, h3, h4, h5, h6');
      for ( var i=0; i<$headings.length; i++ ) {
        if ( $.trim($headings.eq(i).text()).replace(/\s/g, ' ') == headingText ) return $headings.eq(i);
      }
    }
  };

  ScrollTracker.HeadingNode.prototype.isVisible = function isVisible() {
    if ( !this.$element ) return false;
    return this.elementIsVisible(this.$element);
  }

  ScrollTracker.HeadingNode.prototype.elementIsVisible = function elementIsVisible($element) {
    var $window = $(window);
    var positionTop = $element.offset().top;
    return ( positionTop > $window.scrollTop() && positionTop < ($window.scrollTop() + $window.height()) );
  };



  $().ready(function() {
    window.GOVUK.Analytics.scrollTracker = new ScrollTracker(CONFIG);
  });

  window.GOVUK.Analytics.ScrollTracker = ScrollTracker;
}());
