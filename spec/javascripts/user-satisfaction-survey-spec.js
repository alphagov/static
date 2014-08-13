describe("User Satisfaction Survey", function () {
  describe("Cookies", function () {
    var survey;
    var $surveyBar;

    var clickElem = function (link) {
      var cancelled = false;

      if (document.createEvent) {
        var event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, true, window,
                             0, 0, 0, 0, 0,
                             false, false, false, false,
                             0, null);
        cancelled = !(link.dispatchEvent(event));
      } else if (link.fireEvent) {
        cancelled = !(link.fireEvent("onclick"));
      }

      if (!cancelled) {
        window.location = link.href;
      }
    }

    var block = '<div id="banner-notification" style="display: none"></div>' +
                '<div id="global-cookie-message" style="display: none"></div>' +
                '<div id="global-browser-prompt" style="display: none"></div>' +
                '<div id="user-satisfaction-survey-container" data-survey-url="http://www.surveymonkey.com/some-survey-id"></div>';


    beforeEach(function () {
      document.body.insertAdjacentHTML("afterbegin", block);

      $("#user-satisfaction-survey").remove();
      $("#user-satisfaction-survey-container").data('survey-url', 'javascript:void();');

      // Don't actually try and take a survey in test.
      $('#take-survey').live('click', function(e) {
        e.preventDefault();
      });

      survey = GOVUK.userSatisfaction;
    });

    afterEach(function () {
      // Remove the cookie that we're setting.
      GOVUK.cookie(survey.cookieNameTakenSurvey, null);

      // (elem = document.getElementById("user-satisfaction-survey")).parentNode.removeChild(elem);
      $('#user-satisfaction-survey-wrapper').empty();

      survey = null;
    });

    it("should display the user satisfaction div", function () {
      expect($('#user-satisfaction-survey').length).toBe(0);
      survey.showSurveyBar();
      expect($('#user-satisfaction-survey').length).toBe(1);
      expect($('#user-satisfaction-survey').hasClass('visible')).toBe(true);
    });

    it("should set the take survey link's href to the survey monkey's url as defined by the wrapper's data-survey-url, appending the page's current path when not already specified", function() {
      $("#user-satisfaction-survey-container").data('survey-url', 'http://www.surveymonkey.com/some-survey-id');
      survey.showSurveyBar();
      expect($('#take-survey').attr('href')).toBe("http://www.surveymonkey.com/some-survey-id?c=/")
    });

    it("should set the take survey link's href to the survey monkey's url as defined by the wrapper's data-survey-url, appending nothing when a path is already specified", function() {
      $("#user-satisfaction-survey-container").data('survey-url', 'http://www.surveymonkey.com/some-survey-id?c=/somewhere');
      survey.showSurveyBar();
      expect($('#take-survey').attr('href')).toBe("http://www.surveymonkey.com/some-survey-id?c=/somewhere")
    });

    it("should randomly display the user satisfaction div", function () {
      pending(); //Fails randomly, disabling.

      var counter = 0;
      for (var i = 0; i < 100; i++) {
        $('#user-satisfaction-survey').remove();
        survey.randomlyShowSurveyBar();

        if ($('#user-satisfaction-survey').length > 0) {
          counter += 1;
        }
      }

      expect(counter).toBeGreaterThan(0);
      expect(counter).toBeLessThan(5);
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
      it("should set a cookie when clicking 'take survey'", function () {
        survey.showSurveyBar();

        var takeSurvey = document.getElementById("take-survey");
        clickElem(takeSurvey);

        expect(GOVUK.cookie(survey.cookieNameTakenSurvey)).toBe('true');
      });

      it("should set a cookie when clicking 'no thanks'", function () {
        survey.showSurveyBar();

        var noThanks = document.getElementById("survey-no-thanks");
        clickElem(noThanks);

        expect(GOVUK.cookie(survey.cookieNameTakenSurvey)).toBe('true');
      });

      it("should hide the satisfaction survey bar after clicking 'take survey'", function () {
        survey.showSurveyBar();

        var takeSurvey = document.getElementById("take-survey");
        clickElem(takeSurvey);

        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false);
      });

      it("should hide the satisfaction survey bar after clicking 'no thanks'", function () {
        survey.showSurveyBar();

        var noThanks = document.getElementById("survey-no-thanks");
        clickElem(noThanks);

        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false);
      });
    });
  });
});
