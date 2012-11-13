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
GOVUK.Analytics.Trackers.guide = function (trackingApi) {
    trackingApi.trackTimeBasedSuccess(7000);
    trackingApi.trackInternalLinks($("#content a"));
};

/* Transaction (services) */
GOVUK.Analytics.Trackers.transaction = function (trackingApi) {
    trackingApi.trackInternalLinks($("#content a"));
    trackingApi.trackLinks($("#get-started a"));
};

/* Benefit */
GOVUK.Analytics.Trackers.programme = function (trackingApi) {
    trackingApi.trackTimeBasedSuccess(7000);
    trackingApi.trackInternalLinks($("#content a"));
};

/* Quick answer */
GOVUK.Analytics.Trackers.answer = function (trackingApi) {
    trackingApi.trackTimeBasedSuccess(7000);
    trackingApi.trackInternalLinks($("#content a"));
};

/* Smart Answer */
/**
 * The Entry event should only be fired on the first page of the smart answer (the one with the get started button).
 * The Success event should only be fired if the user is coming from the first page and the 'smartanswerOutcome' custom
 *   event has been fired.
 *
 */
GOVUK.Analytics.Trackers.smart_answer = function (trackingApi) {
    if (GOVUK.Analytics.Trackers.smart_answer.isAjaxNavigation()) {
        // For AJAX navigation we expect an event on success
        $(document).bind("smartanswerOutcome", trackingApi.trackSuccess);
    } else {
        // For multi-page navigation, we need to check if this page has an outcome
        $(function () {
            if ($("article.outcome").length === 1) {
                trackingApi.trackSuccess();
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

GOVUK.Analytics.Trackers.policy = function(trackingApi) {
    trackingApi.trackTimeBasedSuccess(30000);
    trackingApi.trackInternalLinks($("#page a").filter(function () {
        return !(this.baseURI === document.URL.split('#')[0] && this.hash !== "")
    }));
};

GOVUK.Analytics.Trackers.detailed_guidance = function(trackingApi) {
    trackingApi.trackTimeBasedSuccess(30000);
    trackingApi.trackInternalLinks($("#page a"));
};

GOVUK.Analytics.Trackers.news = function(trackingApi) {
    trackingApi.trackInternalLinks($("#page a"));
    trackingApi.trackTimeBasedSuccess(30000);
};

GOVUK.Analytics.trackingPrefixes = {
    MAINSTREAM: 'MS_',
    INSIDE_GOV: 'IG_'
};

GOVUK.Analytics.Trackers.news.prefix = GOVUK.Analytics.trackingPrefixes.INSIDE_GOV;
GOVUK.Analytics.Trackers.detailed_guidance.prefix = GOVUK.Analytics.trackingPrefixes.INSIDE_GOV;
GOVUK.Analytics.Trackers.policy.prefix = GOVUK.Analytics.trackingPrefixes.INSIDE_GOV;

GOVUK.Analytics.Trackers.smart_answer.prefix = GOVUK.Analytics.trackingPrefixes.MAINSTREAM;
GOVUK.Analytics.Trackers.guide.prefix = GOVUK.Analytics.trackingPrefixes.MAINSTREAM;
GOVUK.Analytics.Trackers.programme.prefix = GOVUK.Analytics.trackingPrefixes.MAINSTREAM;
GOVUK.Analytics.Trackers.transaction.prefix = GOVUK.Analytics.trackingPrefixes.MAINSTREAM;
GOVUK.Analytics.Trackers.answer.prefix = GOVUK.Analytics.trackingPrefixes.MAINSTREAM;