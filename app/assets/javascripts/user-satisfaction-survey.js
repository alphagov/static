var GOVUK = GOVUK || {};
GOVUK.UserSatisfaction = GOVUK.UserSatisfaction || function () {};

GOVUK.UserSatisfaction.prototype = (function () {
  var cookie = new GOVUK.Cookie();

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
      var survey = document.getElementById("user-satisfaction-survey");

      if (survey) {
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
