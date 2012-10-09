describe("analytics cookie tokens", function () {

    var cookieName = GOVUK.Analytics.entryTokens.COOKIE_NAME;

    beforeEach(function () {
        Alphagov.delete_cookie(cookieName)

    });

    it("should write a token into a cookie array", function () {
        GOVUK.Analytics.NeedID = 12;
        GOVUK.Analytics.entryTokens.assignToken();

        expect(Alphagov.read_cookie(cookieName)).toBe("[12]");
    });

    it("should write multiple tokens to the array", function () {
        GOVUK.Analytics.NeedID = 12;
        GOVUK.Analytics.entryTokens.assignToken();
        GOVUK.Analytics.NeedID = 42;
        GOVUK.Analytics.entryTokens.assignToken();

        expect(Alphagov.read_cookie(cookieName)).toBe("[12,42]");
    });

    it("should not write the same token multiple times", function () {
        GOVUK.Analytics.NeedID = 15;
        GOVUK.Analytics.entryTokens.assignToken();
        GOVUK.Analytics.entryTokens.assignToken();

        expect(Alphagov.read_cookie(cookieName)).toBe("[15]");
    });

    it("should remove a token from the cookie array", function () {
        GOVUK.Analytics.NeedID = 20;
        GOVUK.Analytics.entryTokens.assignToken();

        GOVUK.Analytics.entryTokens.revokeToken();

        expect(Alphagov.read_cookie(cookieName)).toBe("[]");
    });

    it("should preserve the remaining tokens when one is removed", function () {
        GOVUK.Analytics.NeedID = 16;
        GOVUK.Analytics.entryTokens.assignToken();
        GOVUK.Analytics.NeedID = 19;
        GOVUK.Analytics.entryTokens.assignToken();

        GOVUK.Analytics.entryTokens.revokeToken();

        expect(Alphagov.read_cookie(cookieName)).toBe("[16]");
    });

    it("should not blow up if a token is revoked when the cookie array is empty", function () {
        GOVUK.Analytics.NeedID = 33;
        GOVUK.Analytics.entryTokens.revokeToken();

        // should not throw any error
    });

    it("should not blow up if a nonexistent token is revoked", function () {
        GOVUK.Analytics.NeedID = 21;
        GOVUK.Analytics.entryTokens.assignToken();
        GOVUK.Analytics.NeedID = 42;

        GOVUK.Analytics.entryTokens.revokeToken();

        expect(Alphagov.read_cookie(cookieName)).toBe("[21]");
    });

    it("should return true if token has been assigned", function () {
        GOVUK.Analytics.NeedID = 25;
        GOVUK.Analytics.entryTokens.assignToken();

        expect(GOVUK.Analytics.entryTokens.tokenExists()).toBeTruthy();
    });

    it("should return false if token has not been assigned", function () {
        GOVUK.Analytics.NeedID = 35;

        expect(GOVUK.Analytics.entryTokens.tokenExists()).toBeFalsy();
    });
});