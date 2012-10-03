var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};
GOVUK.Analytics.Trackers = {};


/*
 * Available methods on control:
 * - trackTimeBasedSuccess(millisecondsUntilSuccess)
 * - trackLinks(linkSelector)
 * - trackSuccess()
 */

/* Guide */
GOVUK.Analytics.Trackers.guide = function (control) {
    control.trackTimeBasedSuccess(7000);
    control.trackLinks("#content a");
};

/* Transaction (services) */
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

/* Smart Answer */
/**
 * The Entry event should only be fired on the first page of the smart answer (the one with the get started button).
 * The Success event should only be fired if the user is coming from the first page and the 'smartanswerOutcome' custom
 *   event has been fired.
 *
 */
GOVUK.Analytics.Trackers.smart_answer = function (control) {
    $(document).bind("smartanswerOutcome", control.trackSuccess);
};

GOVUK.Analytics.Trackers.smart_answer.shouldTrackEntry = function() {
    return GOVUK.Analytics.isRootOfArtefact(document.URL);
};

GOVUK.Analytics.Trackers.smart_answer.shouldTrackSuccess = function () {
    return GOVUK.Analytics.isTheSameArtefact(document.URL, document.referrer);
};