var GOVUK = GOVUK || {};

GOVUK.wireTrackingEvents = (function () {
    function trackTaskCompletion(needID, format) {

        var dictionaryOfTrackers = {
            "guide":trackGuideFormatSuccess,
            "transaction":trackTransactionFormatSuccess
        }

        try {
            dictionaryOfTrackers[format](needID);
        } catch (e) {
            /* do nothing */
        }

    }

    function interceptHyperLinkAndFireSuccess(selector, success) {
        $(selector).click(function () {
            onSuccess(success);
            if ($(this).data('events').click === 1) {
                var timeout = GOVUK.Analytics.debugMode ? 1000 : 50;
                setTimeout('document.location = "' + $(this).attr("href") + '"', timeout);
                event.preventDefault();
            }
        });
    };

    function trackFormatEntry(needID, format) {
        GOVUK.sendToAnalytics(['_trackEvent', 'MS_' + format, needID, 'Entry']);
    }

    function trackGuideFormatSuccess() {
        var success = { "success":false };
        setTimeout(function () {
            onSuccess(success);
        }, 7000);
        $(function(){
            interceptHyperLinkAndFireSuccess("#content a",success);
        });
    }

    function trackTransactionFormatSuccess() {
        var success = {"success":false};
        // should this actually be article?
        $(function(){
            interceptHyperLinkAndFireSuccess(".article-container a", success);
        });
    }

    function onSuccess(dict) {
        if (dict.success) {
            return;
        }
        dict.success = true;
        GOVUK.sendToAnalytics(['_trackEvent', 'MS_' + GOVUK.Analytics.Format, GOVUK.Analytics.NeedID, 'Success']);
    }

    function userCameFromThePageWithinTheSameArtefact() {
        var artefactURL = document.URL.split('/').slice(0, 4).join('/');
        return (document.referrer.indexOf(artefactURL) === 0);
    }


    // Track format entry before DOM ready
    if (!userCameFromThePageWithinTheSameArtefact()) {
        trackFormatEntry(GOVUK.Analytics.NeedID, GOVUK.Analytics.Format);
    }

    function wireTrackingEvents() {
        if (!userCameFromThePageWithinTheSameArtefact()) {
            trackTaskCompletion(GOVUK.Analytics.NeedID, GOVUK.Analytics.Format);
        }

    }

    // Track format success on DOM ready
    $(wireTrackingEvents());

    return wireTrackingEvents;
})();
