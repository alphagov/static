var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};
GOVUK.Analytics.Trackers = {};

GOVUK.Analytics.shouldITrackEntryForThisPage = function (format) {
    var userCameFromBaseSmartAnswerPage = function () {
      return document.referrer !== "" && document.URL.indexOf(document.referrer) !== -1;
    };

    var userRestartedSmartAnswerFlow = function () {
      return document.referrer !== "" && document.referrer.indexOf(document.URL) !== -1;
    };

    if (format === "smart_answer") {
      return !userCameFromBaseSmartAnswerPage() && !userRestartedSmartAnswerFlow();
    }
    return !GOVUK.Analytics.isTheSameArtefact(document.URL, document.referrer);
};

GOVUK.Analytics.shouldITrackSuccessForThisPage = function (format) {
    return !GOVUK.Analytics.isTheSameArtefact(document.URL, document.referrer);
};


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
GOVUK.Analytics.Trackers.smart_answer = function(control) {
    $(document).bind("smartanswerOutcome", control.trackSuccess);
};
