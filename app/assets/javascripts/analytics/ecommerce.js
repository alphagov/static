// https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce
(function () {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var DEFAULT_LIST_TITLE = 'Site search results';
  var DEFAULT_TRACK_CLICK_LABEL = 'Results';

  var Ecommerce = function (config) {
    this.init = function (element) {
      var listData = parseEcommerceList(element)

      listData.ecommerceRows.each(function(index, ecommerceRow) {
        addImpression(
          ecommerceRow,
          index,
          listData,
        );
        trackProductOnClick(
          ecommerceRow,
          index,
          listData,

        );
      })
    }

    function parseEcommerceList(listElement) {
      return {
        searchQuery: extractSerachQuery(listElement),
        startPosition: parseInt(listElement.data('ecommerce-start-index'), 10),
        listTitle: listElement.data('list-title') || DEFAULT_LIST_TITLE,
        variant: listElement.data('ecommerce-variant'),
        trackClickLabel: listElement.data('track-click-label') || DEFAULT_TRACK_CLICK_LABEL,
        ecommerceRows: parseEcommerceRows(listElement)
      };
    }

    function parseEcommerceRows(listElement) {
      var ecommerceItems = []
      listElement.find('[data-ecommerce-row]').forEach(function(ecommerceRow) {
        ecommerceItems.push({
          rowElement: ecommerceRow,
          contentId: $(ecommerceRow).attr('data-commerce-content-id'),
          path:  $(ecommerceRow).attr('data-commerce-content-id'),
        })
      });
      return ecommerceItems;
    }

    function extractSerachQuery(listElement) {
      if (listElement.attr('data-search-query') !== undefined) {
        // Limiting to 100 characters to avoid noise from extra longs search queries
        // and to stop the size of the payload going over 8k limit and strip Personally Identifying Inforamtion
        // from any serach term
        return GOVUK.analytics.stripPII(listElement.attr('data-search-query')).substring(0, 100).toLowerCase();
      }
    }

    function constructData(contentId, path, position, listTitle, searchQuery, variant) {
      var data = {
        position: position,
        list: listTitle,
        dimension71: searchQuery
      }

      if (contentId !== undefined) {
        data.id = contentId
      }

      if (path !== undefined) {
        data.name = path
      }

      if (variant !== undefined) {
        data.variant = variant
      }

      return data
    }

    function addImpression (ecommerceRow, rowIndex, listData) {
      if (ecommerceRow.contentId || ecommerceRow.path) {
        var impressionData = constructData(
            ecommerceRow.contentId,
            ecommerceRow.path,
            listData.startPosition + rowIndex,
            listData.listTitle,
            listData.searchQuery,
            listData.variant
          )
        ga('ec:addImpression', impressionData);
      }
    }

    function trackProductOnClick (ecommerceRow, rowIndex, listData) {
      $(ecommerceRow.rowElement).click(function() {
        if (ecommerceRow.contentId || ecommerceRow.path) {
          var clickData = constructData(
            ecommerceRow.contentId,
            ecommerceRow.path,
            listData.startPosition + rowIndex,
            listData.listTitle,
            listData.searchQuery,
            listData.variant
          )
          ga('ec:addProduct', clickData);
        }

        ga('ec:setAction', 'click', {list: listData.trackClickLabel});
        GOVUK.analytics.trackEvent('UX', 'click',
          GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions({label: listData.trackClickLabel})
        );
      });
    }
  }

  Ecommerce.ecLoaded = false;
  Ecommerce.start = function (element) {
    if (!window.ga) { return }
    element = element || $('[data-analytics-ecommerce]');
    if(element.length > 0) {
      if(!Ecommerce.ecLoaded) {
        ga('require', 'ec');
        Ecommerce.ecLoaded = true;
      }
      element.each(function(index){
        var ecommerce = new Ecommerce();
        ecommerce.init($(this));
      })
    }
  }

  GOVUK.Ecommerce = Ecommerce;
})()
