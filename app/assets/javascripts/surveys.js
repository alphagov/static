// = require_self

(function ($) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  var takeSurveyLink = function (text, className) {
    className = className ? 'class="' + className + '"' : ''
    return '<a ' + className + ' href="{{surveyUrl}}" id="take-survey" target="_blank" rel="noopener noreferrer">' + text + '</a>'
  }

  var templateBase = function (children) {
    return (
      '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
      '  <div class="survey-wrapper">' +
      '    <a class="survey-close-button" href="#user-survey-cancel" aria-labelledby="survey-title user-survey-cancel" id="user-survey-cancel" role="button">Close</a>' +
      '    <h2 class="survey-title" id="survey-title">{{title}}</h2>' +
           children +
      '  </div>' +
      '</section>'
    )
  }

  var URL_SURVEY_TEMPLATE = templateBase(
    '<p>' +
      takeSurveyLink('{{surveyCta}}', 'survey-primary-link') +
    ' <span class="postscript-cta">{{surveyCtaPostscript}}</span>' +
    '</p>'
  )

  var EMAIL_SURVEY_TEMPLATE = templateBase(
    '<div id="email-survey-pre">' +
    '  <a class="survey-primary-link" href="#email-survey-form" id="email-survey-open" rel="noopener noreferrer" role="button" aria-expanded="false">' +
    '    {{surveyCta}}' +
    '  </a>' +
    '</div>' +
    '<form id="email-survey-form" action="/contact/govuk/email-survey-signup" method="post" class="js-hidden" aria-hidden="true">' +
    '  <div class="survey-inner-wrapper">' +
    '    <div id="survey-form-description" class="survey-form-description">{{surveyFormDescription}}' +
    '      <br> {{surveyFormCtaPostscript}}' +
    '    </div>' +
    '    <label class="survey-form-label" for="survey-email-address">' +
    '      Email Address' +
    '    </label>' +
    '    <input name="email_survey_signup[survey_id]" type="hidden" value="{{surveyId}}">' +
    '    <input name="email_survey_signup[survey_source]" type="hidden" value="{{surveySource}}">' +
    '    <input name="email_survey_signup[ga_client_id]" type="hidden" value="{{gaClientId}}">' +
    '    <input class="survey-form-input" name="email_survey_signup[email_address]" id="survey-email-address" type="text" aria-describedby="survey-form-description">' +
    '    <button class="survey-form-button" type="submit">{{surveyFormCta}}</button>' +
         takeSurveyLink('{{surveyFormNoEmailInvite}}') +
    '  </div>' +
    '</form>' +
    '<div id="email-survey-post-success" class="js-hidden" aria-hidden="true" tabindex="-1">' +
    '  {{surveySuccess}}' +
    '</div>' +
    '<div id="email-survey-post-failure" class="js-hidden" aria-hidden="true" tabindex="-1">' +
    '  {{surveyFailure}}' +
    '</div>'
  )
  var SURVEY_SEEN_TOO_MANY_TIMES_LIMIT = 2
  var MAX_MOBILE_WIDTH = "(max-width: 800px)"

  var hmrcSurveysFeb2018Url = function () {
    var path = window.location.pathname
    switch (true) {
      case /^\/correct-your-business-rates(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=VOAgov&utm_source=Other&utm_medium=gov.uk&t=HMRC&id=125'
      case /^\/guidance\/fulfilment-house-due-diligence-scheme(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=FHDDSgov&utm_source=Other&utm_medium=other&t=HMRC&id=99'
      case /^\/guidance\/soft-drinks-industry-levy(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=SoftDrinksGOV&utm_source=Other&utm_medium=other&t=HMRC&id=100'
      case /^\/guidance\/tell-hmrc-if-youve-underpaid-national-minimum-wage-in-the-social-care-sector(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=MinWageSocialCareGOV&utm_source=Other&utm_medium=other&t=HMRC&id=101'
      case /^\/child-benefit(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=ChildBenefitGOV&utm_source=Other&utm_medium=other&t=HMRC&id=26'
      case /^\/tax-overpayments-and-underpayments(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=OverpayUnderpayGOV&utm_source=Other&utm_medium=other&t=HMRC&id=27'
      case /^\/pay-tax-debit-credit-card(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=onlinepaymentsGOV&utm_source=Other&utm_medium=other&t=HMRC&id=32'
      case /^\/eori(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=EORIgov&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=61'
      case /^\/starting-to-import(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=EORIgov&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=61'
      case /^\/starting-to-export(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=EORIgov&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=61'
      case /^\/duty-deferment-statements(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=DDESgov&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=60'
      case /^\/government\/publications\/notice-101-deferring-duty-vat-and-other-charges\/notice-101-deferring-duty-vat-and-other-charges(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=DDESgov&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=61'
      case /^\/government\/publications\/notice-100-customs-flexible-accounting-system\/notice-100-customs-flexible-accounting-system(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=DDESgov&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=62'
      case /^\/working-tax-credit(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=workingtaxcreditGOV&utm_source=Other&utm_medium=other&t=HMRC&id=12'
      case /^\/guidance\/money-laundering-regulations-register-with-hmrc(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=MoneyLaundering RegulationsGOV&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=45'
      case /^\/child-tax-credit(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=ChildTaxCreditGOV&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=10'
      case /^\/check-state-pension(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=checkstatepensionGOV&utm_source=Other&utm_medium=other&t=HMRC&id=46'
      case /^\/apply-marriage-allowance(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=marriageallowanceGOV&utm_source=Other&utm_medium=other&t=HMRC&id=47'
      case /^\/stamp-duty-land-tax(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=StampDutyLandTaxGOV&utm_source=Other&utm_medium=other&t=HMRC&id=48'
      case /^\/guidance\/pay-apprenticeship-levy(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=Apprenticeship Levy&utm_source=Money_and_tax&utm_medium=gov.uk&t=HMRC&id=7'
      case /^\/update-company-car-details(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=CompanyCarGOV&utm_source=Other&utm_medium=other&t=HMRC&id=49'
      case /^\/guidance\/paying-your-employees-expenses-and-benefits-through-your-payroll(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=PayrollExpensesBenefitsGOV&utm_source=Other&utm_medium=other&t=HMRC&id=50'
      case /^\/guidance\/pension-schemes-protect-your-lifetime-allowance(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=PensionSchemeLifetimeAllowanceGOV&utm_source=Other&utm_medium=other&t=HMRC&id=51'
      case /^\/send-employment-intermediary-report(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=EmploymentIntermediaryReportGOV&utm_source=Other&utm_medium=other&t=HMRC&id=52'
      case /^\/guidance\/tell-hmrc-about-your-employment-related-securities(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=EmploymentRelatedSecuritiesGOV&utm_source=Other&utm_medium=other&t=HMRC&id=53'
      case /^\/guidance\/pension-administrators-check-a-members-gmp(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=PensionAdministratorsGMPGOV&utm_source=Other&utm_medium=other&t=HMRC&id=54'
      case /^\/simple-assessment(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=simpleassessmentGOV&utm_source=Other&utm_medium=other&t=HMRC&id=55'
      case /^\/tax-on-your-private-pension\/lifetime-allowance(?:\/|$)/.test(path) : return 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=PrivatePensionContributionsGOV&utm_source=govukother&utm_medium=gov.uk&t=HMRC&id=105'
      default: return ''
    }
  }

  /* This data structure is explained in `doc/surveys.md` */
  var userSurveys = {
    defaultSurvey: {
      url: 'https://www.smartsurvey.co.uk/s/gov_uk?c={{currentPath}}',
      identifier: 'user_satisfaction_survey',
      frequency: 6,
      surveyType: 'email'
    },
    smallSurveys: [
      {
        identifier: 'hmrc_february',
        surveyType: 'url',
        frequency: 5,
        startTime: new Date('February 14, 2018').getTime(),
        endTime: new Date('May 14, 2018').getTime(),
        url: hmrcSurveysFeb2018Url(),
        templateArgs: {
          title: 'Get involved in making government services better',
          surveyCta: 'Take the 3 minute survey.',
          surveyCtaPostscript: 'This will open a short survey on another website.'
        },
        activeWhen: {
          path: [
            '^/correct-your-business-rates(?:/|$)',
            '^/guidance/fulfilment-house-due-diligence-scheme(?:/|$)',
            '^/guidance/soft-drinks-industry-levy(?:/|$)',
            '^/guidance/tell-hmrc-if-youve-underpaid-national-minimum-wage-in-the-social-care-sector(?:/|$)',
            '^/child-benefit(?:/|$)',
            '^/tax-overpayments-and-underpayments(?:/|$)',
            '^/pay-tax-debit-credit-card(?:/|$)',
            '^/eori(?:/|$)',
            '^/starting-to-import(?:/|$)',
            '^/starting-to-export(?:/|$)',
            '^/duty-deferment-statements(?:/|$)',
            '^/government/publications/notice-101-deferring-duty-vat-and-other-charges/notice-101-deferring-duty-vat-and-other-charges(?:/|$)',
            '^/government/publications/notice-100-customs-flexible-accounting-system/notice-100-customs-flexible-accounting-system(?:/|$)',
            '^/working-tax-credit(?:/|$)',
            '^/guidance/money-laundering-regulations-register-with-hmrc(?:/|$)',
            '^/child-tax-credit(?:/|$)',
            '^/check-state-pension(?:/|$)',
            '^/apply-marriage-allowance(?:/|$)',
            '^/stamp-duty-land-tax(?:/|$)',
            '^/guidance/pay-apprenticeship-levy(?:/|$)',
            '^/update-company-car-details(?:/|$)',
            '^/guidance/paying-your-employees-expenses-and-benefits-through-your-payroll(?:/|$)',
            '^/guidance/pension-schemes-protect-your-lifetime-allowance(?:/|$)',
            '^/send-employment-intermediary-report(?:/|$)',
            '^/guidance/tell-hmrc-about-your-employment-related-securities(?:/|$)',
            '^/guidance/pension-administrators-check-a-members-gmp(?:/|$)',
            '^/simple-assessment(?:/|$)',
            '^/tax-on-your-private-pension/lifetime-allowance(?:/|$)'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'CTTUK_iteration 8',
        surveyType: 'url',
        frequency: 3,
        startTime: new Date('March 2, 2018').getTime(),
        endTime: new Date('March 6, 2018').getTime(),
        url: 'https://GDSUserResearch.optimalworkshop.com/treejack/82p1e0a6-0-0-1-0-0-1?c={{currentPath}}',
        templateArgs: {
          title: 'Help us make things easier to find on GOV.UK',
          surveyCta: 'Answer 2 quick questions.',
          surveyCtaPostscript: 'This activity will open in a separate window.'
        },
        activeWhen: {
          path: [
            '^/browse/visas-immigration(?:/|$)',
            '^/call-charges$',
            '^/when-do-the-clocks-change$',
            '^/guidance/immigration-rules$'
          ],
          organisation: [
            '<OT554>', // UK Visas and Immigration
            '<PB263>', // Office of the Immigration Services Commissioner
            '<PB275>', // Migration Advisory Committee
            '<OT535>', // Border Force
            '<OT1069>', // Immigration Enforcement
            '<EA67>', // UK Border Agency
            '<OT885>', // Identity and Passport Service
            '<EA66>', // HM Passport Office
            '<OT284>' // Independent Chief Inspector of Borders and Immigration
          ]
        },
        allowedOnMobile: true
      }
    ],

    init: function () {
      if (userSurveys.canShowAnySurvey()) {
        var activeSurvey = userSurveys.getActiveSurvey(userSurveys.defaultSurvey, userSurveys.smallSurveys)
        if (activeSurvey !== undefined) {
          userSurveys.displaySurvey(activeSurvey)
        }
      }
    },

    canShowAnySurvey: function () {
      if (userSurveys.pathInBlacklist()) {
        return false
      } else if (userSurveys.otherNotificationVisible()) {
        return false
      } else if (userSurveys.userCompletedTransaction()) {
        // We don't want any survey appearing for users who have completed a
        // transaction as they may complete the survey with the department's
        // transaction in mind as opposed to the GOV.UK content.
        return false
      } else if ($('#user-satisfaction-survey-container').length <= 0) {
        return false
      } else {
        return true
      }
    },

    processTemplate: function (args, template) {
      $.each(args, function (key, value) {
        template = template.replace(
          new RegExp('\{\{' + key + '\}\}', 'g'),
          value
        )
      })
      return template
    },

    getUrlSurveyTemplate: function () {
      return {
        render: function(survey) {
          var defaultUrlArgs = {
            title: 'Tell us what you think of GOV.UK',
            surveyCta: 'Take the 3 minute survey',
            surveyCtaPostscript: 'This will open a short survey on another website',
            surveyUrl: userSurveys.addParamsToURL(survey.url),
          }
          var mergedArgs = $.extend(defaultUrlArgs, survey.templateArgs)
          return userSurveys.processTemplate(mergedArgs, URL_SURVEY_TEMPLATE)
        }
      }
    },

    getEmailSurveyTemplate: function () {
      return {
        render: function(survey) {
          var defaultEmailArgs = {
            title: 'Tell us what you think of GOV.UK',
            surveyCta: 'Take a short survey to give us your feedback',
            surveyFormDescription: 'We’ll send you a link to a feedback form. It only takes 2 minutes to fill in.',
            surveyFormCta: 'Send me the survey',
            surveyFormCtaPostscript: 'Don’t worry: we won’t send you spam or share your email address with anyone.',
            surveyFormNoEmailInvite: 'Don’t have an email address?',
            surveySuccess: 'Thanks, we’ve sent you an email with a link to the survey.',
            surveyFailure: 'Sorry, we’re unable to send you an email right now. Please try again later.',
            surveyId: survey.identifier,
            surveySource: userSurveys.currentPath(),
            surveyUrl: userSurveys.addParamsToURL(survey.url),
            gaClientId: GOVUK.analytics.gaClientId,
          }
          var mergedArgs = $.extend(defaultEmailArgs, survey.templateArgs)
          return userSurveys.processTemplate(mergedArgs, EMAIL_SURVEY_TEMPLATE)
        }
      }
    },

    getActiveSurveys: function (surveys) {
      return $.grep(surveys, function (survey, _index) {
        if (userSurveys.currentTime() >= survey.startTime && userSurveys.currentTime() <= survey.endTime) {
          return userSurveys.activeWhen(survey)
        }
      })
    },

    getDisplayableSurveys: function (surveys) {
      return $.grep(surveys, function (survey, _index) {
        return userSurveys.isSurveyToBeDisplayed(survey)
      })
    },

    getActiveSurvey: function (defaultSurvey, smallSurveys) {
      var activeSurveys = userSurveys.getActiveSurveys(smallSurveys)
      var allSurveys = [defaultSurvey].concat(activeSurveys)
      var displayableSurveys = userSurveys.getDisplayableSurveys(allSurveys)

      if (displayableSurveys.length < 2) {
        return displayableSurveys[0]
      } else {
        // At this point, if there are multiple surveys that could be shown
        // it is fair to roll the dice and pick one; we've already considered
        // frequency in isSurveyToBeDisplayed so we don't need to worry about
        // it here
        return displayableSurveys[Math.floor(Math.random() * displayableSurveys.length)]
      }
    },

    displaySurvey: function (survey) {
      var surveyContainer = $('#user-satisfaction-survey-container')
      if (survey.surveyType === 'email') {
        userSurveys.displayEmailSurvey(survey, surveyContainer)
      } else if ((survey.surveyType === 'url') || (survey.surveyType === undefined)) {
        userSurveys.displayURLSurvey(survey, surveyContainer)
      } else {
        return
      }
      userSurveys.incrementSurveySeenCounter(survey)
      userSurveys.trackEvent(survey.identifier, 'banner_shown', 'Banner has been shown')
    },

    displayURLSurvey: function (survey, surveyContainer) {
      var urlSurveyTemplate = userSurveys.getUrlSurveyTemplate()
      surveyContainer.append(urlSurveyTemplate.render(survey))
      userSurveys.setURLSurveyEventHandlers(survey)
    },

    displayEmailSurvey: function (survey, surveyContainer) {
      var emailSurveyTemplate = userSurveys.getEmailSurveyTemplate()
      surveyContainer.append(emailSurveyTemplate.render(survey))
      userSurveys.setEmailSurveyEventHandlers(survey)
    },

    addParamsToURL: function (surveyUrl) {
      var newSurveyUrl = surveyUrl.replace(/\{\{currentPath\}\}/g, userSurveys.currentPath());
      if (surveyUrl.indexOf("?c=") !== -1) {
        return newSurveyUrl + "&gcl=" + GOVUK.analytics.gaClientId;
      }
      else {
        return newSurveyUrl + "?gcl=" + GOVUK.analytics.gaClientId;
      }
    },

    setEmailSurveyEventHandlers: function (survey) {
      var $emailSurveyOpen = $('#email-survey-open')
      var $emailSurveyCancel = $('#user-survey-cancel')
      var $emailSurveyPre = $('#email-survey-pre')
      var $emailSurveyForm = $('#email-survey-form')
      var $emailSurveyPostSuccess = $('#email-survey-post-success')
      var $emailSurveyPostFailure = $('#email-survey-post-failure')
      var $emailSurveyField = $('#survey-email-address')
      var $takeSurvey = $('#take-survey')

      $takeSurvey.click(function () {
        userSurveys.setSurveyTakenCookie(survey)
        userSurveys.hideSurvey(survey)
        userSurveys.trackEvent(survey.identifier, 'no_email_link', 'User taken survey via no email link')
      })

      $emailSurveyOpen.click(function (e) {
        survey.surveyExpanded = true
        userSurveys.trackEvent(survey.identifier, 'email_survey_open', 'Email survey opened')
        $emailSurveyPre.addClass('js-hidden').attr('aria-hidden', 'true')
        $emailSurveyForm.removeClass('js-hidden').attr('aria-hidden', 'false')
        $emailSurveyField.focus()
        e.stopPropagation()
        return false
      })

      $emailSurveyCancel.click(function (e) {
        userSurveys.setSurveyTakenCookie(survey)
        userSurveys.hideSurvey(survey)
        if (survey.surveyExpanded) {
          userSurveys.trackEvent(survey.identifier, 'email_survey_cancel', 'Email survey cancelled')
        } else {
          userSurveys.trackEvent(survey.identifier, 'banner_no_thanks', 'No thanks clicked')
        }
        e.stopPropagation()
        return false
      })

      $emailSurveyForm.submit(function (e) {
        var successCallback = function () {
          $emailSurveyForm.addClass('js-hidden').attr('aria-hidden', 'true')
          $emailSurveyPostSuccess.removeClass('js-hidden').attr('aria-hidden', 'false')
          $emailSurveyPostSuccess.focus()
          userSurveys.setSurveyTakenCookie(survey)
          userSurveys.trackEvent(survey.identifier, 'email_survey_taken', 'Email survey taken')
          userSurveys.trackEvent(survey.identifier, 'banner_taken', 'User taken survey')
        }
        var errorCallback = function () {
          $emailSurveyForm.addClass('js-hidden').attr('aria-hidden', 'true')
          $emailSurveyPostFailure.removeClass('js-hidden').attr('aria-hidden', 'false')
          $emailSurveyPostFailure.focus()
        }
        var surveyFormUrl = $emailSurveyForm.attr('action')
        // make sure the survey form is a js url
        if (!(/\.js$/.test(surveyFormUrl))) {
          surveyFormUrl += '.js'
        }

        $.ajax({
          type: 'POST',
          url: surveyFormUrl,
          dataType: 'json',
          data: $emailSurveyForm.serialize(),
          success: successCallback,
          error: errorCallback,
          statusCode: {
            500: errorCallback
          }
        })
        e.stopPropagation()
        return false
      })
    },

    setURLSurveyEventHandlers: function (survey) {
      var $emailSurveyCancel = $('#user-survey-cancel')
      var $takeSurvey = $('#take-survey')

      $emailSurveyCancel.click(function (e) {
        userSurveys.setSurveyTakenCookie(survey)
        userSurveys.hideSurvey(survey)
        userSurveys.trackEvent(survey.identifier, 'banner_no_thanks', 'No thanks clicked')
        e.stopPropagation()
        return false
      })
      $takeSurvey.click(function () {
        userSurveys.setSurveyTakenCookie(survey)
        userSurveys.hideSurvey(survey)
        userSurveys.trackEvent(survey.identifier, 'banner_taken', 'User taken survey')
      })
    },

    isSurveyToBeDisplayed: function (survey) {
      if (userSurveys.isBeingViewedOnMobile() && !userSurveys.surveyIsAllowedOnMobile(survey)) {
        return false
      } else if (GOVUK.cookie(userSurveys.surveyTakenCookieName(survey)) === 'true') {
        return false
      } else if (userSurveys.surveyHasBeenSeenTooManyTimes(survey)) {
        return false
      } else {
        return userSurveys.randomNumberMatches(survey.frequency)
      }
    },

    pathInBlacklist: function () {
      var blackList = new RegExp('^/(?:' +
        /service-manual/.source +
        // add more blacklist paths in the form:
        // + /|path-to\/blacklist/.source
        ')(?:\/|$)'
      )
      return blackList.test(userSurveys.currentPath())
    },

    userCompletedTransaction: function () {
      var path = userSurveys.currentPath()

      function stringContains (str, substr) {
        return str.indexOf(substr) > -1
      }

      if (stringContains(path, '/done') ||
          stringContains(path, '/transaction-finished') ||
          stringContains(path, '/driving-transaction-finished')) {
        return true
      }
    },

    trackEvent: function (identifier, action, label) {
      window.GOVUK.analytics.trackEvent(identifier, action, {
        label: label,
        value: 1,
        nonInteraction: true
      })
    },

    setSurveyTakenCookie: function (survey) {
      window.GOVUK.cookie(userSurveys.surveyTakenCookieName(survey), true, { days: 30 * 3 })
    },

    incrementSurveySeenCounter: function (survey) {
      var cookieName = userSurveys.surveySeenCookieName(survey)
      var seenCount = (userSurveys.surveySeenCount(survey) + 1)
      var cooloff = userSurveys.seenTooManyTimesCooloff(survey)
      if (cooloff) {
        window.GOVUK.cookie(cookieName, seenCount, { days: cooloff })
      } else {
        window.GOVUK.cookie(cookieName, seenCount)
      }
    },

    seenTooManyTimesCooloff: function (survey) {
      if (survey.seenTooManyTimesCooloff) {
        return extractNumber(survey.seenTooManyTimesCooloff, undefined, 1)
      } else {
        return undefined
      }
    },

    hideSurvey: function (_survey) {
      $('#user-satisfaction-survey').removeClass('visible').attr('aria-hidden', 'true')
    },

    randomNumberMatches: function (frequency) {
      return (Math.floor(Math.random() * frequency) === 0)
    },

    otherNotificationVisible: function () {
      var notificationIds = [
        '.govuk-emergency-banner:visible',
        '#global-cookie-message:visible',
        '#global-browser-prompt:visible',
        '#taxonomy-survey:visible'
      ]
      return $(notificationIds.join(', ')).length > 0
    },

    surveyHasBeenSeenTooManyTimes: function (survey) {
      return (userSurveys.surveySeenCount(survey) >= userSurveys.surveySeenTooManyTimesLimit(survey))
    },

    surveySeenTooManyTimesLimit: function (survey) {
      var limitValue = survey.seenTooManyTimesLimit
      if (String(limitValue).toLowerCase() === 'unlimited') {
        return Infinity
      } else {
        return extractNumber(limitValue, SURVEY_SEEN_TOO_MANY_TIMES_LIMIT, 1)
      }
    },

    surveySeenCount: function (survey) {
      return extractNumber(GOVUK.cookie(userSurveys.surveySeenCookieName(survey)), 0, 0)
    },

    surveyTakenCookieName: function (survey) {
      return generateCookieName('taken_' + survey.identifier)
    },

    surveySeenCookieName: function (survey) {
      return generateCookieName('survey_seen_' + survey.identifier)
    },

    isBeingViewedOnMobile: function () {
      return window.matchMedia(MAX_MOBILE_WIDTH).matches
    },

    surveyIsAllowedOnMobile: function (survey) {
      return survey.hasOwnProperty('allowedOnMobile') && survey.allowedOnMobile === true
    },

    pathMatch: function (paths) {
      if (paths === undefined) {
        return false
      } else {
        var pathMatchingExpr = new RegExp(
              $.map($.makeArray(paths), function (path, _i) {
                if (/[\^\$]/.test(path)) {
                  return '(?:' + path + ')'
                } else {
                  return '(?:\/' + path + '(?:\/|$))'
                }
              }).join('|')
            )
        return pathMatchingExpr.test(userSurveys.currentPath())
      }
    },

    breadcrumbMatch: function (breadcrumbs) {
      if (breadcrumbs === undefined) {
        return false
      } else {
        var breadcrumbMatchingExpr = new RegExp($.makeArray(breadcrumbs).join('|'), 'i')
        return breadcrumbMatchingExpr.test(userSurveys.currentBreadcrumb())
      }
    },

    sectionMatch: function (sections) {
      if (sections === undefined) {
        return false
      } else {
        var sectionMatchingExpr = new RegExp($.makeArray(sections).join('|'), 'i')
        return sectionMatchingExpr.test(userSurveys.currentSection()) || sectionMatchingExpr.test(userSurveys.currentThemes())
      }
    },

    organisationMatch: function (organisations) {
      if (organisations === undefined) {
        return false
      } else {
        var orgMatchingExpr = new RegExp($.makeArray(organisations).join('|'))
        return orgMatchingExpr.test(userSurveys.currentOrganisation())
      }
    },

    tlsCookieMatch: function (tlsCookieVersionLimit) {
      var currentTlsVersion = userSurveys.currentTlsVersion()
      if (tlsCookieVersionLimit === undefined || currentTlsVersion == '') {
        return false
      } else {
        return currentTlsVersion < tlsCookieVersionLimit[0]
      }
    },

    activeWhen: function (survey) {
      if (survey.hasOwnProperty('activeWhen')) {
        if (survey.activeWhen.hasOwnProperty('path') ||
          survey.activeWhen.hasOwnProperty('breadcrumb') ||
          survey.activeWhen.hasOwnProperty('section') ||
          survey.activeWhen.hasOwnProperty('organisation') ||
          survey.activeWhen.hasOwnProperty('tlsCookieVersionLimit')) {
          var matchType = (survey.activeWhen.matchType || 'include')
          var matchByTlsCookie = userSurveys.tlsCookieMatch(survey.activeWhen.tlsCookieVersionLimit)
          var matchByPath = userSurveys.pathMatch(survey.activeWhen.path)
          var matchByBreadcrumb = userSurveys.breadcrumbMatch(survey.activeWhen.breadcrumb)
          var matchBySection = userSurveys.sectionMatch(survey.activeWhen.section)
          var matchByOrganisation = userSurveys.organisationMatch(survey.activeWhen.organisation)
          var pageMatches = (matchByTlsCookie || matchByPath || matchByBreadcrumb || matchBySection || matchByOrganisation)

          if (matchType !== 'exclude') {
            return pageMatches
          } else {
            return !pageMatches
          }
        } else {
          return true
        }
      } else {
        return true
      }
    },

    currentTime: function () { return new Date().getTime() },
    currentPath: function () { return window.location.pathname },
    currentBreadcrumb: function () { return $('.govuk-breadcrumbs').text() || '' },
    currentSection: function () { return $('meta[name="govuk:section"]').attr('content') || '' },
    currentThemes: function () { return $('meta[name="govuk:themes"]').attr('content') || '' },
    currentOrganisation: function () { return $('meta[name="govuk:analytics:organisations"]').attr('content') || '' },
    currentTlsVersion: function () {
      var tlsCookie = GOVUK.getCookie('TLSversion')
      if (tlsCookie == null || tlsCookie == "unknown") {
        return ''
      } else {
        var cookieVersion = parseFloat(tlsCookie.replace('TLSv', ''))
        return cookieVersion || ''
      }
    }
  }

  var generateCookieName = function (cookieName) {
      // taken_user_satisfaction_survey => takenUserSatisfactionSurvey
    var cookieStub = cookieName.replace(/(\_\w)/g, function (m) {
      return m.charAt(1).toUpperCase()
    })
    return 'govuk_' + cookieStub
  }

  var extractNumber = function (value, defaultValue, limit) {
    var parsedValue = parseInt(value, 10)
    if (isNaN(parsedValue) || (parsedValue < limit)) {
      return defaultValue
    } else {
      return parsedValue
    }
  }

  window.GOVUK.userSurveys = userSurveys

  $(document).ready(function () {
    if (GOVUK.userSurveys) {
      if (GOVUK.analytics && GOVUK.analytics.gaClientId) {
        window.GOVUK.userSurveys.init()
      }
      else {
        $(window).on('gaClientSet', function() {
          window.GOVUK.userSurveys.init()
        })
      }
    }
  })
})(window.jQuery)
