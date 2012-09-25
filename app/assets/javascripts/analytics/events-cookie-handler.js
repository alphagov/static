var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};

GOVUK.Analytics.internalSiteEvents = function() {

    var eventQueue = [];

    var loadCookie = function() {
        var value = Alphagov.read_cookie("successEvents");
        if (value) {
            value = jQuery.parseJSON(jQuery.base64Decode(value));
        } else {
            value = [];
        }
        eventQueue = value;
    };

    var sendCookieEvents = function() {
        loadCookie();
        $(eventQueue).each(function() {
            GOVUK.sendToAnalytics(this);
        });
        eventQueue = [];
        saveCookie();
    };

    var saveCookie = function() {
        if (eventQueue.length > 0) {
            Alphagov.write_cookie("successEvents", $.base64Encode(JSON.stringify(eventQueue)));
        } else {
            Alphagov.delete_cookie("successEvents");
        }
    };

    var pushCookieEvent = function(event) {
        eventQueue.push(event);
        saveCookie();
    };

    return {
        push: pushCookieEvent,
        sendAll: sendCookieEvents
    };
}();