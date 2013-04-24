describe("User Satisfaction Survery", function () {
  describe("Cookies", function () {
    var survey;

    beforeEach(function () {
      survey = new GOVUK.UserSatisfaction();
    });

    afterEach(function () {
      // Remove the cookie that we're setting.
      Alphagov.delete_cookie(survey.cookieNameSeenBar);
      Alphagov.delete_cookie(survey.cookieNameTakenSurvey);
    });

    it("should set a cookie when we've seen the bar", function () {
      expect(Alphagov.read_cookie(survey.cookieNameSeenBar)).toBe(null);
      survey.setCookieSeenBar();
      expect(Alphagov.read_cookie(survey.cookieNameSeenBar)).toBe('true');
    });

    it("should set a cookie when we've taken the survey", function () {
      expect(Alphagov.read_cookie(survey.cookieNameTakenSurvey)).toBe(null);
      survey.setCookieTakenSurvey();
      expect(Alphagov.read_cookie(survey.cookieNameTakenSurvey)).toBe('true');
    });
  });
});
