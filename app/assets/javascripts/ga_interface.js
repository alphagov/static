var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};
var _gaq = _gaq || [];

GOVUK.Analytics.debugMode = false;

GOVUK.Analytics.debugMode = window.location.href.match(/[\?&]google-analytics-debug([&#]|$)/);

var initializeAnalyticsDebug = function() {
    $("#debug-google-analytics").removeClass('hidden');
};

if (GOVUK.Analytics.debugMode) {
    $(initializeAnalyticsDebug);
}

/*
NB: the .js to set up google analytics is currently in a view file
    called _google_analytics.html.erb this interface exists so that
    jasmine.js can spy on something for testing.
 */

GOVUK.sendToAnalytics = function (analyticsData) {
    _gaq.push(analyticsData);
    if (GOVUK.Analytics.debugMode) {
        $(function () {
            var li = $("<li/>").text(JSON.stringify(analyticsData));
            $("#debug-google-analytics ol").append(li);
        });
    }
};