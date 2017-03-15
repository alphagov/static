(function() {
  "use strict";

  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

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
        startTime: new Date("April 3, 2017 10:00:00").getTime(),
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

    getUrlSurveyTemplate: function() {
      var $urlSurveyTemplate = $('#url-survey-template');
      return {
        template: $urlSurveyTemplate.text(),
        title: $urlSurveyTemplate.data('defaultTitle'),
        noThanks: $urlSurveyTemplate.data('defaultNoThanks'),
        surveyCta: $urlSurveyTemplate.data('defaultSurveyCta'),
        surveyCtaPostscript: $urlSurveyTemplate.data('defaultSurveyCtaPostscript'),
        render: function(survey, surveyUrl) {
          var templateArgs = (survey.templateArguments || {}),
            surveyUrl = survey.url;

          // Survey monkey can record the URL of the survey link if passed
          // through as a query param
          if ((/surveymonkey/.test(surveyUrl)) && (surveyUrl.indexOf('?c=') === -1)) {
            surveyUrl += "?c=" + userSurveys.currentPath();
          }

          return this.template.
            replace(/\{\{title\}\}/g, templateArgs.title || this.title).
            replace(/\{\{noThanks\}\}/g, templateArgs.noThanks || this.noThanks).
            replace(/\{\{surveyCta\}\}/g, templateArgs.surveyCta || this.surveyCta).
            replace(/\{\{surveyCtaPostscript\}\}/g, templateArgs.surveyCtaPostscript || this.surveyCtaPostscript).
            replace(/\{\{surveyUrl\}\}/g, surveyUrl);
        }
      };
    },

    getEmailSurveyTemplate: function() {
      var $emailSurveyTemplate = $('#email-survey-template');
      return {
        template: $emailSurveyTemplate.text(),
        title: $emailSurveyTemplate.data('defaultTitle'),
        noThanks: $emailSurveyTemplate.data('defaultNoThanks'),
        surveyCta: $emailSurveyTemplate.data('defaultSurveyCta'),
        surveyFormTitle: $emailSurveyTemplate.data('defaultSurveyFormTitle'),
        surveyFormEmailLabel:$emailSurveyTemplate.data('defaultSurveyFormEmailLabel'),
        surveyFormCta: $emailSurveyTemplate.data('defaultSurveyFormCta'),
        surveyFormCtaPostscript: $emailSurveyTemplate.data('defaultSurveyFormCtaPostscript'),
        surveySuccess: $emailSurveyTemplate.data('defaultSurveySuccess'),
        surveyFailure: $emailSurveyTemplate.data('defaultSurveyFailure'),
        render: function(survey) {
          var templateArguments = (survey.templateArguments || {});

          return this.template.
            replace(/\{\{title\}\}/g, templateArguments.title || this.title).
            replace(/\{\{noThanks\}\}/g, templateArguments.noThanks || this.noThanks).
            replace(/\{\{surveyCta\}\}/g, templateArguments.surveyCta || this.surveyCta).
            replace(/\{\{surveyFormTitle\}\}/g, templateArguments.surveyFormTitle || this.surveyFormTitle).
            replace(/\{\{surveyFormEmailLabel\}\}/g, templateArguments.surveyFormEmailLabel || this.surveyFormEmailLabel).
            replace(/\{\{surveyFormCta\}\}/g, templateArguments.surveyFormCta || this.surveyFormCta).
            replace(/\{\{surveyFormCtaPostscript\}\}/g, templateArguments.surveyFormCtaPostscript || this.surveyFormCtaPostscript).
            replace(/\{\{surveySuccess\}\}/g, templateArguments.surveySuccess || this.surveySuccess).
            replace(/\{\{surveyFailure\}\}/g, templateArguments.surveyFailure || this.surveyFailure).
            replace(/\{\{surveyId\}\}/g, survey.identifier).
            replace(/\{\{surveySource\}\}/g, userSurveys.currentPath());
        }
      };
    },

    getActiveSurvey: function(defaultSurvey, smallSurveys) {
      var activeSurvey = defaultSurvey;

      $.each(smallSurveys, function(_index, survey) {
        if (userSurveys.surveyIsAllowedToRunBasedOnTimes(survey) && userSurveys.surveyIsAllowedToRunBasedOnActiveWhen(survey)) {
          activeSurvey = survey;
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
      var urlSurveyTemplate = userSurveys.getUrlSurveyTemplate();

      surveyContainer.append(urlSurveyTemplate.render(survey));

      userSurveys.setURLSurveyEventHandlers(survey);
    },

    displayEmailSurvey: function(survey, surveyContainer) {
      var emailSurveyTemplate = userSurveys.getEmailSurveyTemplate();

      surveyContainer.append(emailSurveyTemplate.render(survey));

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

    pathMatch: function(paths) {
      if (paths === undefined) {
        return false;
      } else {
        var pathMatchingExpr = new RegExp(
          $.map($.makeArray(paths), function(path, _i) {
            if (/[\^\$]/.test(path)) {
              return "(?:"+path+")"
            } else {
              return "(?:\/"+path+"(?:\/|$))";
            }
          }).join("|")
        );
        return pathMatchingExpr.test(userSurveys.currentPath());
      }
    },

    breadcrumbMatch: function(breadcrumbs) {
      if (breadcrumbs === undefined) {
        return false;
      } else {
        var breadcrumbMatchingExpr = new RegExp($.makeArray(breadcrumbs).join("|"), 'i');
        return breadcrumbMatchingExpr.test(userSurveys.currentBreadcrumb());
      }
    },

    sectionMatch: function(sections) {
      if (sections === undefined) {
        return false;
      } else {
        var sectionMatchingExpr = new RegExp($.makeArray(sections).join("|"), 'i');
        return sectionMatchingExpr.test(userSurveys.currentSection());
      }
    },

    organisationMatch: function(organisations) {
      if (organisations === undefined) {
        return false;
      } else {
        var orgMatchingExpr = new RegExp($.makeArray(organisations).join("|"));
        return orgMatchingExpr.test(userSurveys.currentOrganisation());
      }
    },

    surveyIsAllowedToRunBasedOnTimes: function(survey) {
      var startTime = new Date(survey.startTime).getTime(),
        endTime = new Date(survey.endTime).getTime(),
        now = userSurveys.currentTime();

      return now >= startTime && now <= endTime;
    },

    surveyIsAllowedToRunBasedOnActiveWhen: function(survey) {
      if (survey.hasOwnProperty('activeWhen')) {
        if (survey.activeWhen.hasOwnProperty('path') ||
            survey.activeWhen.hasOwnProperty('breadcrumb') ||
            survey.activeWhen.hasOwnProperty('section') ||
            survey.activeWhen.hasOwnProperty('organisation')) {

          var matchType = (survey.activeWhen.matchType || 'include'),
            matchByPath = userSurveys.pathMatch(survey.activeWhen.path),
            matchByBreadcrumb = userSurveys.breadcrumbMatch(survey.activeWhen.breadcrumb),
            matchBySection = userSurveys.sectionMatch(survey.activeWhen.section),
            matchByOrganisation = userSurveys.organisationMatch(survey.activeWhen.organisation),
            pageMatches = (matchByPath || matchByBreadcrumb || matchBySection || matchByOrganisation);

          if (matchType !== 'exclude') {
            return pageMatches;
          } else {
            return !pageMatches;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    },

    currentTime: function() { return new Date().getTime(); },
    currentPath: function() { return window.location.pathname; },
    currentBreadcrumb: function() { return $('.govuk-breadcrumbs').text() || ""; },
    currentSection: function() { return $('meta[name="govuk:section"]').attr('content') || ""; },
    currentOrganisation: function() { return $('meta[name="govuk:analytics:organisations"]').attr('content') || ""; }
  };

  root.GOVUK.userSurveys = userSurveys;
}).call(this);

