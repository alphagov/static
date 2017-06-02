// = require_self

(function ($) {
  'use strict'
  window.GOVUK = window.GOVUK || {}
  var cancelButton = '<a href="#email-survey-cancel" aria-labelledby="survey-title email-survey-cancel" id="email-survey-cancel" role="button" class="close-button">Close</a>'
  var surveyTitle = ' <h2 class="survey-title" id="survey-title">Tell us what you think of GOV.UK</h2>'
  var takeSurveyLink = function (text, className) {
    className = className ? 'class="' + className + '"' : ''
    return '<a ' + className + ' href="javascript:void()" id="take-survey" target="_blank" rel="noopener noreferrer">' + text + '</a>'
  }

  var URL_SURVEY_TEMPLATE = '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
                            '  <div class="wrapper">' +
                                 cancelButton +
                                 surveyTitle +
                            '    <p>' +
                                 takeSurveyLink('Take the 3 minute survey', 'survey-primary-link') +
                            '    This will open a short survey on another website</p>' +
                            '  </div>' +
                            '</section>',
    EMAIL_SURVEY_TEMPLATE = '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
                            '  <div class="wrapper">' +
                                 cancelButton +
                            '    <div class="inner-wrapper">' +
                                   surveyTitle +
                            '      <div id="email-survey-pre">' +
                            '        <a class="survey-primary-link" href="#email-survey-form" aria-labelledby="survey-title email-survey-open" id="email-survey-open" rel="noopener noreferrer" role="button" aria-expanded="false">' +
                            '          Take a short survey to give us your feedback' +
                            '        </a>' +
                            '      </div>' +
                            '      <form id="email-survey-form" action="/contact/govuk/email-survey-signup" method="post" class="js-hidden" aria-hidden="true">' +
                            '        <div id="feedback-prototype-form">' +
                            '          <div id="survey-form-description" class="survey-form-description">We\'ll send you a link to a feedback form. It only takes 2 minutes to fill in.<br> Don\'t worry: we won\'t send you spam or share your email address with anyone.</div>' +
                            '          <label class="survey-form-label" aria-describedby="survey-form-description" for="survey-email-address">' +
                            '            Email Address' +
                            '          </label>' +
                            '          <input name="email_survey_signup[survey_id]" type="hidden" value="">' +
                            '          <input name="email_survey_signup[survey_source]" type="hidden" value="">' +
                            '          <input name="email_survey_signup[email_address]" id="survey-email-address" type="text">' +
                            '          <div class="actions">' +
                            '            <button type="submit">Send</button>' +
                            '            <span class="button-info">' +
                                           takeSurveyLink('Don\'t have an email address?') +
                            '            </span >' +
                            '          </div>' +
                            '        </div>' +
                            '      </form>' +
                            '      <div id="email-survey-post-success" class="js-hidden" aria-hidden="true" tabindex="-1">' +
                            '        Thanks, we\'ve sent you an email with a link to the survey.' +
                            '      </div>' +
                            '      <div id="email-survey-post-failure" class="js-hidden" aria-hidden="true" tabindex="-1">' +
                            '        Sorry, we’re unable to send you an email right now.  Please try again later.' +
                            '      </div>' +
                            '    </div>' +
                            '  </div>' +
                            '</section>'

  /* This data structure is explained in `doc/surveys.md` */
  var userSurveys = {
    defaultSurvey: {
      url: 'https://www.smartsurvey.co.uk/s/gov-uk',
      identifier: 'user_satisfaction_survey',
      frequency: 50,
      surveyType: 'url'
    },
    smallSurveys: [
      {
        url: 'https://www.smartsurvey.co.uk/s/gov-uk',
        identifier: 'user_satisfaction_survey',
        frequency: 50,
        surveyType: 'email',
        surveyExpanded: false
      }
    ],

    init: function () {
      var activeSurvey = userSurveys.getActiveSurvey(userSurveys.defaultSurvey, userSurveys.smallSurveys)
      if (userSurveys.isSurveyToBeDisplayed(activeSurvey)) {
        userSurveys.displaySurvey(activeSurvey)
      }
    },

    getActiveSurvey: function (defaultSurvey, smallSurveys) {
      var activeSurvey = defaultSurvey

      $.each(smallSurveys, function (_index, survey) {
        if (userSurveys.currentTime() >= survey.startTime && userSurveys.currentTime() <= survey.endTime) {
          if (typeof (survey.activeWhen) === 'function') {
            if (survey.activeWhen()) { activeSurvey = survey }
          } else {
            activeSurvey = survey
          }
        }
      })

      return activeSurvey
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
      userSurveys.trackEvent(survey.identifier, 'banner_shown', 'Banner has been shown')
    },

    displayURLSurvey: function (survey, surveyContainer) {
      surveyContainer.append(survey.template || URL_SURVEY_TEMPLATE)
      userSurveys.setURLSurveyLink(survey)
      userSurveys.setURLSurveyEventHandlers(survey)
    },

    displayEmailSurvey: function (survey, surveyContainer) {
      surveyContainer.append(survey.template || EMAIL_SURVEY_TEMPLATE)

      var $surveyId = $('#email-survey-form input[name="email_survey_signup[survey_id]"]'),
        $surveySource = $('#email-survey-form input[name="email_survey_signup[survey_source]"]')

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
      var $emailSurveyOpen = $('#email-survey-open'),
        $emailSurveyCancel = $('#email-survey-cancel'),
        $emailSurveyPre = $('#email-survey-pre'),
        $emailSurveyForm = $('#email-survey-form'),
        $emailSurveyPostSuccess = $('#email-survey-post-success'),
        $emailSurveyPostFailure = $('#email-survey-post-failure'),
        $emailSurveyField = $('#survey-email-address')

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
          },
          errorCallback = function () {
            $emailSurveyForm.addClass('js-hidden').attr('aria-hidden', 'true')
            $emailSurveyPostFailure.removeClass('js-hidden').attr('aria-hidden', 'false')
            $emailSurveyPostFailure.focus()
          },
          surveyFormUrl = $emailSurveyForm.attr('action')
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
      var $emailSurveyCancel = $('#email-survey-cancel')
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
      if (userSurveys.pathInBlacklist()) {
        return false
      } else if (userSurveys.otherNotificationVisible() ||
          GOVUK.cookie(userSurveys.surveyTakenCookieName(survey)) === 'true') {
        return false
      } else if (userSurveys.userCompletedTransaction()) {
        // We don't want any survey appearing for users who have completed a
        // transaction as they may complete the survey with the department's
        // transaction in mind as opposed to the GOV.UK content.
        return false
      } else if ($('#user-satisfaction-survey-container').length <= 0) {
        return false
      } else if (userSurveys.randomNumberMatches(survey.frequency)) {
        return true
      } else {
        return false
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
      GOVUK.analytics.trackEvent(identifier, action, {
        label: label,
        value: 1,
        nonInteraction: true
      })
    },

    setSurveyTakenCookie: function (survey) {
      GOVUK.cookie(userSurveys.surveyTakenCookieName(survey), true, { days: 30 * 4 })
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

    surveyTakenCookieName: function (survey) {
      // user_satisfaction_survey => takenUserSatisfactionSurvey
      var cookieStr = 'taken_' + survey.identifier
      var cookieStub = cookieStr.replace(/(\_\w)/g, function (m) {
        return m.charAt(1).toUpperCase()
      })
      return 'govuk_' + cookieStub
    },

    currentTime: function () { return new Date().getTime() },
    currentPath: function () { return window.location.pathname }
  }

  GOVUK.userSurveys = userSurveys

  $(document).ready(function () {
    if (GOVUK.userSurveys) {
      GOVUK.userSurveys.init()
    }
  })
})(jQuery)
