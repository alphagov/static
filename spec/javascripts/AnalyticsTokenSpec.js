describe("analytics cookie tokens", function () {
    var cookie = new GOVUK.Cookie();
    var cookieName = "GDS_analyticsTokens";

    beforeEach(function () {
        cookie.delete(cookieName);
        spyOn(GOVUK.Analytics, "getSlug").andCallFake(function () { return getSlugResult; });
        GOVUK.Analytics.Format = "guide";
    });

    it("should write a token into a cookie array", function () {
        getSlugResult = 12;
        GOVUK.Analytics.entryTokens.assignToken();

        expect(cookie.read(cookieName)).toBe("[12]");
    });

    it("should write multiple tokens to the array", function () {
        getSlugResult = 12;
        GOVUK.Analytics.entryTokens.assignToken();
        getSlugResult = 42;
        GOVUK.Analytics.entryTokens.assignToken();

        expect(cookie.read(cookieName)).toBe("[12,42]");
    });

    it("should not write the same token multiple times", function () {
        getSlugResult = 15;
        GOVUK.Analytics.entryTokens.assignToken();
        GOVUK.Analytics.entryTokens.assignToken();

        expect(cookie.read(cookieName)).toBe("[15]");
    });

    it("should remove a token from the cookie array", function () {
        getSlugResult = 20;
        GOVUK.Analytics.entryTokens.assignToken();

        GOVUK.Analytics.entryTokens.revokeToken();

        expect(cookie.read(cookieName)).toBe("[]");
    });

    it("should preserve the remaining tokens when one is removed", function () {
        getSlugResult = 16;
        GOVUK.Analytics.entryTokens.assignToken();
        getSlugResult = 19;
        GOVUK.Analytics.entryTokens.assignToken();

        GOVUK.Analytics.entryTokens.revokeToken();

        expect(cookie.read(cookieName)).toBe("[16]");
    });

    it("should not blow up if a token is revoked when the cookie array is empty", function () {
        getSlugResult = 33;
        GOVUK.Analytics.entryTokens.revokeToken();

        // should not throw any error
    });

    it("should not blow up if a nonexistent token is revoked", function () {
        getSlugResult = 21;
        GOVUK.Analytics.entryTokens.assignToken();
        getSlugResult = 42;

        GOVUK.Analytics.entryTokens.revokeToken();

        expect(cookie.read(cookieName)).toBe("[21]");
    });

    it("should return true if token has been assigned", function () {
        getSlugResult = 25;
        GOVUK.Analytics.entryTokens.assignToken();

        expect(GOVUK.Analytics.entryTokens.tokenExists()).toBeTruthy();
    });

    it("should return false if token has not been assigned", function () {
        getSlugResult = 35;

        expect(GOVUK.Analytics.entryTokens.tokenExists()).toBeFalsy();
    });
});
