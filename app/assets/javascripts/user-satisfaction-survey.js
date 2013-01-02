var GOVUK = GOVUK || {};
GOVUK.UserSatisfaction = GOVUK.UserSatisfaction || function () {};

GOVUK.UserSatisfaction.prototype = {
  cookieNameSeenBar: "seenSurveyBar",
  cookieNameTakenSurvey: "takenUserSatisfactionSurvey",

  return {
    cookieNameSeenBar: "seenSurveyBar",
    cookieNameTakenSurvey: "takenUserSatisfactionSurvey",

    setCookieSeenBar: function () {
      cookie.write(this.cookieNameSeenBar, true);
    },
    setCookieTakenSurvey: function () {
      cookie.write(this.cookieNameTakenSurvey, true);
    },
    showSurveyBar: function () {
      if (cookie.read(this.cookieNameTakenSurvey) === "true") {
        return;
      }

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
