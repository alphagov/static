(function() {
  "use strict";

  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var URL_SURVEY_TEMPLATE = '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
                            '  <div class="wrapper">' +
                            '    <h1>Help improve GOV.UK</h1>' +
                            '    <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">No thanks</a></p>' +
                            '    <p><a href="javascript:void()" id="take-survey" target="_blank" rel="noopener noreferrer">Answer some questions about yourself to join the research community</a> This link opens in a new tab.</p>' +
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
                            '        <button type="submit">Send</button>' +
                            '        <p class="button-info">We won\'t store your email address or share it with anyone</span>' +
                            '      </div>' +
                            '    </div>' +
                            '  </form>' +
                            '  <div id="email-survey-post-success" class="wrapper js-hidden" aria-hidden="true">' +
                            '    <p>Thanks, we\'ve sent you an email with a link to the survey.</p>' +
                            '  </div>' +
                            '  <div id="email-survey-post-failure" class="wrapper js-hidden" aria-hidden="true">' +
                            '    <p>Sorry, we’re unable to send you an email right now.  Please try again later.</h2>' +
                            '  </div>' +
                            '</section>';

  /* This data structure is explained in `doc/surveys.md` */
  var userSurveys = {
    defaultSurvey: {
      url: 'https://www.smartsurvey.co.uk/s/gov-uk',
      identifier: 'user_satisfaction_survey',
      frequency: 50,
      surveyType: 'url',
    },
    smallSurveys: [
      {
        identifier: 'govuk_email_survey_t02',
        frequency: 10,
        activeWhen: function() {
          function breadcrumbExclude() {
            var text = $('.govuk-breadcrumbs').text() || "";
            return (/Education/i.test(text) || /Childcare/i.test(text) || /Schools/i.test(text));
          }

          function sectionExclude() {
            var sectionName = $('meta[name="govuk:section"]').attr('content');
            return (/education/i.test(sectionName) || /childcare/i.test(sectionName) || /schools/i.test(sectionName));
          }

          function organisationExclude() {
            var orgMatchingExpr = /<D6>|<D106>|<D109>|<EA243>|<EA86>|<EA242>|<EA541>/;
            var metaText = $('meta[name="govuk:analytics:organisations"]').attr('content') || "";
            return orgMatchingExpr.test(metaText);
          }

          return !(sectionExclude() || breadcrumbExclude() || organisationExclude());
        },
        surveyType: 'email',
        startTime: new Date("April 3, 2017 10:30:00").getTime(),
        endTime: new Date("April 4, 2017 23:59:59").getTime()
      },
      {
        url: "https://signup.take-part-in-research.service.gov.uk/home?utm_campaign=" + window.location.pathname + "&utm_source=Hold_gov_to_account&utm_medium=gov.uk%20survey&t=GDS",
        identifier: 'mar_ur_panel',
        frequency: 5,
        activeWhen: function() {
          function pathMatches() {
            var pathMatchingExpr = new RegExp('/(?:'
                + /government\/policies/.source
                + /|government\/how-government-works/.source
                + /|make-a-freedom-of-information-request/.source
                + /|government\/collections\/open-government/.source
                + /|government\/publications\/uk-open-government-national-action-plan-2016-18\/uk-open-government-national-action-plan-2016-18/.source
                + /|government\/policies\/government-transparency-and-accountability/.source
                + /|topic\/local-government\/transparency/.source
                + ')'
            );
            return pathMatchingExpr.test(userSurveys.currentPath());
          }

          return (pathMatches());
        },
        surveyType: 'url',
        startTime: new Date("March 20, 2017").getTime(),
        endTime: new Date("April 21, 2017 23:59:59").getTime()
      },
      {
        url: "https://signup.take-part-in-research.service.gov.uk/home?utm_campaign=" + window.location.pathname + "&utm_source=Improve_platform_basics&utm_medium=gov.uk%20survey&t=GDS",
        identifier: 'mar_ur_panel',
        frequency: 5,
        activeWhen: function() {
          function pathMatches() {
            var pathMatchingExpr = new RegExp('/(?:'
                + /government\/world/.source
                + /|government\/world\/australia/.source
                + /|government\/world\/china/.source
                + /|government\/world\/india/.source
                + /|government\/world\/pakistan/.source
                + /|government\/world\/usa/.source
                + ')'
            );
            return pathMatchingExpr.test(userSurveys.currentPath());
          }

          return (pathMatches());
        },
        surveyType: 'url',
        startTime: new Date("March 20, 2017").getTime(),
        endTime: new Date("April 21, 2017 23:59:59").getTime()
      },
      {
        url: "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=Anti_Money_Laundering&utm_source=govukother&utm_medium=gov.uk%20survey&t=HMRC",
        frequency: 5,
        activeWhen: function() {
          function pathMatches() {
            var pathMatchingExpr = /\/government\/publications\/money-laundering-regulations-application-for-registration-mlr100/;

            return pathMatchingExpr.test(userSurveys.currentPath());
          }

          return (pathMatches());
        },
        surveyType: 'url',
        startTime: new Date("March 22, 2017").getTime(),
        endTime: new Date("April 20, 2017 23:59:59").getTime()
      },
      {
        url: "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=P800&utm_source=govukother&utm_medium=gov.uk%20survey&t=HMRC",
        frequency: 5,
        activeWhen: function() {
          function pathMatches() {
            var pathMatchingExpr = /\/claim-tax-refund/;

            return pathMatchingExpr.test(userSurveys.currentPath());
          }

          return (pathMatches());
        },
        surveyType: 'url',
        startTime: new Date("March 22, 2017").getTime(),
        endTime: new Date("April 20, 2017 23:59:59").getTime()
      },
      {
        url: "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=IHT&utm_source=govukother&utm_medium=gov.uk%20survey&t=HMRC",
        frequency: 5,
        activeWhen: function() {
          function pathMatches() {
            var pathMatchingExpr = /\/government\/publications\/inheritance-tax-inheritance-tax-account-iht400/;

            return pathMatchingExpr.test(userSurveys.currentPath());
          }

          return (pathMatches());
        },
        surveyType: 'url',
        startTime: new Date("March 22, 2017").getTime(),
        endTime: new Date("April 20, 2017 23:59:59").getTime()
      },
      {
        url: "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=TAV_C&utm_source=govukother&utm_medium=gov.uk%20survey&t=HMRC",
        frequency: 5,
        activeWhen: function() {
          function pathMatches() {
            var pathMatchingExpr = /\/guidance\/venture-capital-schemes-apply-for-the-enterprise-investment-scheme/;

            return pathMatchingExpr.test(userSurveys.currentPath());
          }

          return (pathMatches());
        },
        surveyType: 'url',
        startTime: new Date("March 22, 2017").getTime(),
        endTime: new Date("April 20, 2017 23:59:59").getTime()
      },
      {
        url: "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=capital_gains&utm_source=govukother&utm_medium=gov.uk%20survey&t=HMRC",
        frequency: 5,
        activeWhen: function() {
          function pathMatches() {
            var pathMatchingExpr = /\/capital-gains-tax/;

            return pathMatchingExpr.test(userSurveys.currentPath());
          }

          return (pathMatches());
        },
        surveyType: 'url',
        startTime: new Date("March 22, 2017").getTime(),
        endTime: new Date("April 20, 2017 23:59:59").getTime()
      }
    ],

    init: function() {
      var activeSurvey = userSurveys.getActiveSurvey(userSurveys.defaultSurvey, userSurveys.smallSurveys);
      if (userSurveys.isSurveyToBeDisplayed(activeSurvey)) {
        $('#global-bar').hide(); // Hide global bar if one is showing
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
        surveyUrl += "?c=" + userSurveys.currentPath();
      }

      $surveyLink.attr('href', surveyUrl);

      userSurveys.setURLSurveyEventHandlers(survey);
    },

    displayEmailSurvey: function(survey, surveyContainer) {
      surveyContainer.append(survey.template || EMAIL_SURVEY_TEMPLATE);

      var $surveyId = $('#email-survey-form input[name="email_survey_signup[survey_id]"]'),
        $surveySource = $('#email-survey-form input[name="email_survey_signup[survey_source]"]');

      $surveyId.val(survey.identifier);
      $surveySource.val(userSurveys.currentPath());

      userSurveys.setEmailSurveyEventHandlers(survey);
    },

    setEmailSurveyEventHandlers: function(survey) {
      var $emailSurveyOpen = $('#email-survey-open'),
        $emailSurveyCancel = $('#email-survey-cancel'),
        $emailSurveyPre = $('#email-survey-pre'),
        $emailSurveyForm = $('#email-survey-form'),
        $emailSurveyPostSuccess = $('#email-survey-post-success'),
        $emailSurveyPostFailure = $('#email-survey-post-failure'),
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
        var successCallback = function() {
          $emailSurveyForm.addClass('js-hidden').attr('aria-hidden', 'true');
          $emailSurveyPostSuccess.removeClass('js-hidden').attr('aria-hidden', 'false');
          userSurveys.setSurveyTakenCookie(survey);
          userSurveys.trackEvent(survey.identifier, 'email_survey_taken', 'Email survey taken');
          userSurveys.trackEvent(survey.identifier, 'banner_taken', 'User taken survey');
        },
        errorCallback = function() {
          $emailSurveyForm.addClass('js-hidden').attr('aria-hidden', 'true');
          $emailSurveyPostFailure.removeClass('js-hidden').attr('aria-hidden', 'false');
        },
        surveyFormUrl = $emailSurveyForm.attr('action');
        // make sure the survey form is a js url
        if (!(/\.js$/.test(surveyFormUrl))) {
          surveyFormUrl += '.js';
        }

        $.ajax({
          type: "POST",
          url: surveyFormUrl,
          dataType: "json",
          data: $emailSurveyForm.serialize(),
          success: successCallback,
          error: errorCallback,
          statusCode: {
            500: errorCallback
          }
        });
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

