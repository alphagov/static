var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};

GOVUK.Analytics.isTheSameArtefact = function(currentUrl, previousUrl) {
    var currentSlug = currentUrl.split('/').slice(0, 4).join('/').replace(/#.*$/, '');
    var previousSlug = previousUrl.split('/').slice(0, 4).join('/').replace(/#.*$/, '');
    return currentSlug === previousSlug;
};

GOVUK.Analytics.startAnalytics = function () {
    var shouldIDoAnalyticsForThisPage = function () {
        if (!GOVUK.Analytics.NeedID) return false;
        return !GOVUK.Analytics.isTheSameArtefact(document.URL, document.referrer);
    };

    var success = false;

    var createEvent = function(type) {
        return ['_trackEvent', 'MS_' + GOVUK.Analytics.Format, GOVUK.Analytics.NeedID, type];
    };

    var handleExternalLink = function() {
        if (success) return;
        success = true;
        var slug = document.URL.split('/')[3];
        var target = $(this).attr('href');
        var exitLink = '/exit?slug=' + slug + '&target=' + target + '&needId=' + GOVUK.Analytics.NeedID;
        $(this).prop('href', exitLink);
    };

    var handleInternalLink = function () {
        if (success) return;
        success = true;
        GOVUK.Analytics.internalSiteEvents.push(createEvent("Success"));
    };

    var enterKey = 13;

    var control = {
        trackSuccess: function () {
            if (success) return;
            success = true;
            GOVUK.sendToAnalytics(createEvent("Success"));
        },
        trackLinks:function (selector) {
            $(selector).each(function () {
                var linkToTrack = $(this);
                var trackingFunction;
                if (linkToTrack.attr('rel') === 'external') {
                    trackingFunction = handleExternalLink;
                } else {
                    trackingFunction = handleInternalLink;
                }
                linkToTrack.click(trackingFunction);
                linkToTrack.keypress(function(event) {
                   if (event.which == enterKey) {
                       trackingFunction.call(this);
                   }
                });
            });
        },
        trackTimeBasedSuccess:function (time) {
            setTimeout(control.trackSuccess, time);
        }
    };

    var format = GOVUK.Analytics.Format;
    var trackingStrategies = GOVUK.Analytics.Trackers;
    if (shouldIDoAnalyticsForThisPage() && trackingStrategies[format]) {
        GOVUK.sendToAnalytics(createEvent("Entry"));
        trackingStrategies[format](control);
    }

    GOVUK.Analytics.internalSiteEvents.sendAll();

    return control;
};

$(GOVUK.Analytics.startAnalytics);