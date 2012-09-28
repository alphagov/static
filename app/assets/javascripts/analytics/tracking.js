var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};
var _gaq = _gaq || [];

GOVUK.sendToAnalytics = function (analyticsData) {
    _gaq.push(analyticsData);
};

GOVUK.Analytics.isTheSameArtefact = function(currentUrl, previousUrl) {
    var currentSlug = currentUrl.split('/').slice(0, 4).join('/').replace(/#.*$/, '');
    var previousSlug = previousUrl.split('/').slice(0, 4).join('/').replace(/#.*$/, '');
    return currentSlug === previousSlug;
};

GOVUK.Analytics.startAnalytics = function () {

    var ENTER_KEYCODE = 13;
    var success = false;

    var shouldIDoAnalyticsForThisPage = function () {
        if (!GOVUK.Analytics.NeedID) return false;
        return !GOVUK.Analytics.isTheSameArtefact(document.URL, document.referrer);
    };


    var createEvent = function(type) {
        return ['_trackEvent', 'MS_' + GOVUK.Analytics.Format, GOVUK.Analytics.NeedID, type];
    };

    var handleExternalLink = function() {
        if (success) return;
        success = true;
        var slug = encodeURIComponent(document.URL.split('/')[3]);
        var target = encodeURIComponent($(this).attr('href'));
        var exitLink = '/exit?slug=' + slug + '&target=' + target + '&needId=' + GOVUK.Analytics.NeedID;
        $(this).prop('href', exitLink);
    };

    var handleInternalLink = function () {
        if (success) return;
        success = true;
        if (this.baseURI === document.URL.split("#")[0]) {
            GOVUK.sendToAnalytics(createEvent("Success"));
        } else {
            GOVUK.Analytics.internalSiteEvents.push(createEvent("Success"));
        }
    };

    var trackingApi = {
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
                   if (event.which === ENTER_KEYCODE) {
                       trackingFunction.call(this);
                   }
                });
            });
        },
        trackTimeBasedSuccess:function (time) {
            setTimeout(trackingApi.trackSuccess, time);
        }
    };

    var format = GOVUK.Analytics.Format;
    var trackingStrategies = GOVUK.Analytics.Trackers;
    if (shouldIDoAnalyticsForThisPage() && trackingStrategies[format]) {
        GOVUK.sendToAnalytics(createEvent("Entry"));
        trackingStrategies[format](trackingApi);
    }

    GOVUK.Analytics.internalSiteEvents.sendAll();

    return trackingApi;
};

$(GOVUK.Analytics.startAnalytics);