(function() {
  "use strict";

  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var userSatisfaction = {
    cookieNameTakenSurvey: "govuk_takenUserSatisfactionSurvey",
    setCookieTakenSurvey: function () {
      setCookie(userSatisfaction.cookieNameTakenSurvey, true, 30*4);
      $("#user-satisfaction-survey").removeClass('visible');
    },
    appendCurrentPathToSurveyUrl: function() {
      var takeSurvey = document.getElementById('take-survey');
      var surveyUrlWithPath = takeSurvey.getAttribute('href') + "?c=" + window.location.pathname;
      takeSurvey.setAttribute('href', surveyUrlWithPath);
    },
    setEventHandlers: function () {
      var noThanks = $("#survey-no-thanks");
      var takeSurvey = $("#take-survey");

      noThanks.click(userSatisfaction.setCookieTakenSurvey);
      takeSurvey.click(userSatisfaction.setCookieTakenSurvey);
    },
    showSurveyBar: function () {
      if (getCookie(userSatisfaction.cookieNameTakenSurvey) === "true") {
        return;
      }
      userSatisfaction.setEventHandlers();
      userSatisfaction.appendCurrentPathToSurveyUrl();

      if (!userSatisfaction.otherNotificationVisible()) {
        $("#user-satisfaction-survey").addClass('visible');
      }
    },
    otherNotificationVisible: function() {
      return $('#banner-notification:visible, #global-cookie-message:visible, #global-browser-prompt:visible').length > 0;
    },
    randomlyShowSurveyBar: function () {
      if (Math.floor(Math.random() * 50) === 0) {
        userSatisfaction.showSurveyBar();
      }
    }
  }
  root.GOVUK.userSatisfaction = userSatisfaction;
}).call(this);

$(document).ready(function() {
  var currentURL = window.location.href;

  function stringContains(haystack, needle) {
    return haystack.indexOf(needle) > -1;
  }

  // We don't want the satisfaction survey appearing for users who
  // have completed a transaction as they may complete the survey with
  // the department's transaction in mind as opposed to the GOV.UK content.
  if (!stringContains(currentURL, "gov.uk/done/") &&
      !stringContains(currentURL, "gov.uk/transaction-finished") &&
      !stringContains(currentURL, "gov.uk/driving-transaction-finished")) {
    GOVUK.userSatisfaction.randomlyShowSurveyBar();
  }
});
