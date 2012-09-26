describe("success event tracking", function () {

    beforeEach(function () {
        // unbind the jQuery auto-wiring
        $('a').unbind();
        $("#content").remove();
        $("#article-content").remove();
        // create a guide internal and external link
        var guideMarkup = "<div id='content'>" +
            "<a id='guide-internal-link' href='#'>link</a>" +
            "<a id='guide-external-link' href='#' rel='external'>link</a>" +
            "</div>";
        $(guideMarkup).appendTo('body');
        $("<div class='article-container'><a id='transaction-link' href='#'>link</a></div>").appendTo('body');
        spyOn(GOVUK, 'sendToAnalytics');
    });

    afterEach(function () {
        Alphagov.delete_cookie("successEvents")
    });

    describe("analytics integration", function () {
        it("should register entry event", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            var arguments = GOVUK.sendToAnalytics.argsForCall;
            var expectedDataToSendToGoogle = ['_trackEvent', 'MS_guide', '99999', 'Entry'];
            expect(arguments.length).toBe(1);
            // using JSONEquals because there is a bug in the .toHaveBeenCalledWith() method
            // see: https://github.com/pivotal/jasmine/issues/45
            expect(arguments[0][0]).toBeEqualAsJSON(expectedDataToSendToGoogle);
        });

        it("should not register an entry event if there is no need id", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = undefined;
            GOVUK.Analytics.startAnalytics();

            var arguments = GOVUK.sendToAnalytics.argsForCall;
            expect(arguments.length).toBe(0);
        });

        it("should only call guide strategy when format is guide", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            spyOn(GOVUK.Analytics, 'guideTracking');
            spyOn(GOVUK.Analytics, 'transactionTracking');

            GOVUK.Analytics.startAnalytics();

            expect(GOVUK.Analytics.transactionTracking).not.toHaveBeenCalled();
            expect(GOVUK.Analytics.guideTracking).toHaveBeenCalled();
        });

        it("should only call transaction strategy when format is transaction", function () {
            GOVUK.Analytics.Format = 'transaction';
            GOVUK.Analytics.NeedID = '99999';
            spyOn(GOVUK.Analytics, 'transactionTracking');
            spyOn(GOVUK.Analytics, 'guideTracking');

            GOVUK.Analytics.startAnalytics();

            expect(GOVUK.Analytics.transactionTracking).toHaveBeenCalled();
            expect(GOVUK.Analytics.guideTracking).not.toHaveBeenCalled();
        });

        it("should not error if format is not supported", function () {
            GOVUK.Analytics.Format = 'blahblah';
            GOVUK.Analytics.NeedID = '99999';

            GOVUK.Analytics.startAnalytics();
        });
    });

    describe("user interactions", function () {
        it("should register success event for guide format when an internal link inside #content is clicked", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $('#guide-internal-link').click();

            var cookie = jQuery.parseJSON(jQuery.base64Decode(Alphagov.read_cookie("successEvents")));
            expect(cookie[0]).toBeEqualAsJSON(['_trackEvent', 'MS_guide', '99999', 'Success']);
        });

        it("should redirect through the exit action when an external link inside #content is clicked", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $('#guide-external-link').click();

            var href = $("#guide-external-link").prop("href");
            var parts = href.split("/");
            expect(parts[3]).toEqual("exit?slug=?&target=#&needId=99999")
        });

        it("should not register multiple guide success events when navigating to items on the same page", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $('#guide-internal-link').click();
            $('#guide-internal-link').click();
            $('#guide-internal-link').click();
            $('#guide-internal-link').click();

            var cookie = jQuery.parseJSON(jQuery.base64Decode(Alphagov.read_cookie("successEvents")));
            expect(cookie.length).toBe(1);
        });

        it("should not register external click if internal link has been clicked", function() {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $('#guide-internal-link').click();
            $('#guide-external-link').click();

            var href = $("#guide-external-link").prop("href");
            var parts = href.split("/");
            expect(parts[3]).toEqual("?#");
        });

        it("should not register internal click if external link has been clicked", function() {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $('#guide-external-link').click();
            $('#guide-internal-link').click();

            expect(Alphagov.read_cookie("successEvents")).toBe(null);
        });
    });
});