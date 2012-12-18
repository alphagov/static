var GOVUK = GOVUK || {};
GOVUK.UserSatisfaction = GOVUK.UserSatisfaction || function () {
  this.showSurveyBar();
};

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
      document.getElementByID("user-satisfaction-survey").style.display = "block";
    }
  };
})();
