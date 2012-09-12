var GOVUK = GOVUK || {};

GOVUK.wireTrackingEvents = (function() {
    function trackTaskCompletion(needID, format) {

        var dictionaryOfTrackers = {
            "guide":trackGuideFormatSuccess,
            "transaction":trackTransactionFormatSuccess
        }

        dictionaryOfTrackers[format](needID);
    }

    function trackFormatEntry(needID, format)
    {
        GOVUK.sendToAnalytics(['_trackEvent', 'MS_'+format, needID, 'Entry']);
    }

    function trackGuideFormatSuccess(needID)
    {
        var success = { "success": false };
        setTimeout(function() {
            onSuccess(success, needID);
        }, 7000);
        $("#content a").click(function() {
            onSuccess(success, needID);
            try {
                setTimeout('document.location = "' + $(this).attr("href") + '"', 50);
            }catch(err){}
            return false;
        });
    }

    function trackTransactionFormatSuccess(needID) {
        var success = {"success": false};
        // should this actually be article?
        $('.article-container a').click(function () {
            onSuccess(success, needID);
            try {
                setTimeout('document.location ="' + $(this).attr("href") + '"', 50);
            } catch (err) { /* do nothing */}
            return false;
        });
    }

    function onSuccess(dict, needID) {
        if (dict.success) {
            return;
        }
        dict.success = true;
        GOVUK.sendToAnalytics(['_trackEvent', 'MS_' + GOVUK.Analytics.Format, needID, 'Success']);
    }

    function userCameFromThePageWithinTheSameArtefact() {
        var artefactURL = document.URL.split('/').slice(0,4).join('/');
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
