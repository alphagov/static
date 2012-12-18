var GOVUK = GOVUK || {};
GOVUK.UserSatisfaction = GOVUK.UserSatisfaction || function () {};

GOVUK.UserSatisfaction.prototype = (function () {
  var cookie = new GOVUK.Cookie();

  return {
    cookieNameSeenBar: "seenSurveyBar",
    cookieNameTakenSurvey: "takenUserSatisfactionSurvey",

    setCookieSeenBar: function () { cookie.write(this.cookieNameSeenBar, true); },
    setCookieTakenSurvey: function () { cookie.write(this.cookieNameTakenSurvey, true); }
  };
})();
