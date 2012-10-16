var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};
GOVUK.Analytics.Trackers = {};


/*
 * Available methods on control:
 * - trackTimeBasedSuccess(millisecondsUntilSuccess)
 * - trackLinks(linkSelector)
 * - trackSuccess()
 *
 * Additional methods:
 * Trackers can optionally add functions to override control over whether we fire
 * entry or success events.
 *
 * - shouldTrackEntry() bool
 * - shouldTrackSuccess() bool
 */

/* Guide */
GOVUK.Analytics.Trackers.guide = function (control) {
    control.trackTimeBasedSuccess(7000);
    control.trackInternalLinks("#content a");
};

/* Transaction (services) */
GOVUK.Analytics.Trackers.transaction = function (control) {
    control.trackInternalLinks("#content a");
    control.trackLinks("#get-started a");
};

/* Benefit */
GOVUK.Analytics.Trackers.programme = function (control) {
    control.trackTimeBasedSuccess(7000);
    control.trackInternalLinks("#content a");
};

/* Quick answer */
GOVUK.Analytics.Trackers.answer = function (control) {
    control.trackTimeBasedSuccess(7000);
    control.trackInternalLinks("#content a");
};

/* Smart Answer */
/**
 * The Entry event should only be fired on the first page of the smart answer (the one with the get started button).
 * The Success event should only be fired if the user is coming from the first page and the 'smartanswerOutcome' custom
 *   event has been fired.
 *
 */
GOVUK.Analytics.Trackers.smart_answer = function (control) {
    if (GOVUK.Analytics.Trackers.smart_answer.isAjaxNavigation()) {
        // For AJAX navigation we expect an event on success
        $(document).bind("smartanswerOutcome", control.trackSuccess);
    } else {
        // For multi-page navigation, we need to check if this page has an outcome
        $(function () {
            if ($("article.outcome").length === 1) {
                control.trackSuccess();
            }
        });
    }
};

var browserSupportsHtml5HistoryApi = browserSupportsHtml5HistoryApi || function () {
    return !!(history && history.replaceState && history.pushState);
};

GOVUK.Analytics.Trackers.smart_answer.isAjaxNavigation = browserSupportsHtml5HistoryApi;

GOVUK.Analytics.Trackers.smart_answer.shouldTrackEntry = function () {
    return GOVUK.Analytics.isRootOfArtefact(document.URL);
};

GOVUK.Analytics.Trackers.smart_answer.shouldTrackSuccess = function () {
    if (GOVUK.Analytics.Trackers.smart_answer.isAjaxNavigation()) {
        // For AJAX navigation we should track success on the smart answers flow page (non-root page)
        return GOVUK.Analytics.entryTokens.tokenExists() && !GOVUK.Analytics.isRootOfArtefact(document.URL);
    } else {
        // For multi-page navigation, we should track success if entry event has been fired (token exists)
        return GOVUK.Analytics.entryTokens.tokenExists() && $("article.outcome").length === 1;
    }
};