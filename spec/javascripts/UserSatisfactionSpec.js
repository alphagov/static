describe("User Satisfaction Survery", function () {
  describe("Cookies", function () {
    var survey;

    var cookie = new GOVUK.Cookie();
    var surveyElement;

    beforeEach(function () {
      surveyElement = document.createElement("div");
      document.body.appendChild(surveyElement);
      surveyElement.id = "user-satisfaction-survey";
      surveyElement.style.display = "none";

      survey = new GOVUK.UserSatisfaction();
    });

    afterEach(function () {
      // Remove the cookie that we're setting.
      cookie.delete(survey.cookieNameSeenBar);
      cookie.delete(survey.cookieNameTakenSurvey);

      (elem = document.getElementById("user-satisfaction-survey")).parentNode.removeChild(elem);

      survey = null;
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

    it("should display the user satisfaction div", function () {
      expect(surveyElement.style.display).toBe("none");
      survey.showSurveyBar();
      expect(surveyElement.style.display).toBe("block");
    });

    it("should randomly display the user satisfaction div", function () {
      var counter = 0;
      for (var i = 0; i < 50; i++) {
        surveyElement.style.display = "none";
        survey.randomlyShowSurveyBar();

        if (surveyElement.style.display == "block") {
          counter += 1;
        }
      }

      expect(counter).toBeGreaterThan(0);
      expect(counter).toBeLessThan(15);
    });
  });
});
