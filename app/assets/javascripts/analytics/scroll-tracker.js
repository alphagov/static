(function() {
  "use strict";

  window.GOVUK = window.GOVUK || {};

  var CONFIG = {
    '/contact-the-dvla/y/driving-licences-and-applications': [
      ['Heading', 'Driving licencing enquiries'],
      ['Heading', 'When to contact DVLA']
    ],
    '/contact-the-dvla/y/vehicle-tax-and-sorn': [
      ['Heading', 'Vehicle tax enquiries'],
      ['Heading', 'When to contact DVLA']
    ],
    '/contact-the-dvla/y/vehicle-registration-and-v5c-certificates-log-books': [
      ['Heading', 'Vehicle registration enquiries'],
      ['Heading', 'When to contact DVLA']
    ],
    '/government/collections/disability-confident-campaign': [
      ['Heading', 'Become a Disability Confident employer'],
      ['Heading', 'Aims and objectives'],
      ['Heading', 'Inclusive communication']  
    ],
    '/government/publications/the-essential-trustee-what-you-need-to-know-cc3/the-essential-trustee-what-you-need-to-know-what-you-need-to-do': [
      ['Heading', '1. About this guidance'],
      ['Heading', '2. Trustees’ duties at a glance'],
      ['Heading', '3. Who can be a trustee and how trustees are appointed'],
      ['Heading', '4. Ensure your charity is carrying out its purposes for the public benefit'],
      ['Heading', '5. Comply with your charity’s governing document and the law'],
      ['Heading', '6. Act in your charity’s best interests'],
      ['Heading', '7. Manage your charity’s resources responsibly'],
      ['Heading', '8. Act with reasonable care and skill'],
      ['Heading', '9. Ensure your charity is accountable'],
      ['Heading', '10. Reduce the risk of liability'],
      ['Heading', '11. Your charity’s legal structure and what it means'],
      ['Heading', '12. Charity officers - the chair and treasurer'],
      ['Heading', '13. Technical terms used in this guidance']
    ]
  };

  function ScrollTracker(sitewideConfig) {
    this.config = this.getConfigForCurrentPath(sitewideConfig);
    this.SCROLL_TIMEOUT_DELAY = 10;

    if ( !this.config ) {
      this.enabled = false;
      return;
    }
    this.enabled = true;

    this.trackedNodes = this.buildNodes(this.config);

    $(window).scroll($.proxy(this.onScroll, this));
    this.trackVisibleNodes();
  };

  ScrollTracker.prototype.getConfigForCurrentPath = function (sitewideConfig) {
    for ( var path in sitewideConfig ) {
      if (this.normalisePath(window.location.pathname) == this.normalisePath(path)) {
        return sitewideConfig[path];
      }
    }
  };

  ScrollTracker.prototype.buildNodes = function (config) {
    var nodes = [];
    var nodeConstructor, nodeData;

    for (var i=0; i<config.length; i++) {
      nodeConstructor = ScrollTracker[config[i][0] + "Node"];
      nodeData = config[i][1];
      nodes.push(new nodeConstructor(nodeData));
    }

    return nodes;
  };

  ScrollTracker.prototype.normalisePath = function (path){
    return path.split("/").join("");
  };

  ScrollTracker.prototype.onScroll = function () {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout($.proxy(this.trackVisibleNodes, this), this.SCROLL_TIMEOUT_DELAY);
  };

  ScrollTracker.prototype.trackVisibleNodes = function () {
    for ( var i=0; i<this.trackedNodes.length; i++ ) {
      if ( this.trackedNodes[i].isVisible() && !this.trackedNodes[i].alreadySeen ) {
        this.trackedNodes[i].alreadySeen = true;

        var action = this.trackedNodes[i].eventData.action,
            label = this.trackedNodes[i].eventData.label;

        GOVUK.analytics.trackEvent('ScrollTo', action, {label: label, nonInteraction: true});
      }
    }
  };

  ScrollTracker.HeadingNode = function (headingText) {
    this.$element = getHeadingElement(headingText);
    this.eventData = {action: "Heading", label: headingText};

    function getHeadingElement(headingText) {
      var $headings = $('h1, h2, h3, h4, h5, h6');
      for ( var i=0; i<$headings.length; i++ ) {
        if ( $.trim($headings.eq(i).text()).replace(/\s/g, ' ') == headingText ) return $headings.eq(i);
      }
    }
  };

  ScrollTracker.HeadingNode.prototype.isVisible = function () {
    if ( !this.$element ) return false;
    return this.elementIsVisible(this.$element);
  }

  ScrollTracker.HeadingNode.prototype.elementIsVisible = function ($element) {
    var $window = $(window);
    var positionTop = $element.offset().top;
    return ( positionTop > $window.scrollTop() && positionTop < ($window.scrollTop() + $window.height()) );
  };

  $().ready(function() {
    window.GOVUK.scrollTracker = new ScrollTracker(CONFIG);
  });

  window.GOVUK.ScrollTracker = ScrollTracker;
}());
