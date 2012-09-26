var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};

/*
 *
 */
GOVUK.Analytics.guideTracking = function (control) {
    control.trackTimeBasedSuccess(7000);
    control.trackLinks("#content a");
};

GOVUK.Analytics.transactionTracking = function (control) {
    control.trackLinks("#content a");
};