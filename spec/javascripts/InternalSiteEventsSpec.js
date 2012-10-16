describe("internal site events", function () {
    describe("FIREFOX ONLY - CHROME DOES NOT HANDLE COOKIES FROM LOCALHOST", function () {
        if (!$.browser.webkit) {
            afterEach(function () {
                GOVUK.Analytics.internalSiteEvents.sendAll();
            });

            it("should store an event in the cookie on push", function () {
                GOVUK.Analytics.internalSiteEvents.push("event");

                expect(Alphagov.read_cookie("GDS_successEvents"))
                    .toEqual(jQuery.base64Encode(JSON.stringify(["event"])));
            });

            it("should send the stored events to Google Analytics on sendAll", function () {
                spyOn(GOVUK, 'sendToAnalytics');

                GOVUK.Analytics.internalSiteEvents.push("event1");
                GOVUK.Analytics.internalSiteEvents.push("event2");
                GOVUK.Analytics.internalSiteEvents.sendAll();

                var arguments = GOVUK.sendToAnalytics.argsForCall;
                expect(arguments.length).toBe(2);
                expect(arguments[0][0]).toBeEqualAsJSON("event1");
                expect(arguments[1][0]).toBeEqualAsJSON("event2");
                expect(Alphagov.read_cookie("GDS_successEvents"))
                    .toBe(null);
            });
        } else {
            console.log("Caution - not all tests will run on webkit browsers")
        }
    });
});