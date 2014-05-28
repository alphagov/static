describe("analytics cookie tokens", function () {
  describe("GOVUK.Analytics.entryTokens", function () {
    var cookieName = "GDS_analyticsTokens";

    beforeEach(function () {
      GOVUK.cookie(cookieName, null);
      spyOn(GOVUK.Analytics, "getSlug").and.callFake(function () { return getSlugResult; });
      GOVUK.Analytics.Format = "guide";
    });

    it("should write a token into a cookie array", function () {
      getSlugResult = 12;
      GOVUK.Analytics.entryTokens.assignToken();

      expect(GOVUK.cookie(cookieName)).toBe("[12]");
    });

    it("should write multiple tokens to the array", function () {
      getSlugResult = 12;
      GOVUK.Analytics.entryTokens.assignToken();
      getSlugResult = 42;
      GOVUK.Analytics.entryTokens.assignToken();

      expect(GOVUK.cookie(cookieName)).toBe("[12,42]");
    });

    it("should not write the same token multiple times", function () {
      getSlugResult = 15;
      GOVUK.Analytics.entryTokens.assignToken();
      GOVUK.Analytics.entryTokens.assignToken();

      expect(GOVUK.cookie(cookieName)).toBe("[15]");
    });

    it("should remove a token from the cookie array", function () {
      getSlugResult = 20;
      GOVUK.Analytics.entryTokens.assignToken();

      GOVUK.Analytics.entryTokens.revokeToken();

      expect(GOVUK.cookie(cookieName)).toBe("[]");
    });

    it("should preserve the remaining tokens when one is removed", function () {
      getSlugResult = 16;
      GOVUK.Analytics.entryTokens.assignToken();
      getSlugResult = 19;
      GOVUK.Analytics.entryTokens.assignToken();

      GOVUK.Analytics.entryTokens.revokeToken();

      expect(GOVUK.cookie(cookieName)).toBe("[16]");
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

      expect(GOVUK.cookie(cookieName)).toBe("[21]");
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

  describe("GOVUK.Analytics.internalSiteEvents", function () {
    afterEach(function () {
      GOVUK.Analytics.internalSiteEvents.sendAll();
    });

    it("should store an event in the cookie on push", function () {
      GOVUK.Analytics.internalSiteEvents.push("event");

      expect(GOVUK.cookie("GDS_successEvents"))
      .toEqual(jQuery.base64Encode(JSON.stringify(["event"])));
    });

    it("should send the stored events to Google Analytics on sendAll", function () {
      spyOn(GOVUK, 'sendToAnalytics');

      GOVUK.Analytics.internalSiteEvents.push("event1");
      GOVUK.Analytics.internalSiteEvents.push("event2");
      GOVUK.Analytics.internalSiteEvents.sendAll();

      var args = GOVUK.sendToAnalytics.calls.allArgs();
      expect(args.length).toBe(2);
      expect(args[0][0]).toBeEqualAsJSON("event1");
      expect(args[1][0]).toBeEqualAsJSON("event2");
      expect(GOVUK.cookie("GDS_successEvents"))
      .toBe(null);
    });
  });
});
