var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};

GOVUK.Analytics.startAnalytics = function () {
    var shouldIDoAnalyticsForThisPage = function() {
        if (!GOVUK.Analytics.NeedID) return false;
        var artefactURL = document.URL.split('/').slice(0, 4).join('/');
        // TODO: indexof doesn't work in older browsers.
        return (document.referrer.indexOf(artefactURL) !== 0);
    };

    var trackingStrategies = {
        "guide":GOVUK.Analytics.guideTracking,
        "transaction":GOVUK.Analytics.transactionTracking
    };


    if (shouldIDoAnalyticsForThisPage()) {
        var format = GOVUK.Analytics.Format;
        GOVUK.sendToAnalytics(['_trackEvent', 'MS_' + format, GOVUK.Analytics.NeedID, 'Entry']);
        trackingStrategies[format]();
    }

    GOVUK.Analytics.internalSiteEvents.sendAll();
};

$(GOVUK.Analytics.startAnalytics);