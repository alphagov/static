describe("success event tracking", function () {

    var guideMarkup = $("<div id='content' class='test-stub'>" +
        "<a id='guide-internal-link' href='#'>link</a>" +
        "<a id='guide-external-link' href='#this-is-a-test' rel='external'>link</a>" +
        "</div>");

    var articleContainer = $("<div class='article-container test-stub'><a id='transaction-link' href='#'>link</a></div>")

    beforeEach(function () {
        $('a').unbind();
        articleContainer.clone().appendTo('body');
        guideMarkup.clone().appendTo('body');
        spyOn(GOVUK, 'sendToAnalytics');
    });

    afterEach(function () {
        Alphagov.delete_cookie("successEvents")
        $(".test-stub").remove();
    });

    describe("isTheSameArtefact", function () {
        it("should support basic case", function () {
            var result = GOVUK.Analytics.isTheSameArtefact(
                "http://www.gov.uk/claim-tax/first",
                "http://www.gov.uk/claim-tax/second");

            expect(result).toBeTruthy();
        });

        it("should support coming to very same url", function () {
            var result = GOVUK.Analytics.isTheSameArtefact(
                "http://www.gov.uk/claim-tax/first",
                "http://www.gov.uk/claim-tax/first");

            expect(result).toBeTruthy();
        });

        it("should support local anchor on previous url", function () {
            var result = GOVUK.Analytics.isTheSameArtefact(
                "http://www.gov.uk/claim-tax",
                "http://www.gov.uk/claim-tax#foobar");

            expect(result).toBeTruthy();
        });

        it("should support local anchor on current url", function () {
            var result = GOVUK.Analytics.isTheSameArtefact(
                "http://www.gov.uk/claim-tax#foobar",
                "http://www.gov.uk/claim-tax");

            expect(result).toBeTruthy();
        });

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
            spyOn(GOVUK.Analytics.Trackers, 'guide');
            spyOn(GOVUK.Analytics.Trackers, 'transaction');

            GOVUK.Analytics.startAnalytics();

            expect(GOVUK.Analytics.Trackers.transaction).not.toHaveBeenCalled();
            expect(GOVUK.Analytics.Trackers.guide).toHaveBeenCalled();
        });

        it("should only call transaction strategy when format is transaction", function () {
            GOVUK.Analytics.Format = 'transaction';
            GOVUK.Analytics.NeedID = '99999';
            spyOn(GOVUK.Analytics.Trackers, 'guide');
            spyOn(GOVUK.Analytics.Trackers, 'transaction');

            GOVUK.Analytics.startAnalytics();

            expect(GOVUK.Analytics.Trackers.transaction).toHaveBeenCalled();
            expect(GOVUK.Analytics.Trackers.guide).not.toHaveBeenCalled();
        });

        it("should not error if format is not supported", function () {
            GOVUK.Analytics.Format = 'blahblah';
            GOVUK.Analytics.NeedID = '99999';

            GOVUK.Analytics.startAnalytics();
        });
    });

    describe("user interactions", function () {
        it("should register success event for guide format when an internal link inside #content receives a 'return' key press", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            var e = jQuery.Event("keypress");
            e.which = 13;
            e.keyCode = 13;
            $("#guide-internal-link").trigger(e);

            var arguments = GOVUK.sendToAnalytics.argsForCall;
            expect(arguments.length).toBe(2);
            expect(arguments[1][0]).toBeEqualAsJSON(['_trackEvent', 'MS_guide', '99999', 'Success']);
        });

        it("should register success event for guide format when an internal link inside #content is clicked", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $('#guide-internal-link').click();

            var arguments = GOVUK.sendToAnalytics.argsForCall;
            expect(arguments.length).toBe(2);
            expect(arguments[1][0]).toBeEqualAsJSON(['_trackEvent', 'MS_guide', '99999', 'Success']);
        });

        it("should redirect through the exit action when an external link inside #content is clicked", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $('#guide-external-link').click();

            var href = $("#guide-external-link").prop("href");
            var parts = href.split("/");
            var expected = "exit?slug=&target=%23this-is-a-test&needId=99999";
            expect(parts[3]).toEqual(expected)
        });

        it("should not register multiple guide success events when navigating to items on the same page", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $('#guide-internal-link').click();
            $('#guide-internal-link').click();
            $('#guide-internal-link').click();
            $('#guide-internal-link').click();

            var arguments = GOVUK.sendToAnalytics.argsForCall;
            expect(arguments.length).toBe(2);
            expect(arguments[1][0]).toBeEqualAsJSON(['_trackEvent', 'MS_guide', '99999', 'Success']);
        });

        it("should not register external click if internal link has been clicked", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $('#guide-internal-link').click();
            $('#guide-external-link').click();

            var href = $("#guide-external-link").prop("href");
            var parts = href.split("/");
            expect(parts[3]).toEqual("#this-is-a-test");
        });

        it("should not register internal click if external link has been clicked", function () {
            GOVUK.Analytics.Format = 'guide';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $('#guide-external-link').click();
            $('#guide-internal-link').click();

            expect(Alphagov.read_cookie("successEvents")).toBe(null);
        });

        it("should register a smart answer success if the smartanswerOutcome event is fired", function () {
            GOVUK.Analytics.Format = 'smart_answer';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $.event.trigger("smartanswerOutcome");

            var arguments = GOVUK.sendToAnalytics.argsForCall;
            expect(arguments.length).toBe(2);
            expect(arguments[1][0]).toBeEqualAsJSON(['_trackEvent', 'MS_smart_answer', '99999', 'Success']);
        });

        it("should not register a smart answer success if a smartanswerOutcome event has already been fired", function () {
            GOVUK.Analytics.Format = 'smart_answer';
            GOVUK.Analytics.NeedID = '99999';
            GOVUK.Analytics.startAnalytics();

            $.event.trigger("smartanswerOutcome");
            $.event.trigger("smartanswerOutcome");

            var arguments = GOVUK.sendToAnalytics.argsForCall;
            expect(arguments.length).toBe(2);
            expect(arguments[1][0]).toBeEqualAsJSON(['_trackEvent', 'MS_smart_answer', '99999', 'Success']);
        })
    });
});