var GOVUK = GOVUK || {};
var _gaq = _gaq || [];

/*
NB: the .js to set up google analytics is currently in a view file
    called _google_analytics.html.erb this interface exists so that
    jasmine.js can spy on something for testing.
 */

GOVUK.sendToAnalytics = function (analyticsData) {
    _gaq.push(analyticsData)
}