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
      var surveyUrlWithPath = takeSurvey.getAttribute('href') + "?c=" + root.location.pathname;
      takeSurvey.setAttribute('href', surveyUrlWithPath);
    },
    setEventHandlers: function () {
      var $closePoints = $('#survey-no-thanks, #take-survey');
      $closePoints.click(userStatisfaction.setCookieTakenSurvey);
    },
    showSurveyBar: function () {
      if (getCookie(userSatisfaction.cookieNameTakenSurvey) === "true" ||
          userSatisfaction.otherNotificationVisible()) {
        return;
      }

      userSatisfaction.setEventHandlers();
      userSatisfaction.appendCurrentPathToSurveyUrl();

      $("#user-satisfaction-survey").addClass('visible');
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
