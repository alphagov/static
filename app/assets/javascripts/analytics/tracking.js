var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};
var _gaq = _gaq || [];

GOVUK.sendToAnalytics = function (analyticsData) {
    _gaq.push(analyticsData);
};

GOVUK.Analytics.isTheSameArtefact = function(currentUrl, previousUrl) {
    var rootOfArtefact = function(url) {
        return url.split("/").slice(0, 4).join("/");
    };

    var currentSlug = rootOfArtefact(currentUrl).replace(/#.*$/, '');
    var previousSlug = rootOfArtefact(previousUrl).replace(/#.*$/, '');
    return currentSlug === previousSlug;
};

GOVUK.Analytics.isRootOfArtefact = function(url) {
    return url.replace(/\/$/, "").split("/").slice(3).length === 1;
};

GOVUK.Analytics.startAnalytics = function () {
    var ENTER_KEYCODE = 13;
    var success = false;

    var shouldIDoAnalyticsForThisPage = function () {
        return GOVUK.Analytics.NeedID;
    };

    /**
     * Decide whether we should track an event based on a condition function.
     * If the condition function isn't defined then the default condition is used.
     *
     * @param condition, an optional function that returns a boolean
     * @return bool
     */
    var shouldTrackEvent = function(condition, defaultValue) {
        if (condition) {
            return condition();
        } else {
            return defaultValue;
        }
    }

    var createEvent = function(type) {
        return ['_trackEvent', 'MS_' + GOVUK.Analytics.Format, GOVUK.Analytics.NeedID, type];
    };

    var handleExternalLink = function() {
        if (success) return;
        success = true;
        var slug = encodeURIComponent(document.URL.split('/')[3].split("#")[0]);
        var target = encodeURIComponent($(this).attr('href'));
        var exitLink = '/exit?slug=' + slug + '&target=' + target + '&need_id=' + GOVUK.Analytics.NeedID + '&format=' + GOVUK.Analytics.Format;
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
    var trackingStrategy = GOVUK.Analytics.Trackers[format];
    if (shouldIDoAnalyticsForThisPage() && trackingStrategy) {
      var isTheSameArtefact = GOVUK.Analytics.isTheSameArtefact(document.URL, document.referrer);
      if (shouldTrackEvent(trackingStrategy.shouldTrackEntry, !isTheSameArtefact)) {
          GOVUK.sendToAnalytics(createEvent("Entry"));
      }
      if (shouldTrackEvent(trackingStrategy.shouldTrackSuccess, !isTheSameArtefact)) {
          trackingStrategy(trackingApi);
      }
    }

    GOVUK.Analytics.internalSiteEvents.sendAll();

    return trackingApi;
};

$(GOVUK.Analytics.startAnalytics);
