var GOVUK = GOVUK || {};
GOVUK.UserSatisfaction = GOVUK.UserSatisfaction || function () {
};

GOVUK.UserSatisfaction.prototype = {
  cookieNameSeenBar: "seenSurveyBar",
  cookieNameTakenSurvey: "takenUserSatisfactionSurvey",

  setCookieSeenBar: function () { return Alphagov.write_cookie(this.cookieNameSeenBar, true); },
  setCookieTakenSurvey: function () { return Alphagov.write_cookie(this.cookieNameTakenSurvey, true); }
};
