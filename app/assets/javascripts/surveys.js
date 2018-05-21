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
        identifier: 'hmrc_march_duty_free',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('March 28, 2018').getTime(),
        endTime: new Date('June 1, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=Passengers&utm_source=Other&utm_medium=gov.uk&t=HMRC&id=139',
        templateArgs: {
          title: 'Get involved in making government services better',
          surveyCta: 'Take the 3 minute survey.',
          surveyCtaPostscript: 'This will open a short survey on another website.'
        },
        activeWhen: {
          path: [
            '^/duty-free-goods/arrivals-from-outside-the-eu$',
            '^/duty-free-goods/arrivals-from-eu-countries$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'hmrc_march_international_post',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('March 28, 2018').getTime(),
        endTime: new Date('June 1, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=Parcels&utm_source=Other&utm_medium=gov.uk&t=HMRC&id=140',
        templateArgs: {
          title: 'Get involved in making government services better',
          surveyCta: 'Take the 3 minute survey.',
          surveyCtaPostscript: 'This will open a short survey on another website.'
        },
        activeWhen: {
          path: [
            '^/government/publications/notice-143-a-guide-for-international-post-users$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'hmrc_march_vat_overseas',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('March 28, 2018').getTime(),
        endTime: new Date('June 1, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/home?utm_campaign=Parcels&utm_source=Other&utm_medium=gov.uk&t=HMRC&id=140',
        templateArgs: {
          title: 'Get involved in making government services better',
          surveyCta: 'Take the 3 minute survey.',
          surveyCtaPostscript: 'This will open a short survey on another website.'
        },
        activeWhen: {
          path: [
            '^/guidance/vat-overseas-businesses-using-an-online-marketplace-to-sell-goods-in-the-uk$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'home_office_research_survey_1',
        surveyType: 'url',
        frequency: 5,
        startTime: new Date('May 01, 2018').getTime(),
        endTime: new Date('November 01, 2018').getTime(),
        url: 'https://www.homeofficesurveys.homeoffice.gov.uk/s/MLSJL/',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Answer some questions about yourself to join the research community',
          surveyCtaPostscript: 'This link opens in a new tab'
        },
        activeWhen: {
          path: [
            '^/guidance/status-of-eu-nationals-in-the-uk-what-you-need-to-know$',
            '^/government/news/blue-uk-passport-to-return-after-eu-exit$',
            '^/government/publications/eu-citizens-arriving-in-the-uk-during-the-implementation-period/eu-citizens-arriving-in-the-uk-during-the-implementation-period$',
            '^/government/organisations/home-office/about/complaints-procedure$',
            '^/emergency-travel-document/how-to-apply$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'home_office_research_survey_2',
        surveyType: 'url',
        frequency: 5,
        startTime: new Date('May 01, 2018').getTime(),
        endTime: new Date('November 01, 2018').getTime(),
        url: 'https://www.homeofficesurveys.homeoffice.gov.uk/s/WGPEU/',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Answer some questions about yourself to join the research community',
          surveyCtaPostscript: 'This link opens in a new tab'
        },
        activeWhen: {
          path: [
            '^/emergency-travel-document/how-to-apply$',
            '^/government/collections/uk-leaving-the-eu-what-you-need-to-know$',
            '^/guidance/dbs-check-requests-guidance-for-employers$',
            '^/government/case-studies/example-case-studies-eu-citizens-rights-in-the-uk$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'home_office_research_survey_3',
        surveyType: 'url',
        frequency: 5,
        startTime: new Date('May 01, 2018').getTime(),
        endTime: new Date('November 01, 2018').getTime(),
        url: 'https://www.homeofficesurveys.homeoffice.gov.uk/s/B4F8A/',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Answer some questions about yourself to join the research community',
          surveyCtaPostscript: 'This link opens in a new tab'
        },
        activeWhen: {
          path: [
            '^/choose-uk-visit-short-stay-visa$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'hmrc-additional-needs',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('May 18, 2018').getTime(),
        endTime: new Date('July 24, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=additional_needs_hmrc&utm_source=Other&utm_medium=gov.uk&t=HMRC&id=145&c={{currentPath}}',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Get involved in making government services better',
          surveyCtaPostscript: 'This will open a short survey on another website'
        },
        activeWhen: {
          path: [
            '^/dealing-hmrc-additional-needs$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'additional-needs-hmrc-hearing',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('May 18, 2018').getTime(),
        endTime: new Date('July 24, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=additional_needs_hearing&utm_source=Other&utm_medium=other&t=HMRC&id=146&c={{currentPath}}',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Get involved in making government services better',
          surveyCtaPostscript: 'This will open a short survey on another website'
        },
        activeWhen: {
          path: [
            '^/dealing-hmrc-additional-needs/deaf-hearing-impaired$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'additional-needs-hmrc-sight',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('May 18, 2018').getTime(),
        endTime: new Date('July 24, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=additional_needs_hmrc_sight&utm_source=Other&utm_medium=other&t=HMRC&id=147&c={{currentPath}}',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Get involved in making government services better',
          surveyCtaPostscript: 'This will open a short survey on another website'
        },
        activeWhen: {
          path: [
            '^/dealing-hmrc-additional-needs/blind-partially-sighted$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'additional-needs-hmrc-language',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('May 18, 2018').getTime(),
        endTime: new Date('July 24, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=additional_needs_hmrc_language&utm_source=Other&utm_medium=other&t=HMRC&id=148&c={{currentPath}}',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Get involved in making government services better',
          surveyCtaPostscript: 'This will open a short survey on another website'
        },
        activeWhen: {
          path: [
            '^/dealing-hmrc-additional-needs/english-not-first-language$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'additional-needs-hmrc-general',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('May 18, 2018').getTime(),
        endTime: new Date('July 24, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=additional_needs_hmrc&utm_source=Other&utm_medium=gov.uk&t=HMRC&id=145&c={{currentPath}}',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Get involved in making government services better',
          surveyCtaPostscript: 'This will open a short survey on another website'
        },
        activeWhen: {
          path: [
            '^/government/publications/tax-credits-disability-helpsheet-tc956$',
            '^/government/collections/vat-reliefs-for-charities-disabled-and-older-people$',
            '^/help-friends-family-tax$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'agent-hmrc',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('May 18, 2018').getTime(),
        endTime: new Date('July 24, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=agent&utm_source=Other&utm_medium=other&t=HMRC&id=149&c={{currentPath}}',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Get involved in making government services better',
          surveyCtaPostscript: 'This will open a short survey on another website'
        },
        activeWhen: {
          path: [
            '^/government/collections/hmrc-online-services-for-agents$',
            '^/guidance/client-authorisation-an-overview$',
            '^/guidance/client-authorisation-an-overview$',
            '^/topic/dealing-with-hmrc/tax-agent-guidance$',
            '^/government/collections/agent-update$',
            '^/sdlt-online$',
            '^/government/collections/online-security-information-for-agents$',
            '^/government/collections/tax-agents-toolkits$',
            '^/government/publications/agents-strategy-an-overview$',
            '^/government/publications/agents-strategy-an-overview/agents-strategy-an-overview$',
            '^/government/publications/hmrc-agent-toolkits-film-transcript$',
            '^/government/publications/agent-and-client-statistics$',
            '^/guidance/self-assessment-for-agents-online-service$',
            '^/guidance/vat-online-services-for-agents$',
            '^/guidance/get-an-hmrc-agent-services-account$',
            '^/government/publications/agent-update-self-assessment-special$',
            '^/guidance/hmrc-working-with-tax-agents-blog$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'cds-user-panel',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('May 18, 2018').getTime(),
        endTime: new Date('July 02, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=CDSusersignup&utm_source=Other&utm_medium=other&t=HMRC&id=110&c={{currentPath}}',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Get involved in making government services better',
          surveyCtaPostscript: 'This will open a short survey on another website'
        },
        activeWhen: {
          path: [
            '^/government/news/getting-ready-for-the-customs-declaration-service$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'hmrc-trusts-govuk',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('May 18, 2018').getTime(),
        endTime: new Date('August 01, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=TrustsGOVuk&utm_source=govukother&utm_medium=gov.uk&t=HMRC&id=150&c={{currentPath}}',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Get involved in making government services better',
          surveyCtaPostscript: 'This will open a short survey on another website'
        },
        activeWhen: {
          path: [
            '^/trusts-taxes$',
            '^/guidance/register-your-clients-trust$',
            '^/guidance/register-your-clients-estate$',
            '^/guidance/register-your-clients-estate$',
            '^/trusts-taxes/trustees-tax-responsibilities$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'hmrc-awrs',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('May 18, 2018').getTime(),
        endTime: new Date('August 01, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=AWRSgov&utm_source=Other&utm_medium=other&t=HMRC&id=43&c={{currentPath}}',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Get involved in making government services better',
          surveyCtaPostscript: 'This will open a short survey on another website'
        },
        activeWhen: {
          path: [
            '^/check-alcohol-wholesaler-registration$'
          ]
        },
        allowedOnMobile: true
      },
      {
        identifier: 'sdes-gov',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date('May 18, 2018').getTime(),
        endTime: new Date('August 31, 2018').getTime(),
        url: 'https://signup.take-part-in-research.service.gov.uk/?utm_campaign=SDESGov&utm_source=Other&utm_medium=gov.uk&t=HMRC&id=152&c={{currentPath}}',
        templateArgs: {
          title: 'Help improve GOV.UK',
          surveyCta: 'Get involved in making government services better',
          surveyCtaPostscript: 'This will open a short survey on another website'
        },
        activeWhen: {
          path: [
            '^/government/collections/secure-electronic-transfer$',
            '^/guidance/hmrc-secure-data-exchange-service-sdes$'
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
          survey.activeWhen.hasOwnProperty('section') ||
          survey.activeWhen.hasOwnProperty('organisation') ||
          survey.activeWhen.hasOwnProperty('tlsCookieVersionLimit')) {
          var matchType = (survey.activeWhen.matchType || 'include')
          var matchByTlsCookie = userSurveys.tlsCookieMatch(survey.activeWhen.tlsCookieVersionLimit)
          var matchByPath = userSurveys.pathMatch(survey.activeWhen.path)
          var matchBySection = userSurveys.sectionMatch(survey.activeWhen.section)
          var matchByOrganisation = userSurveys.organisationMatch(survey.activeWhen.organisation)
          var pageMatches = (matchByTlsCookie || matchByPath || matchBySection || matchByOrganisation)

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
