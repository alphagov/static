var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};
GOVUK.Analytics.Trackers = {};

/*
 * Available methods on control:
 * - trackTimeBasedSuccess(millisecondsUntilSuccess)
 * - trackLinks(linkSelector)
 */
GOVUK.Analytics.Trackers.guide = function (control) {
    control.trackTimeBasedSuccess(7000);
    control.trackLinks("#content a");
};

GOVUK.Analytics.Trackers.transaction = function (control) {
    control.trackLinks("#content a");
};

/* Benefit */
GOVUK.Analytics.Trackers.programme = function (control) {
    control.trackTimeBasedSuccess(7000);
    control.trackLinks("#content a");
};

/* Quick answer */
GOVUK.Analytics.Trackers.answer = function (control) {
    control.trackTimeBasedSuccess(7000);
    control.trackLinks("#content a");
};

//GOVUK.Analytics.Trackers.local_transaction = function(control) {
//    control.trackLinks("#get-started a");
//    control.trackLinks("#content a[rel='external']");
//};

GOVUK.Analytics.Trackers.smart_answer = function(control) {
    $(document).bind("smartanswerOutcome", control.trackSuccess);
};
