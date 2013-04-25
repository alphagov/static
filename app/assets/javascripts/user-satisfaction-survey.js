(function() {
  "use strict";

  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var userSatisfaction = {
    cookieNameTakenSurvey: "govuk_takenUserSatisfactionSurvey",
    setCookieTakenSurvey: function () {
      setCookie(userSatisfaction.cookieNameTakenSurvey, true, 30*4);

      var survey = document.getElementById("user-satisfaction-survey");
      survey.style.display = "none";
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
      takeSurvey.click(userSatisfaction.appendCurrentPathToSurveyUrl);
    },
    showSurveyBar: function () {
      if (getCookie(userSatisfaction.cookieNameTakenSurvey) === "true") {
        return;
      }
      userSatisfaction.setEventHandlers();

      var survey = document.getElementById("user-satisfaction-survey");
      var isMobileUA = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile|Opera\ Mini)/);
      var isMobileScreen = screen.availWidth < 900;

      if (survey && !userSatisfaction.otherNotificationVisible() && !isMobileUA && !isMobileScreen) {
        survey.style.display = "block";
      }
    },
    otherNotificationVisible: function() {
      return $('#banner-notification:visible, #global-cookie-message:visible, #global-browser-prompt:visible').length > 0;
    },
    randomlyShowSurveyBar: function () {
      if (Math.floor(Math.random() * 8) === 0) {
        userSatisfaction.showSurveyBar();
      }
    }
  }
  root.GOVUK.userSatisfaction = userSatisfaction;
}).call(this);
