var GOVUK = GOVUK || {};
GOVUK.UserSatisfaction = GOVUK.UserSatisfaction || function () {};

GOVUK.UserSatisfaction.prototype = {
  cookieNameSeenBar: "seenSurveyBar",
  cookieNameTakenSurvey: "takenUserSatisfactionSurvey",

  return {
    cookieNameTakenSurvey: "takenUserSatisfactionSurvey",
    setCookieTakenSurvey: function () {
      cookie.write(this.cookieNameTakenSurvey, true);
    },
    appendCurrentPathToSurveyUrl: function() {
      var takeSurvey = document.getElementById('take-survey');
      var surveyUrlWithPath = takeSurvey.getAttribute('href') + "?c=" + window.location.pathname;
      takeSurvey.setAttribute('href', surveyUrlWithPath);
    },
    setEventHandlers: function () {
      var setCookie = function (name) {
        return function () {
          cookie.write(name, true);

          var survey = document.getElementById("user-satisfaction-survey");
          survey.style.display = "none";
        }
      }

      var noThanks = document.getElementById("survey-no-thanks");
      var takeSurvey = document.getElementById("take-survey");

      noThanks.addEventListener('click', setCookie(this.cookieNameTakenSurvey));
      takeSurvey.addEventListener('click', setCookie(this.cookieNameTakenSurvey));
      takeSurvey.addEventListener('click', this.appendCurrentPathToSurveyUrl);
    },
    showSurveyBar: function () {
      if (cookie.read(this.cookieNameTakenSurvey) === "true") {
        return;
      }

      this.setEventHandlers();

      var survey = document.getElementById("user-satisfaction-survey");
      var isMobileUA = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile|Opera\ Mini)/);
      var isMobileScreen = screen.availWidth < 900;

      if (survey && survey.style.display === "none" && !isMobileUA && !isMobileScreen) {
        survey.style.display = "block";
      }
    },
    randomlyShowSurveyBar: function () {
      var min = 0;
      var max = 100;
      var random = Math.floor(Math.random() * (max - min + 1)) + min;

      if (random === 0 || random === 100 || random % 15 === 0) {
        this.showSurveyBar();
      }
    }
  };
})();
