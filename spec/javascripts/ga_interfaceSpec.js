describe("ga_interface.js (google analytics interface)", function () {

    it("should be able to spy on ga_interface to intercept posting analytics data", function () {
        spyOn(GOVUK, 'sendToAnalytics');
        GOVUK.sendToAnalytics("foo");
        expect(GOVUK.sendToAnalytics).toHaveBeenCalled();
    });

    it("should call google analytics behind the scenes", function () {
        spyOn(_gaq, 'push');
        GOVUK.sendToAnalytics(['foo']);
        expect(_gaq.push).toHaveBeenCalledWith(["foo"]);
    });

});