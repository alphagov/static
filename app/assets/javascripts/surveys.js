(function() {
  "use strict";

  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var userSurveys = {
  init: function() {
      var activeSurvey = userSurveys.getActiveSurvey();
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

    getActiveSurvey: function() {
      var activeSurvey = userSurveys.getDefaultSurvey();

      $.each(userSurveys.getOtherSurveys(), function(_index, survey) {
        if (survey !== undefined) {
          if (userSurveys.surveyIsAllowedToRunBasedOnTimes(survey) && userSurveys.surveyIsAllowedToRunBasedOnActiveWhen(survey)) {
            activeSurvey = survey;
          }
        }
      });

      return activeSurvey;
    },

    getDefaultSurvey: function() {
      try {
        return JSON.parse($('#user-satisfaction-survey-container [data-survey-default]').text());
      } catch (e) {
        return undefined;
      }
    },

    getOtherSurveys: function() {
      return $('#user-satisfaction-survey-container [data-survey]').map(function(_idx, surveyDefinition) {
        try {
          return JSON.parse(surveyDefinition.text);
        } catch (e) {
          return undefined;
        }
      });
    },

    displaySurvey: function(survey) {
      if (survey === undefined) { return; }

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
      if (survey === undefined) { return; }

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
      if (paths === undefined) { return false; }

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
    },

    breadcrumbMatch: function(breadcrumbs) {
      if (breadcrumbs === undefined) { return false; }

      var breadcrumbMatchingExpr = new RegExp($.makeArray(breadcrumbs).join("|"), 'i');
      return breadcrumbMatchingExpr.test(userSurveys.currentBreadcrumb());
    },

    sectionMatch: function(sections) {
      if (sections === undefined) { return false; }

      var sectionMatchingExpr = new RegExp($.makeArray(sections).join("|"), 'i');
      return sectionMatchingExpr.test(userSurveys.currentSection());
    },

    organisationMatch: function(organisations) {
      if (organisations === undefined) { return false; }

      var orgMatchingExpr = new RegExp($.makeArray(organisations).join("|"));
      return orgMatchingExpr.test(userSurveys.currentOrganisation());
    },

    surveyIsAllowedToRunBasedOnTimes: function(survey) {
      var startTime = new Date(survey.startTime).getTime(),
        endTime = new Date(survey.endTime).getTime(),
        now = userSurveys.currentTime();

      return now >= startTime && now <= endTime;
    },

    surveyIsAllowedToRunBasedOnActiveWhen: function(survey) {
      if (!survey.hasOwnProperty('activeWhen')) { return true; }

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
    },

    currentTime: function() { return new Date().getTime(); },
    currentPath: function() { return window.location.pathname; },
    currentBreadcrumb: function() { return $('.govuk-breadcrumbs').text() || ""; },
    currentSection: function() { return $('meta[name="govuk:section"]').attr('content') || ""; },
    currentOrganisation: function() { return $('meta[name="govuk:analytics:organisations"]').attr('content') || ""; }
  };

  root.GOVUK.userSurveys = userSurveys;
}).call(this);

