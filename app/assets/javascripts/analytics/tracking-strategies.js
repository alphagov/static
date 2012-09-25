var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};

GOVUK.Analytics.successEventSent = false;

GOVUK.Analytics.trackSuccess = function () {
    if (GOVUK.Analytics.successEventSent) return;
    GOVUK.Analytics.successEventSent = true;
    GOVUK.sendToAnalytics(['_trackEvent', 'MS_' + GOVUK.Analytics.Format, GOVUK.Analytics.NeedID, 'Success']);
};

GOVUK.Analytics.handleLinks = function (selector) {
    $(selector).each(function () {
        var linkToTrack = $(this);
        var trackingFunction;
        if (linkToTrack.attr('rel') === 'external') {
            trackingFunction = function () {
                if (GOVUK.Analytics.successEventSent) return;
                GOVUK.Analytics.successEventSent = true;
                var slug = document.URL.split('/')[3];
                var target = linkToTrack.attr('href');
                var exitLink = '/exit?slug=' + slug + '&target=' + target + '&needId=' + GOVUK.Analytics.NeedID;
                linkToTrack.prop('href', exitLink);
            };
        } else {
            trackingFunction = function () {
                if (GOVUK.Analytics.successEventSent) return;
                GOVUK.Analytics.successEventSent = true;
                GOVUK.Analytics.internalSiteEvents.push(['_trackEvent', 'MS_' + GOVUK.Analytics.Format, GOVUK.Analytics.NeedID, 'Success'])
            };
        }
        linkToTrack.click(trackingFunction);
    });
};

GOVUK.Analytics.guideTracking = function () {
    setTimeout(GOVUK.Analytics.trackSuccess, 7000);
    GOVUK.Analytics.handleLinks('#content a');
};

GOVUK.Analytics.transactionTracking = function () {
    GOVUK.Analytics.handleLinks('#content a');
};