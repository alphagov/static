// = require_self

(function ($) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  var takeSurveyLink = function (text, className) {
    className = className ? 'class="' + className + '"' : ''
    return '<a ' + className + ' href="javascript:void()" id="take-survey" target="_blank" rel="noopener noreferrer">' + text + '</a>'
  }

  var templateBase = function (children) {
    return (
      '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
      '  <div class="survey-wrapper">' +
      '    <a class="survey-close-button" href="#user-survey-cancel" aria-labelledby="survey-title user-survey-cancel" id="user-survey-cancel" role="button">Close</a>' +
      '    <h2 class="survey-title" id="survey-title">Tell us what you think of GOV.UK</h2>' +
           children +
      '  </div>' +
      '</section>'
    )
  }

  var URL_SURVEY_TEMPLATE = templateBase(
    '<p>' +
      takeSurveyLink('Take the 3 minute survey', 'survey-primary-link') +
    '  This will open a short survey on another website' +
    '</p>'
  )
  var EMAIL_SURVEY_TEMPLATE = templateBase(
    '<div id="email-survey-pre">' +
    '  <a class="survey-primary-link" href="#email-survey-form" id="email-survey-open" rel="noopener noreferrer" role="button" aria-expanded="false">' +
    '    Take a short survey to give us your feedback' +
    '  </a>' +
    '</div>' +
    '<form id="email-survey-form" action="/contact/govuk/email-survey-signup" method="post" class="js-hidden" aria-hidden="true">' +
    '  <div class="survey-inner-wrapper">' +
    '    <div id="survey-form-description" class="survey-form-description">We’ll send you a link to a feedback form. It only takes 2 minutes to fill in.<br> Don’t worry: we won’t send you spam or share your email address with anyone.</div>' +
    '    <label class="survey-form-label" for="survey-email-address">' +
    '      Email Address' +
    '    </label>' +
    '    <input name="email_survey_signup[survey_id]" type="hidden" value="">' +
    '    <input name="email_survey_signup[survey_source]" type="hidden" value="">' +
    '    <input class="survey-form-input" name="email_survey_signup[email_address]" id="survey-email-address" type="text" aria-describedby="survey-form-description">' +
    '    <button class="survey-form-button" type="submit">Send me the survey</button>' +
         takeSurveyLink('Don’t have an email address?') +
    '  </div>' +
    '</form>' +
    '<div id="email-survey-post-success" class="js-hidden" aria-hidden="true" tabindex="-1">' +
    '  Thanks, we’ve sent you an email with a link to the survey.' +
    '</div>' +
    '<div id="email-survey-post-failure" class="js-hidden" aria-hidden="true" tabindex="-1">' +
    '  Sorry, we’re unable to send you an email right now.  Please try again later.' +
    '</div>'
  )
  var SURVEY_SEEN_TOO_MANY_TIMES_LIMIT = 2

  var hmrc_survey_utm_campaign_value_map = function () {
    var path = window.location.pathname
    switch (true) {
      case /^\/working-tax-credit(?:\/|$)/.test(path): return 'Working%20Tax%20Credit'
      case /^\/guidance\/money-laundering-regulations-register-with-hmrc(?:\/|$)/.test(path): return 'Money%20Laundering%20Regulations'
      case /^\/child-tax-credit(?:\/|$)/.test(path): return 'Child%20Tax%20Credit'
      case /^\/check-state-pension(?:\/|$)/.test(path): return 'Check%20State%20Pension'
      case /^\/apply-marriage-allowance(?:\/|$)/.test(path): return 'Marriage%20Allowance'
      case /^\/stamp-duty-land-tax(?:\/|$)/.test(path): return 'Stamp%20Duty'
      case /^\/guidance\/pay-apprenticeship-levy(?:\/|$)/.test(path): return 'Apprenticeship%20Levy'
      case /^\/update-company-car-details(?:\/|$)/.test(path): return 'Company%20Car%20Details'
      case /^\/guidance\/paying-your-employees-expenses-and-benefits-through-your-payroll(?:\/|$)/.test(path): return 'Employee%20Expenses%20and%20Benefits%20Through%20Payroll'
      case /^\/guidance\/pension-schemes-protect-your-lifetime-allowance(?:\/|$)/.test(path): return 'Pension%20Lifetime%20Allowance'
      case /^\/send-employment-intermediary-report(?:\/|$)/.test(path): return 'Employment%20Intermediary%20Report'
      case /^\/guidance\/tell-hmrc-about-your-employment-related-securities(?:\/|$)/.test(path): return 'Employment%20Related%20Securities'
      case /^\/guidance\/pension-administrators-check-a-members-gmp(?:\/|$)/.test(path): return 'Pension%20Administration%20Members%20GMP'
      default: return ''
    }
  }

  /* This data structure is explained in `doc/surveys.md` */
  var userSurveys = {
    defaultSurvey: {
      url: 'https://www.smartsurvey.co.uk/s/gov_uk',
      identifier: 'user_satisfaction_survey',
      frequency: 6,
      surveyType: 'email'
    },
    smallSurveys: [
      {
        identifier: 'publisher_guidance_survey',
        surveyType: 'url',
        frequency: 6,
        startTime: new Date("July 17, 2017").getTime(),
        endTime: new Date("August 16, 2017 23:59:50").getTime(),
        url: 'https://www.smartsurvey.co.uk/s/govukpublisherguidance',
        activeWhen: function () {
          function pathMatches() {
            var pathMatchingExpr = new RegExp(
              '^/(?:' +
              /guidance\/content-design/.source +
              /|guidance\/how-to-publish-on-gov-uk/.source +
              /|guidance\/style-guide/.source +
              /|guidance\/contact-the-government-digital-service/.source +
              /|topic\/government-digital-guidance\/content-publishing/.source +
              ')(?:\/|$)'
            )
            return pathMatchingExpr.test(userSurveys.currentPath());
          }

          return pathMatches()
        }
      },
      {
        identifier: 'hmrc_jul2017',
        surveyType: 'url',
        frequency: 20,
        startTime: new Date("July 21, 2017").getTime(),
        endTime: new Date("August 20, 2017 23:59:50").getTime(),
        // use a map to translate the path into the utm_campaign value
        url: 'https://signup.take-part-in-research.service.gov.uk/home?utm_campaign='+hmrc_survey_utm_campaign_value_map()+'&utm_source=Money_and_tax&utm_medium=gov.uk&t=HMRC',
        activeWhen: function () {
          function pathMatches() {
            // use the same map as the utm_campaign value to make sure we don't
            // show the survey on a page without a utm_campaign value.
            return hmrc_survey_utm_campaign_value_map() !== ''
          }

          return pathMatches()
        }
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

    canShowAnySurvey: function() {
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

    getActiveSurveys: function (surveys) {
      return $.grep(surveys, function (survey, _index) {
        if (userSurveys.currentTime() >= survey.startTime && userSurveys.currentTime() <= survey.endTime) {
          if (typeof (survey.activeWhen) === 'function') {
            return survey.activeWhen()
          } else {
            return true
          }
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

      if (displayableSurveys.length < 1) {
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
      surveyContainer.append(survey.template || URL_SURVEY_TEMPLATE)
      userSurveys.setURLSurveyLink(survey)
      userSurveys.setURLSurveyEventHandlers(survey)
    },

    displayEmailSurvey: function (survey, surveyContainer) {
      surveyContainer.append(survey.template || EMAIL_SURVEY_TEMPLATE)

      var $surveyId = $('#email-survey-form input[name="email_survey_signup[survey_id]"]')
      var $surveySource = $('#email-survey-form input[name="email_survey_signup[survey_source]"]')

      $surveyId.val(survey.identifier)
      $surveySource.val(userSurveys.currentPath())

      userSurveys.setURLSurveyLink(survey)
      userSurveys.setEmailSurveyEventHandlers(survey)
    },

    setURLSurveyLink: function (survey) {
      var $surveyLink = $('#take-survey')
      var surveyUrl = survey.url

      // Smart survey can record the URL of the survey link if passed through as a query param
      if ((/smartsurvey/.test(surveyUrl)) && (surveyUrl.indexOf('?c=') === -1)) {
        surveyUrl += '?c=' + userSurveys.currentPath()
      }

      $surveyLink.attr('href', surveyUrl)
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
      if (GOVUK.cookie(userSurveys.surveyTakenCookieName(survey)) === 'true') {
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

    currentTime: function () { return new Date().getTime() },
    currentPath: function () { return window.location.pathname }
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
    if (window.GOVUK.userSurveys) {
      window.GOVUK.userSurveys.init()
    }
  })
})(window.jQuery)
