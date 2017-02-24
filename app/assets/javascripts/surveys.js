(function() {
  "use strict";

  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var URL_SURVEY_TEMPLATE = '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
                            '  <div class="wrapper">' +
                            '    <h1>Tell us what you think of GOV.UK</h1>' +
                            '    <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">No thanks</a></p>' +
                            '    <p><a href="javascript:void()" id="take-survey" target="_blank" rel="noopener noreferrer">Take the 3 minute survey</a> This will open a short survey on another website</p>' +
                            '  </div>' +
                            '</section>',
    EMAIL_SURVEY_TEMPLATE = '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
                            '  <div id="email-survey-pre" class="wrapper">' +
                            '    <h1>Tell us what you think of GOV.UK</h1>' +
                            '    <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">No thanks</a></p>' +
                            '    <p><a href="#email-survey-form" id="email-survey-open" rel="noopener noreferrer">Your feedback will help us improve this website</a></p>' +
                            '  </div>' +
                            '  <form id="email-survey-form" action="/contact/govuk/email-survey-signup" method="post" class="wrapper js-hidden" aria-hidden="true">' +
                            '    <div id="feedback-prototype-form">'+
                            '      <h1>We\'d like to hear from you</h1>'+
                            '      <p class="right"><a href="#email-survey-cancel" id="email-survey-cancel">No thanks</a></p>' +
                            '      <label for="email">Tell us your email address and we\'ll send you a link to a quick feedback form.</label>' +
                            '      <input name="email_survey_signup[survey_id]" type="hidden" value="">' +
                            '      <input name="email_survey_signup[survey_source]" type="hidden" value="">' +
                            '      <input name="email_survey_signup[email_address]" type="text" placeholder="Your email address">' +
                            '      <div class="actions">' +
                            '        <button class="button">Send</button>' +
                            '        <p class="button-info">We won\'t store your email address or share it with anyone</span>' +
                            '      </div>' +
                            '    </div>' +
                            '  </form>' +
                            '  <div id="email-survey-post" class="wrapper js-hidden" aria-hidden="true">' +
                            '    <p>Thanks, we\'ve sent you an email with a link to the survey.</p>' +
                            '  </div>' +
                            '</section>';

  /* This data structure is explained in `doc/surveys.md` */
  var userSurveys = {
    defaultSurvey: {
      url: 'https://www.surveymonkey.com/s/2MRDLTW',
      identifier: 'user_satisfaction_survey',
      frequency: 50,
      surveyType: 'url',
    },
    smallSurveys: [
      {
        url: 'https://www.smartsurvey.co.uk/s/6YYKX/',
        identifier: 'ons_survey',
        template: '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
                  '  <div class="wrapper">' +
                  '    <h1>Tell us what you think of GOV.UK</h1>' +
                  '    <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">No thanks</a></p>' +
                  '    <p><a href="javascript:void()" id="take-survey" target="_blank" rel="noopener noreferrer">Give us your feedback on government statistical data</a> This will open a short survey on another website</p>' +
                  '  </div>' +
                  '</section>',
        frequency: 1,
        activeWhen: function() {
          function pathMatches() {
            return /^\/government\/statistics\/?$/.test(userSurveys.currentPath());
          }

          return pathMatches();
        },
        surveyType: 'url',
        startTime: new Date("January 25, 2017").getTime(),
        endTime: new Date("February 27, 2017 23:59:59").getTime()
      }
    ],

    init: function() {
      var activeSurvey = userSurveys.getActiveSurvey(userSurveys.defaultSurvey, userSurveys.smallSurveys);
      if (userSurveys.isSurveyToBeDisplayed(activeSurvey)) {
        userSurveys.displaySurvey(activeSurvey);
      }
    },

    getActiveSurvey: function(defaultSurvey, smallSurveys) {
      var activeSurvey = defaultSurvey;

      $.each(smallSurveys, function(_index, survey) {
        if(userSurveys.currentTime() >= survey.startTime && userSurveys.currentTime() <= survey.endTime) {
          if(typeof(survey.activeWhen) === 'function') {
            if(survey.activeWhen()) { activeSurvey = survey; }
          } else {
            activeSurvey = survey;
          }
        }
      });

      return activeSurvey;
    },

    displaySurvey: function(survey) {
      var surveyContainer = $("#user-satisfaction-survey-container");
      if (survey.surveyType === 'email') {
        userSurveys.displayEmailSurvey(survey, surveyContainer);
      } else if ((survey.surveyType === 'url') || (survey.surveyType === undefined)) {
        userSurveys.displayURLSurvey(survey, surveyContainer);
      } else {
        return;
      }
      userSurveys.trackEvent(survey.identifier, 'banner_shown', 'Banner has been shown');
    },

    displayURLSurvey: function(survey, surveyContainer) {
      surveyContainer.append(survey.template || URL_SURVEY_TEMPLATE);

      var $surveyLink = $('#take-survey');
      var surveyUrl = survey.url;

      // Survey monkey can record the URL of the survey link if passed through as a query param
      if ((/surveymonkey/.test(surveyUrl)) && (surveyUrl.indexOf('?c=') === -1)) {
        surveyUrl += "?c=" + root.location.pathname;
      }

      $surveyLink.attr('href', surveyUrl);

      userSurveys.setURLSurveyEventHandlers(survey);
    },

    displayEmailSurvey: function(survey, surveyContainer) {
      surveyContainer.append(survey.template || EMAIL_SURVEY_TEMPLATE);

      var $surveyId = $('#email-survey-form input[name="email_survey_signup[survey_id]"]'),
        $surveySource = $('#email-survey-form input[name="email_survey_signup[survey_source]"]');

      $surveyId.val(survey.identifier);
      $surveySource.val(root.location.pathname);

      userSurveys.setEmailSurveyEventHandlers(survey);
    },

    setEmailSurveyEventHandlers: function(survey) {
      var $emailSurveyOpen = $('#email-survey-open'),
        $emailSurveyCancel = $('#email-survey-cancel'),
        $emailSurveyPre = $('#email-survey-pre'),
        $emailSurveyForm = $('#email-survey-form'),
        $emailSurveyPost = $('#email-survey-post'),
        $noThanks = $('#survey-no-thanks');

      $noThanks.click(function (e) {
        userSurveys.setSurveyTakenCookie(survey);
        userSurveys.hideSurvey(survey);
        userSurveys.trackEvent(survey.identifier, 'banner_no_thanks', 'No thanks clicked');
        e.stopPropagation();
        return false;
      });

      $emailSurveyOpen.click(function (e) {
        userSurveys.trackEvent(survey.identifier, 'email_survey_open', 'Email survey opened');
        $emailSurveyPre.addClass('js-hidden').attr('aria-hidden', 'true');
        $emailSurveyForm.removeClass('js-hidden').attr('aria-hidden', 'false');
        e.stopPropagation();
        return false;
      });

      $emailSurveyCancel.click(function (e) {
        userSurveys.setSurveyTakenCookie(survey);
        userSurveys.hideSurvey(survey);
        userSurveys.trackEvent(survey.identifier, 'email_survey_cancel', 'Email survey cancelled');
        e.stopPropagation();
        return false;
      });

      $emailSurveyForm.submit(function(e) {
        $emailSurveyForm.addClass('js-hidden').attr('aria-hidden', 'true');
        $emailSurveyPost.removeClass('js-hidden').attr('aria-hidden', 'false');
        userSurveys.setSurveyTakenCookie(survey);
        userSurveys.trackEvent(survey.identifier, 'email_survey_taken', 'Email survey taken');
        userSurveys.trackEvent(survey.identifier, 'banner_taken', 'User taken survey');
        e.stopPropagation();
        return false;
      });
    },

    setURLSurveyEventHandlers: function(survey) {
      var $noThanks = $('#survey-no-thanks');
      var $takeSurvey = $('#take-survey');

      $noThanks.click(function (e) {
        userSurveys.setSurveyTakenCookie(survey);
        userSurveys.hideSurvey(survey);
        userSurveys.trackEvent(survey.identifier, 'banner_no_thanks', 'No thanks clicked');
        e.stopPropagation();
        return false;
      });
      $takeSurvey.click(function () {
        userSurveys.setSurveyTakenCookie(survey);
        userSurveys.hideSurvey(survey);
        userSurveys.trackEvent(survey.identifier, 'banner_taken', 'User taken survey');
      });
    },

    isSurveyToBeDisplayed: function(survey) {
      if (userSurveys.pathInBlacklist()) {
        return false;
      } else if (userSurveys.otherNotificationVisible() ||
          GOVUK.cookie(userSurveys.surveyTakenCookieName(survey)) === 'true') {
        return false;
      } else if (userSurveys.userCompletedTransaction()) {
        // We don't want any survey appearing for users who have completed a
        // transaction as they may complete the survey with the department's
        // transaction in mind as opposed to the GOV.UK content.
        return false;
      } else if ($('#user-satisfaction-survey-container').length <= 0) {
        return false;
      } else if (userSurveys.randomNumberMatches(survey.frequency)) {
        return true;
      } else {
        return false;
      }
    },

    pathInBlacklist: function() {
      var blackList = new RegExp('^/(?:'
        + /service-manual/.source
        // add more blacklist paths in the form:
        // + /|path-to\/blacklist/.source
        + ')(?:\/|$)'
      );
      return blackList.test(userSurveys.currentPath());
    },

    userCompletedTransaction: function() {
      var path = userSurveys.currentPath();

      function stringContains(str, substr) {
        return str.indexOf(substr) > -1;
      }

      if (stringContains(path, "/done") ||
          stringContains(path, "/transaction-finished") ||
          stringContains(path, "/driving-transaction-finished")) {
            return true;
      }
    },

    trackEvent: function (identifier, action, label) {
      GOVUK.analytics.trackEvent(identifier, action, {
        label: label,
        value: 1,
        nonInteraction: true
      });
    },

    setSurveyTakenCookie: function (survey) {
      GOVUK.cookie(userSurveys.surveyTakenCookieName(survey), true, { days: 30*4 });
    },

    hideSurvey: function(_survey) {
      $("#user-satisfaction-survey").removeClass('visible').attr('aria-hidden', 'true');
    },

    randomNumberMatches: function(frequency) {
      return (Math.floor(Math.random() * frequency) === 0);
    },

    otherNotificationVisible: function() {
      var notificationIds = [
        '#banner-notification:visible',
        '#global-cookie-message:visible',
        '#global-browser-prompt:visible',
        '#taxonomy-survey:visible'
      ]
      return $(notificationIds.join(', ')).length > 0;
    },

    surveyTakenCookieName: function(survey) {
      //user_satisfaction_survey => takenUserSatisfactionSurvey
      var cookieStr = "taken_" + survey.identifier;
      var cookieStub = cookieStr.replace(/(\_\w)/g, function(m){return m[1].toUpperCase();});
      return "govuk_" + cookieStub;
    },

    currentTime: function() { return new Date().getTime(); },
    currentPath: function() { return window.location.pathname; }
  };

  root.GOVUK.userSurveys = userSurveys;
}).call(this);

