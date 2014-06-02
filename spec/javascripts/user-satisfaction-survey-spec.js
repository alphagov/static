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

    var block = '<div id="banner-notification" style="display: none"></div>\
    <div id="global-cookie-message" style="display: none"></div>\
    <div id="global-browser-prompt" style="display: none"></div>\
    <section id="user-satisfaction-survey">\
      <div class="wrapper">\
        <h1>Tell us what you think of GOV.UK</h1>\
        <p>Survey takes 5 minutes and opens in a new window <a href="javascript:void(0)" id="survey-no-thanks">No thanks</a></p>\
        <p class="right"><a href="javascript:void(0)" id="take-survey" class="button">5 min survey</a></p>\
      </div>\
    </section>';

    beforeEach(function () {
      document.body.insertAdjacentHTML("afterbegin", block);

      $surveyBar = $("#user-satisfaction-survey");
      $surveyBar.removeClass('visible');

      survey = GOVUK.userSatisfaction;
    });

    afterEach(function () {
      // Remove the cookie that we're setting.
      GOVUK.cookie(survey.cookieNameTakenSurvey, null);

      (elem = document.getElementById("user-satisfaction-survey")).parentNode.removeChild(elem);

      survey = null;
    });

    it("should display the user satisfaction div", function () {
      expect($surveyBar.hasClass('visible')).toBe(false);
      survey.showSurveyBar();
      expect($surveyBar.hasClass('visible')).toBe(true);
    });

    it("should randomly display the user satisfaction div", function () {
      pending(); //Fails randomly, disabling.

      var counter = 0;
      for (var i = 0; i < 100; i++) {
        $surveyBar.removeClass('visible')
        survey.randomlyShowSurveyBar();

        if ($surveyBar.hasClass('visible')) {
          counter += 1;
        }
      }

      expect(counter).toBeGreaterThan(0);
      expect(counter).toBeLessThan(5);
    });

    it("should not display the user satisfaction div if another notification banner is visible", function() {
      $('#global-cookie-message').css('display', 'block');

      survey.showSurveyBar();
      expect($surveyBar.hasClass('visible')).toBe(false);
    });

    it("shouldn't show the user satisfaction div if the 'survey taken' cookie is set", function () {
      GOVUK.cookie(survey.cookieNameTakenSurvey, 'true');

      var counter = 0;
      for (var i = 0; i < 100; i++) {
        survey.randomlyShowSurveyBar();

        if ($surveyBar.hasClass('visible')) {
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

        expect($surveyBar.hasClass('visible')).toBe(false);
      });

      it("should hide the satisfaction survey bar after clicking 'no thanks'", function () {
        survey.showSurveyBar();

        var noThanks = document.getElementById("survey-no-thanks");
        clickElem(noThanks);

        expect($surveyBar.hasClass('visible')).toBe(false);
      });

      it("should append the current path to the url when clicking 'take survey'", function() {
        survey.showSurveyBar();

        var takeSurvey = document.getElementById("take-survey");
        clickElem(takeSurvey);

        expect(takeSurvey.getAttribute("href")).toBe("javascript:void(0)?c=/");
      });
    });
  });
});
