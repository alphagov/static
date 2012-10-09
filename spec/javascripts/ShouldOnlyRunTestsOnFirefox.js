describe("the tests", function () {

    it("should only be run on firefox - TESTS WILL FAIL ON CHROME DUE TO NOT BEING ABLE TO WRITE COOKIES TO LOCALHOST, PLEASE RE-RUN IN FIREFOX!!!!", function () {
        if (!$.browser.mozilla) {
            alert("your tests are failing because you are not running them on firefox!!!")
        }

        expect($.browser.mozilla).toBeTruthy();
    });

});