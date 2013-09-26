(function() {
  "use strict";

  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var userSatisfaction = {
    cookieNameTakenSurvey: "govuk_takenUserSatisfactionSurvey",
    setCookieTakenSurvey: function () {
      GOVUK.cookie(userSatisfaction.cookieNameTakenSurvey, true, { days: 30*4 });
      $("#user-satisfaction-survey").removeClass('visible');
    },
    appendCurrentPathToSurveyUrl: function() {
      var takeSurvey = document.getElementById('take-survey');
      var surveyUrlWithPath = takeSurvey.getAttribute('href') + "?c=" + root.location.pathname;
      takeSurvey.setAttribute('href', surveyUrlWithPath);
    },
    setEventHandlers: function () {
      var $noThanks = $('#survey-no-thanks');
      var $takeSurvey = $('#take-survey');

      $noThanks.click(function (e) {
        userSatisfaction.setCookieTakenSurvey();
        e.stopPropagation();
        return false;
      });
      $takeSurvey.click(userSatisfaction.setCookieTakenSurvey);
    },
    showSurveyBar: function () {
      if (GOVUK.cookie(userSatisfaction.cookieNameTakenSurvey) === "true" ||
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
      if ($('#user-satisfaction-survey').length <= 0) {
        return;
      }
      if (Math.floor(Math.random() * 50) === 0) {
        userSatisfaction.showSurveyBar();
      }
    }
  };

  root.GOVUK.userSatisfaction = userSatisfaction;
}).call(this);
