describe("User Satisfaction Survey", function () {
  describe("Cookies", function () {
    var survey, $surveyBar, $block, inTestPeriodSpy;

    beforeEach(function () {
      $block = $('<div id="banner-notification" style="display: none"></div>' +
                  '<div id="global-cookie-message" style="display: none"></div>' +
                  '<div id="global-browser-prompt" style="display: none"></div>' +
                  '<div id="user-satisfaction-survey-container" data-survey-url="https://www.surveymonkey.com/r/some-survey-id"></div>');

      $('body').append($block);
      $("#user-satisfaction-survey").remove();

      // Don't actually try and take a survey in test.
      $('#take-survey').on('click', function(e) {
        e.preventDefault();
      });

      survey = GOVUK.userSatisfaction;
    });

    afterEach(function () {
      GOVUK.cookie(survey.cookieNameTakenSurvey, null);
      $block.remove();
      survey = null;
    });

    it("should display the user satisfaction div", function () {
      expect($('#user-satisfaction-survey').length).toBe(0);
      survey.showSurveyBar();
      expect($('#user-satisfaction-survey').length).toBe(1);
      expect($('#user-satisfaction-survey').hasClass('visible')).toBe(true);
      expect($('#user-satisfaction-survey').attr('aria-hidden')).toBe('false');
    });

    it("actually returns a value from `currentDate`", function() {
      expect(survey.currentDate()).not.toBe(undefined);
    });

    it("should set the take survey link's href to the survey monkey's url as defined by the wrapper's data-survey-url, appending the page's current path when not already specified", function() {
      spyOn(GOVUK.userSatisfaction, 'inTestPeriod').and.returnValue(false);
      $("#user-satisfaction-survey-container").data('survey-url', 'https://www.surveymonkey.com/r/some-survey-id');
      survey.showSurveyBar();
      expect($('#take-survey').attr('href')).toBe("https://www.surveymonkey.com/r/some-survey-id?c="+window.location.pathname);
    });

    it("should set the take survey link's href to the survey monkey's url as defined by the wrapper's data-survey-url, appending nothing when a path is already specified", function() {
      spyOn(GOVUK.userSatisfaction, 'inTestPeriod').and.returnValue(false);
      $("#user-satisfaction-survey-container").data('survey-url', 'https://www.surveymonkey.com/r/some-survey-id?c=/somewhere');
      survey.showSurveyBar();
      expect($('#take-survey').attr('href')).toBe("https://www.surveymonkey.com/r/some-survey-id?c=/somewhere");
    });

    it("should show the survey approximately 1 in every 50 pageviews", function () {
      spyOn(GOVUK.userSatisfaction, 'inTestPeriod').and.returnValue(false);
      expect(survey.surveyFrequency()).toBe(50);
    });

    it("should decrease the frequency to 1 in every 100 pageviews during test period", function () {
      spyOn(GOVUK.userSatisfaction, 'inTestPeriod').and.returnValue(true);
      expect(survey.surveyFrequency()).toBe(100);
    });

    it("should display the survey when the random number matches", function () {
      expect($('#user-satisfaction-survey').length).toBe(0);
      spyOn(GOVUK.userSatisfaction, 'surveyFrequency').and.returnValue(1);
      survey.randomlyShowSurveyBar();
      expect($('#user-satisfaction-survey').length).toBe(1);
    });

    it("should not display the user satisfaction div if another notification banner is visible", function() {
      $('#global-cookie-message').css('display', 'block');

      survey.showSurveyBar();
      expect($('#user-satisfaction-survey').length).toBe(0);
    });

    it("shouldn't show the user satisfaction div if the 'survey taken' cookie is set", function () {
      GOVUK.cookie(survey.cookieNameTakenSurvey, 'true');

      var counter = 0;
      for (var i = 0; i < 100; i++) {
        survey.randomlyShowSurveyBar();

        if ($('#user-satisfaction-survey').length > 0) {
          counter += 1;
          break;
        }
      }

      expect(counter).toBe(0);
    });

    describe("Event handlers", function () {
      beforeEach(function() {
        survey.showSurveyBar();
      });

      it("should set a cookie when clicking 'take survey'", function () {
        $('#take-survey').trigger('click');
        expect(GOVUK.cookie(survey.cookieNameTakenSurvey)).toBe('true');
      });

      it("should set a cookie when clicking 'no thanks'", function () {
        $('#survey-no-thanks').trigger('click');
        expect(GOVUK.cookie(survey.cookieNameTakenSurvey)).toBe('true');
      });

      it("should hide the satisfaction survey bar after clicking 'take survey'", function () {
        $('#take-survey').trigger('click');
        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false);
        expect($('#user-satisfaction-survey').attr('aria-hidden')).toBe('true');
      });

      it("should hide the satisfaction survey bar after clicking 'no thanks'", function () {
        $('#survey-no-thanks').trigger('click');
        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false);
      });
    });

    describe("inTestPeriod", function () {
      it("should be false on 3 May 2016", function() {
        spyOn(survey, 'currentDate').and.returnValue(new Date("May 3, 2016 23:50:00").getTime());
        expect(survey.inTestPeriod()).toBe(false);
      });

      it("should be true on 4 May 2016", function() {
        spyOn(survey, 'currentDate').and.returnValue(new Date("May 4, 2016 00:01:00").getTime());
        expect(survey.inTestPeriod()).toBe(true);
      });

      it("should be true on 5 May 2016", function() {
        spyOn(survey, 'currentDate').and.returnValue(new Date("May 5, 2016 23:50:00").getTime());
        expect(survey.inTestPeriod()).toBe(true);
      });

      it("should be false on 6 May 2016", function() {
        spyOn(survey, 'currentDate').and.returnValue(new Date("May 6, 2016 00:01:00").getTime());
        expect(survey.inTestPeriod()).toBe(false);
      });
    });
  });
});
