(function () {
  "use strict";
  window.GOVUK = window.GOVUK || {};
  var CustomDimensions = function () { }

  CustomDimensions.getAndExtendDefaultTrackingOptions = function (extraOptions) {
    var trackingOptions = this.customDimensions();
    return $.extend(trackingOptions, extraOptions);
  };

  CustomDimensions.customDimensions = function () {
    var dimensions = $.extend(
      {},
      customDimensionsFromBrowser(),
      customDimensionsFromMetaTags(),
      customDimensionsFromDom(),
      abTestCustomDimensions()
    );

    return $.each(dimensions, function (key, value) {
      dimensions[key] = String(value);
    });
  };

  function customDimensionsFromBrowser() {
    var customDimensions = {
      dimension15: window.httpStatusCode || 200,
      dimension16: GOVUK.cookie('TLSversion') || 'unknown'
    };

    if (window.devicePixelRatio) {
      customDimensions.dimension11 = window.devicePixelRatio;
    }

    return customDimensions;
  }

  function customDimensionsFromMetaTags() {
    var dimensionMappings = {
      'section': {dimension: 1},
      'format': {dimension: 2},
      'themes': {dimension: 3, defaultValue: 'other'},
      'content-id': {dimension: 4, defaultValue: '00000000-0000-0000-0000-000000000000'},
      'search-result-count': {dimension: 5},
      'publishing-government': {dimension: 6},
      'political-status': {dimension: 7},
      'analytics:organisations': {dimension: 9},
      'analytics:world-locations': {dimension: 10},
      'schema-name': {dimension: 17},
      'rendering-application': {dimension: 20},
      'navigation-page-type': {dimension: 32, defaultValue: 'none'},
      'user-journey-stage': {dimension: 33, defaultValue: 'thing'},
      'navigation-document-type': {dimension: 34, defaultValue: 'other'},
      'taxon-slug': {dimension: 56, defaultValue: 'other'},
      'taxon-id': {dimension: 57, defaultValue: 'other'},
      'taxon-slugs': {dimension: 58, defaultValue: 'other'},
      'taxon-ids': {dimension: 59, defaultValue: 'other'},
      'content-has-history': {dimension: 39, defaultValue: 'false'}
    };

    var $metas = $('meta[name^="govuk:"]');
    var customDimensions = {};
    var tags = {};

    $metas.each(function () {
      var $meta = $(this);
      var key = $meta.attr('name').split('govuk:')[1];

      var dimension = dimensionMappings[key];
      if (dimension) {
        tags[key] = $meta.attr('content');
      }
    });

    $.each(dimensionMappings, function (key, dimension) {
      var value = tags[key] || dimension.defaultValue;
      if (typeof value !== 'undefined') {
        customDimensions['dimension' + dimension.dimension] = value;
      }
    });

    return customDimensions;
  }

  function customDimensionsFromDom() {
    return {
      dimension26: totalNumberOfSections(),
      dimension27: totalNumberOfSectionLinks()
    };

    function totalNumberOfSections() {
      var sidebarSections = $('[data-track-count="sidebarRelatedItemSection"]').length;
      var sidebarTaxons = $('[data-track-count="sidebarTaxonSection"]').length;
      var accordionSubsections = $('[data-track-count="accordionSection"]').length;
      var gridSections = $('a[data-track-category="navGridLinkClicked"]').length;
      var browsePageSections = $('#subsection ul:visible').length ||
        $('#section ul').length;
      var topicPageSections = $('.topics-page nav.index-list').length
      var documentCollectionSections = $('.document-collection .group-title').length;
      var policyAreaSections = $('.topic section h1.label').length;

      var sectionCount =
        sidebarSections ||
        sidebarTaxons ||
        accordionSubsections ||
        gridSections ||
        browsePageSections ||
        topicPageSections ||
        documentCollectionSections ||
        policyAreaSections;

      return sectionCount;
    }

    function totalNumberOfSectionLinks() {
      var relatedLinks = $('a[data-track-category="relatedLinkClicked"]').length;
      var accordionLinks = $('a[data-track-category="navAccordionLinkClicked"]').length;
      // Grid links are counted both as "sections" (see dimension 26), and as part of the total link count
      var gridLinks = $('a[data-track-category="navGridLinkClicked"]').length
        + $('a[data-track-category="navGridLeafLinkClicked"]').length;
      var leafLinks = $('a[data-track-category="navLeafLinkClicked"]').length;
      var browsePageLinks = $('#subsection ul a:visible').length ||
        $('#section ul a').length;
      var topicPageLinks = $('.topics-page ul a').length;
      var policyAreaLinks =
        $('section.document-block a').length +
        $('section .collection-list h2 a').length

      var linksCount =
        relatedLinks ||
        accordionLinks ||
        gridLinks ||
        leafLinks ||
        browsePageLinks ||
        topicPageLinks ||
        policyAreaLinks;

      return linksCount;
    }
  }

  function abTestCustomDimensions() {
    var $abMetas = $('meta[name^="govuk:ab-test"]');
    var customDimensions = {};

    $abMetas.each(function () {
      var $meta = $(this);
      var dimension = parseInt($meta.data('analytics-dimension'));
      var testNameAndBucket = $meta.attr('content');

      if(dimension) {
        customDimensions['dimension' + dimension] = testNameAndBucket;
      }
    });

    return customDimensions;
  }

  GOVUK.CustomDimensions = CustomDimensions;
})();
