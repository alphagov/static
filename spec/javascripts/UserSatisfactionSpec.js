describe("User Satisfaction Survery", function () {
  describe("Cookies", function () {
    var survey;
    var cookie = new GOVUK.Cookie();

    beforeEach(function () {
      survey = new GOVUK.UserSatisfaction();
    });

    afterEach(function () {
      // Remove the cookie that we're setting.
      cookie.delete(survey.cookieNameSeenBar);
      cookie.delete(survey.cookieNameTakenSurvey);
    });

    it("should set a cookie when we've seen the bar", function () {
      expect(cookie.read(survey.cookieNameSeenBar)).toBe(null);
      survey.setCookieSeenBar();
      expect(cookie.read(survey.cookieNameSeenBar)).toBe('true');
    });

    it("should set a cookie when we've taken the survey", function () {
      expect(cookie.read(survey.cookieNameTakenSurvey)).toBe(null);
      survey.setCookieTakenSurvey();
      expect(cookie.read(survey.cookieNameTakenSurvey)).toBe('true');
    });
  });
});
