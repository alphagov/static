(function() {
  "use strict";

  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var TEMPLATE = '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
                 '  <div class="wrapper">' +
                 '    <h1>Tell us what you think of GOV.UK</h1>' +
                 '    <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">No thanks</a></p>' +
                 '    <p><a href="javascript:void()" id="take-survey" target="_blank">Take the 3 minute survey</a> This will open a short survey on another website</p>' +
                 '  </div>' +
                 '</section>';

  var userSurveys = {
    defaultSurvey: {
      url: 'https://www.surveymonkey.com/s/2MRDLTW',
      analytics_code: 'user_satisfaction_survey',
      template: TEMPLATE,
      frequency: 50,
    },
    smallSurveys: [],

    init: function() {
      var activeSurvey = userSurveys.getActiveSurvey(userSurveys.defaultSurvey, userSurveys.smallSurveys);
      if (userSurveys.shouldSurveyDisplay(activeSurvey)) {
        userSurveys.displaySurvey(activeSurvey);
      }
    },

    getActiveSurvey: function(defaultSurvey, smallSurveys) {
      var activeSurvey = defaultSurvey;

      $.each(smallSurveys, function(_index, survey) {
        if(userSurveys.currentTime() >= survey.startTime && userSurveys.currentTime() <= survey.endTime) {
          activeSurvey = survey;
        }
      });

      return activeSurvey;
    },

    displaySurvey: function(survey) {
      $("#user-satisfaction-survey-container").append(survey.template);
      userSurveys.setEventHandlers(survey);

      var $surveyLink = $('#take-survey');
      var surveyUrl = survey.url;

      if (surveyUrl.indexOf('?c=') === -1) {
        surveyUrl += "?c=" + root.location.pathname;
      }

      $surveyLink.attr('href', surveyUrl);
      userSurveys.trackEvent(survey.analytics_code, 'banner_shown', 'Banner has been shown');
    },

    setEventHandlers: function(survey) {
      var $noThanks = $('#survey-no-thanks');
      var $takeSurvey = $('#take-survey');

      $noThanks.click(function (e) {
        userSurveys.setCookieTakenSurvey();
        userSurveys.trackEvent(survey.analytics_code, 'banner_no_thanks', 'No thanks clicked');
        e.stopPropagation();
        return false;
      });
      $takeSurvey.click(function () {
        userSurveys.setCookieTakenSurvey();
        userSurveys.trackEvent(survey.analytics_code, 'banner_taken', 'User taken survey');
      });
    },

    shouldSurveyDisplay: function(survey) {
      if (userSurveys.otherNotificationVisible() ||
          GOVUK.cookie(userSurveys.cookieNameTakenSurvey) === 'true') {
        return false;
      } else if ($('#user-satisfaction-survey-container').length <= 0) {
        return false;
      } else if (userSurveys.randomNumberMatches(survey.frequency)) {
        return true;
      } else {
        return false;
      }
    },

    trackEvent: function (analytics_code, action, label) {
      GOVUK.analytics.trackEvent(analytics_code, action, {
        label: label,
        value: 1,
        nonInteraction: true
      });
    },

    setCookieTakenSurvey: function () {
      GOVUK.cookie(userSurveys.cookieNameTakenSurvey, true, { days: 30*4 });
      $("#user-satisfaction-survey").removeClass('visible').attr('aria-hidden', 'true');
    },

    randomNumberMatches: function(frequency) {
      return (Math.floor(Math.random() * frequency) === 0);
    },

    otherNotificationVisible: function() {
      return $('#banner-notification:visible, #global-cookie-message:visible, #global-browser-prompt:visible').length > 0;
    },
    cookieNameTakenSurvey: "govuk_takenUserSatisfactionSurvey",
    currentTime: function() { return new Date().getTime(); }
  };

  root.GOVUK.userSurveys = userSurveys;
}).call(this);
