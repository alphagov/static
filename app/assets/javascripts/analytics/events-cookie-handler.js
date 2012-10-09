var GOVUK = GOVUK || {};
GOVUK.Analytics = GOVUK.Analytics || {};

GOVUK.Analytics.internalSiteEvents = function () {

    var eventQueue = [];

    var loadCookie = function () {
        var value = Alphagov.read_cookie("successEvents");
        if (value) {
            value = jQuery.parseJSON(jQuery.base64Decode(value));
        } else {
            value = [];
        }
        eventQueue = value;
    };

    var sendCookieEvents = function () {
        loadCookie();
        $(eventQueue).each(function () {
            GOVUK.sendToAnalytics(this);
        });
        eventQueue = [];
        Alphagov.delete_cookie("successEvents");
    };

    var pushCookieEvent = function (event) {
        eventQueue.push(event);
        Alphagov.write_cookie("successEvents", jQuery.base64Encode(JSON.stringify(eventQueue)));
    };

    return {
        push:pushCookieEvent,
        sendAll:sendCookieEvents
    };
}();

GOVUK.Analytics.entryTokens = function () {

    var COOKIE_NAME = 'analyticsTokens';

    var valueIsInArray = function (value, arr) {
        return $.inArray(value, arr) !== -1;
    };

    var assignToken = function () {
        var tokens = JSON.parse(Alphagov.read_cookie(COOKIE_NAME));
        if (!tokens) tokens = [];
        if (!valueIsInArray(GOVUK.Analytics.NeedID, tokens))
        {
            tokens.push(GOVUK.Analytics.NeedID);
            Alphagov.write_cookie(COOKIE_NAME, JSON.stringify(tokens));
        }
    };

    var revokeToken = function () {
        var tokens = JSON.parse(Alphagov.read_cookie(COOKIE_NAME));
        var positionOfToken = $.inArray(GOVUK.Analytics.NeedID,tokens);
        if (positionOfToken !== -1) {
            tokens.splice(positionOfToken,1);
            Alphagov.write_cookie(COOKIE_NAME,JSON.stringify(tokens));
        }
    };

    var tokenExists = function () {
        var tokens = JSON.parse(Alphagov.read_cookie(COOKIE_NAME));
        return valueIsInArray(GOVUK.Analytics.NeedID, tokens);
    };

    return {
        assignToken:assignToken,
        revokeToken:revokeToken,
        tokenExists:tokenExists,
        COOKIE_NAME:COOKIE_NAME
    };
}();