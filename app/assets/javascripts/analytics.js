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

    var successful = false;

    function cacheEvent(event) {
        var newEvent = {};
        var target = event.target;
        var shouldOpenInNewWindow = event.originalEvent.metaKey || event.originalEvent.ctrlKey;

        if (event.originalEvent.initMouseEvent) {
            newEvent = document.createEvent('MouseEvents');
            newEvent.initMouseEvent(
                event.originalEvent.type,
                event.originalEvent.bubbles,
                event.originalEvent.cancelable,
                event.originalEvent.view,
                event.originalEvent.detail,
                event.originalEvent.screenX,
                event.originalEvent.screenY,
                event.originalEvent.clientX,
                event.originalEvent.clientY,
                event.originalEvent.ctrlKey,
                event.originalEvent.altKey,
                event.originalEvent.shiftKey,
                event.originalEvent.metaKey,
                event.originalEvent.button,
                event.originalEvent.relatedTarget);
        }

        return {fire:function () {
            if (event.originalEvent.initMouseEvent) {
                target.dispatchEvent(newEvent);
            } else {
                if (shouldOpenInNewWindow) {
                    $(target).attr('target', '_blank');
                }
                target.click();
            }
        }
        };
    }

    function interceptHyperLinkAndFireSuccess(selector, success) {
        $(selector).click(function (event) {
            onSuccess(success);
            if (!successful) {
                successful = true;
                var cachedEvent = cacheEvent(event);
                event.stopImmediatePropagation();
                event.preventDefault();
                var delay = GOVUK.Analytics.debugMode ? 1000 : 50;
                setTimeout(function () {
                    cachedEvent.fire();
                }, delay);
            }
        });
    }

    function trackFormatEntry(needID, format) {
        GOVUK.sendToAnalytics(['_trackEvent', 'MS_' + format, needID, 'Entry']);
    }

    function trackGuideFormatSuccess() {
        var success = { "success":false };
        setTimeout(function () {
            onSuccess(success);
        }, 7000);
        $(function () {
            interceptHyperLinkAndFireSuccess("#content a", success);
        });
    }

    function trackTransactionFormatSuccess() {
        var success = {"success":false};
        // should this actually be article?
        $(function () {
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
