(function () {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var Ecommerce = function (config) {
    this.init = function (element) {
      this.forEachEcommerceRow(element, this._sendImpression);
      this.forEachEcommerceRow(element, this._trackProductClick);
    }

    this.forEachEcommerceRow = function (element, fct) {
      var ecommerceRowCss = '[data-ecommerce-row]';
      var ecommerceRows = element.find(ecommerceRowCss);
      var startPosition = parseInt(element.data('ecommerce-start-index'));

      ecommerceRows.each(function(index, ecommerceRow) {
        var $ecommerceRow = $(ecommerceRow);

        var contentId = $ecommerceRow.attr('data-ecommerce-content-id'),
          path = $ecommerceRow.attr('data-ecommerce-path');

        fct($ecommerceRow, contentId, path, index + startPosition);
      });
    }

    this._sendImpression = function (_row, contentId, path, position) {
      // We only send the id to GA as additional product data is linked when it is uploaded.
      // This approach is taken to avoid the GA data packet exceeding the 8k limit
      ga('ec:addImpression', {
        id: contentId || path,
        position: position,
        list: 'Site search results'
      });
    }

    this._trackProductClick = function (row, contentId, path, position) {
      row.click(function(event) {
        ga('ec:addProduct', {
          id: contentId || path,
          position: position
        });

        ga('ec:setAction', 'click', {list: 'Site search results'});
        ga('send', 'event', 'UX', 'click', 'Results');
      })
    }
  }

  Ecommerce.ecLoaded = false;
  Ecommerce.start = function (element) {
    element = element || $('[data-analytics-ecommerce]');

    if(element.length > 0) {
      if(!Ecommerce.ecLoaded) {
        ga('require', 'ec');
        Ecommerce.ecLoaded = true;
      }
      var ecommerce = new Ecommerce();
      ecommerce.init(element);
    }
  }

  window.GOVUK.Ecommerce = Ecommerce;
  window.GOVUK.StaticAnalytics.beforeTrackPage = Ecommerce.start;
})()
