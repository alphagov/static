(function() {
  "use strict";

  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var userSatisfaction = {
    TEMPLATE: '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
              '  <div class="wrapper">' +
              '    <h1>Tell us what you think of GOV.UK</h1>' +
              '    <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">No thanks</a></p>' +
              '    <p><a href="javascript:void()" id="take-survey" target="_blank">Take the 3 minute survey</a> This will open a short survey on another website</p>' +
              '  </div>' +
              '</section>',

    cookieNameTakenSurvey: "govuk_takenUserSatisfactionSurvey",
    createEvent: function (action, label) {
      return ['_trackEvent', 'user_satisfaction_survey', action, label, 1, true];
    },
    setCookieTakenSurvey: function () {
      GOVUK.cookie(userSatisfaction.cookieNameTakenSurvey, true, { days: 30*4 });
      $("#user-satisfaction-survey").removeClass('visible').attr('aria-hidden', 'true');
    },
    setEventHandlers: function () {
      var $noThanks = $('#survey-no-thanks');
      var $takeSurvey = $('#take-survey');

      $noThanks.click(function (e) {
        userSatisfaction.setCookieTakenSurvey();
        GOVUK.sendToAnalytics(userSatisfaction.createEvent('banner_no_thanks', 'No thanks clicked'))
        e.stopPropagation();
        return false;
      });
      $takeSurvey.click(function () {
        userSatisfaction.setCookieTakenSurvey()
        GOVUK.sendToAnalytics(userSatisfaction.createEvent('banner_taken', 'User taken survey'))
      });
    },
    showSurveyBar: function () {
      if (GOVUK.cookie(userSatisfaction.cookieNameTakenSurvey) === "true" ||
          userSatisfaction.otherNotificationVisible()) {
        return;
      }

      $("#user-satisfaction-survey-container").append(userSatisfaction.TEMPLATE);

      userSatisfaction.setEventHandlers();
      userSatisfaction.setSurveyUrl();
      GOVUK.sendToAnalytics(userSatisfaction.createEvent('banner_shown', 'Banner has been shown'))
    },
    otherNotificationVisible: function() {
      return $('#banner-notification:visible, #global-cookie-message:visible, #global-browser-prompt:visible').length > 0;
    },
    randomlyShowSurveyBar: function () {
      if ($('#user-satisfaction-survey-container').length <= 0) {
        return;
      }
      if (Math.floor(Math.random() * 50) === 0) {
        userSatisfaction.showSurveyBar();
      }
    },
    setSurveyUrl: function(href) {
      var $surveyLink = $('#take-survey');
      var surveyUrl = $('#user-satisfaction-survey-container').data('survey-url');
      if (surveyUrl.indexOf('?c=') === -1) {
        surveyUrl += "?c=" + root.location.pathname;
      }

      $surveyLink.attr('href', surveyUrl);
    }
  };

  root.GOVUK.userSatisfaction = userSatisfaction;
}).call(this);
