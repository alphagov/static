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

GOVUK.Analytics.trackingPrefixes = {
    MAINSTREAM: 'MS_',
    INSIDE_GOV: 'IG_'
};

GOVUK.Analytics.Tracker = function (prefix, slugLocation, trackingSpecification) {
    var tracker = trackingSpecification;
    tracker.prefix = prefix;
    tracker.slugLocation = slugLocation;
    return tracker;
};

/* Guide */
GOVUK.Analytics.Trackers.guide = new GOVUK.Analytics.Tracker(
    GOVUK.Analytics.trackingPrefixes.MAINSTREAM,
    0,
    function (trackingApi) {
        trackingApi.trackTimeBasedSuccess(7000);
        trackingApi.trackInternalLinks($("#content a"));
    });

/* Transaction (services) */
GOVUK.Analytics.Trackers.transaction = new GOVUK.Analytics.Tracker(
    GOVUK.Analytics.trackingPrefixes.MAINSTREAM,
    0,
    function (trackingApi) {
        trackingApi.trackInternalLinks($("#content a"));
        trackingApi.trackLinks($("#get-started a"));
    });

/* Benefit */
GOVUK.Analytics.Trackers.programme = new GOVUK.Analytics.Tracker(
    GOVUK.Analytics.trackingPrefixes.MAINSTREAM,
    0,
    function (trackingApi) {
        trackingApi.trackTimeBasedSuccess(7000);
        trackingApi.trackInternalLinks($("#content a"));
    });

/* Quick answer */
GOVUK.Analytics.Trackers.answer = new GOVUK.Analytics.Tracker(
    GOVUK.Analytics.trackingPrefixes.MAINSTREAM,
    0,
    function (trackingApi) {
        trackingApi.trackTimeBasedSuccess(7000);
        trackingApi.trackInternalLinks($("#content a"));
    });

/* Smart Answer */
/**
 * The Entry event should only be fired on the first page of the smart answer (the one with the get started button).
 * The Success event should only be fired if the user is coming from the first page and the 'smartanswerOutcome' custom
 *   event has been fired.
 *
 */
GOVUK.Analytics.Trackers.smart_answer = new GOVUK.Analytics.Tracker(
    GOVUK.Analytics.trackingPrefixes.MAINSTREAM,
    0,
    function (trackingApi) {
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
    });

var browserSupportsHtml5HistoryApi = browserSupportsHtml5HistoryApi || function () {
    return !!(history && history.replaceState && history.pushState);
};

GOVUK.Analytics.Trackers.smart_answer.isAjaxNavigation = browserSupportsHtml5HistoryApi;

GOVUK.Analytics.Trackers.smart_answer.shouldTrackEntry = function () {
    return GOVUK.Analytics.isRootOfArtefact(document.URL, GOVUK.Analytics.Trackers.smart_answer.slugLocation);
};

GOVUK.Analytics.Trackers.smart_answer.shouldTrackSuccess = function () {
    if (GOVUK.Analytics.Trackers.smart_answer.isAjaxNavigation()) {
        // For AJAX navigation we should track success on the smart answers flow page (non-root page)
        return GOVUK.Analytics.entryTokens(GOVUK.Analytics.getSlug(document.URL, GOVUK.Analytics.Trackers.smart_answer.slugLocation)).tokenExists() && !GOVUK.Analytics.isRootOfArtefact(document.URL);
    } else {
        // For multi-page navigation, we should track success if entry event has been fired (token exists)
        return GOVUK.Analytics.entryTokens(GOVUK.Analytics.getSlug(document.URL, GOVUK.Analytics.Trackers.smart_answer.slugLocation)).tokenExists() && $("article.outcome").length === 1;
    }
};


GOVUK.Analytics.Trackers.policy =
    new GOVUK.Analytics.Tracker(
        GOVUK.Analytics.trackingPrefixes.INSIDE_GOV,
        2,
        function (trackingApi) {
            trackingApi.trackTimeBasedSuccess(30000);
            trackingApi.trackInternalLinks($("#page a").filter(function () {
                return !(this.baseURI === document.URL.split('#')[0] && this.hash !== "")
            }));
        }
    );

GOVUK.Analytics.Trackers.detailed_guidance =
    new GOVUK.Analytics.Tracker(
        GOVUK.Analytics.trackingPrefixes.INSIDE_GOV,
        0,
        function (trackingApi) {
            trackingApi.trackTimeBasedSuccess(30000);
            trackingApi.trackInternalLinks($("#page a"));
        });

GOVUK.Analytics.Trackers.news = new GOVUK.Analytics.Tracker(
    GOVUK.Analytics.trackingPrefixes.INSIDE_GOV,
    2,
    function (trackingApi) {
        trackingApi.trackInternalLinks($("#page a"));
        trackingApi.trackTimeBasedSuccess(30000);
    });
