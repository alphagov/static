(function() {
  "use strict";

  window.GOVUK           = window.GOVUK || {};

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
    '/jobsearch': [
      ['Heading', 'Registration'],
      ['Heading', 'Help']
    ],
    '/register-to-vote': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/apply-uk-visa': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/student-finance-register-login': [
      ['Heading', 'Log in problems'],
      ['Heading', 'Manage your student finance']
    ],
    '/tax-disc': [
      ['Heading', 'Other ways to apply'],
      ['Heading', 'Help with tax discs']
    ],
    '/aaib-reports': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/business-finance-support-finder/search': [
      ['Percent', 10],
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/using-the-civil-service-jobs-website': [
      ['Heading', 'Your Civil Service Jobs account'],
      ['Heading', 'Job alerts'],
      ['Heading', 'Applying for a job'],
      ['Heading', 'Civil Service Initial Sift Test'],
      ['Heading', 'Results and feedback'],
      ['Heading', 'Civil Service recruitment'],
      ['Heading', 'Technical Support'],
      ['Heading', 'Contact Information']
    ],
    '/government/publications/spending-review-and-autumn-statement-2015-documents/spending-review-and-autumn-statement-2015': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/guidance/universal-credit-how-it-helps-you-into-work': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75],
      ['Heading', 'What is Universal Credit?'],
      ['Heading', 'How Universal Credit works'],
      ['Heading', 'Help with looking for work'],
      ['Heading', 'Help from your work coach'],
      ['Heading', 'Claiming Universal Credit']
      
    ],
    '/guidance/universal-credit-how-it-can-help-your-business': [
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

        var action = this.trackedNodes[i].eventData.action,
            label = this.trackedNodes[i].eventData.label;

        GOVUK.analytics.trackEvent('ScrollTo', action, {label: label, nonInteraction: true});
      }
    }
  };



  ScrollTracker.PercentNode = function PercentNode(percentage) {
    this.percentage = percentage;
    this.eventData = {action: "Percent", label: String(percentage)};
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
    this.eventData = {action: "Heading", label: headingText};

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
    window.GOVUK.scrollTracker = new ScrollTracker(CONFIG);
  });

  window.GOVUK.ScrollTracker = ScrollTracker;
}());
