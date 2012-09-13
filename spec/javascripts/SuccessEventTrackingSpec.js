describe("success event tracking", function() {

    beforeEach(function () {
        // unbind the jQuery auto-wiring
        $('a').unbind();
        spyOn(GOVUK,'sendToAnalytics');
    });

    it("should register success event for guide format when a link inside #content is clicked", function () {
        GOVUK.Analytics.Format = 'guide';
        GOVUK.Analytics.NeedID = '99999';
        GOVUK.wireTrackingEvents();
        
        $('#guide-link').click();

        var arguments = GOVUK.sendToAnalytics.argsForCall;
        var expectedDataToSendToGoogle = ['_trackEvent', 'MS_guide', '99999', 'Success'];
        expect(arguments.length).toBe(1);
        // using JSONEquals because there is a bug in the .toHaveBeenCalledWith() method
        // see: https://github.com/pivotal/jasmine/issues/45
        expect(arguments[0][0]).toBeEqualAsJSON(expectedDataToSendToGoogle);
    });

    it("should not register multiple guide success events when navigating to items on the same page", function() {
        GOVUK.Analytics.Format = 'guide';
        GOVUK.Analytics.NeedID = '99999';
        GOVUK.wireTrackingEvents();

        $('#guide-link').click();
        $('#guide-link').click();
        $('#guide-link').click();
        $('#guide-link').click();

        expect(GOVUK.sendToAnalytics.argsForCall.length).toBe(1);
    });

    it("should register success event for transaction format when a link inside .article-container is clicked", function() {
        GOVUK.Analytics.Format = 'transaction';
        GOVUK.Analytics.NeedID = 'fake need id';
        GOVUK.wireTrackingEvents();

        $('#transaction-link').click();

        var arguments = GOVUK.sendToAnalytics.argsForCall;
        expect(arguments.length).toBe(1);
        expect(arguments[0][0]).toBeEqualAsJSON(['_trackEvent', 'MS_transaction', 'fake need id', 'Success']);
    });

    it("should not register multiple transaction success events when navigating to items on the same page", function () {
        GOVUK.Analytics.Format = 'transaction';
        GOVUK.Analytics.NeedID = 'fake need id';
        GOVUK.wireTrackingEvents();

        $('#transaction-link').click();
        $('#transaction-link').click();
        $('#transaction-link').click();
        $('#transaction-link').click();

        expect(GOVUK.sendToAnalytics.argsForCall.length).toBe(1);
    });

});