//= require govuk_publishing_components/lib/cookie-functions
//= require_self

// There are a few violations of these, that we may want to refactor away.
/* eslint-disable no-prototype-builtins */
(function () {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  var takeSurveyLink = function (text, className) {
    className = className ? 'class="' + className + '"' : ''
    return '<a ' + className + ' href="{{surveyUrl}}" id="take-survey" target="_blank" rel="noopener noreferrer">' + text + '</a>'
  }

  var templateBase = function (children) {
    return (
      '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
      '  <div class="survey-wrapper govuk-width-container" data-module="ga4-auto-tracker" ' +
              'data-ga4-auto=\'' + JSON.stringify({ event_data: { event_name: 'element_visible', type: 'survey banner' } }) +
              '\'>' +
      '    <a class="govuk-link survey-close-button" ' +
              'href="#user-survey-cancel" ' +
              'aria-labelledby="survey-title user-survey-cancel" ' +
              'id="user-survey-cancel" ' +
              'role="button" ' +
              'data-module="ga4-event-tracker" ' +
              'data-ga4-event=\'' + JSON.stringify({ event_name: 'select_content', type: 'survey banner', action: 'closed', section: '{{title}}' }) +
            '\'>Close</a>' +
      '    <h2 class="survey-title" id="survey-title">{{title}}</h2>' +
          '<div data-module="ga4-link-tracker" data-ga4-track-links-only ' +
                'data-ga4-link=\'' + JSON.stringify({ event_name: 'navigation', type: 'survey banner', index: 1, index_total: 1, section: '{{title}}' }) + '\'>' +
            children +
          '</div>' +
      '  </div>' +
      '</section>'
    )
  }

  var URL_SURVEY_TEMPLATE = templateBase(
    '<p>' +
      takeSurveyLink('{{surveyCta}}', 'govuk-link survey-primary-link') +
    ' <span class="postscript-cta">{{surveyCtaPostscript}}</span>' +
    '</p>'
  )

  var EMAIL_SURVEY_TEMPLATE = templateBase(
    '<div id="email-survey-pre">' +
    '  <a class="govuk-link survey-primary-link" href="#email-survey-form" id="email-survey-open" rel="noopener noreferrer" role="button" aria-expanded="false">' +
    '    {{surveyCta}}' +
    '  </a>' +
    '</div>' +
    '<form id="email-survey-form" action="/contact/govuk/email-survey-signup" method="post" class="js-hidden" aria-hidden="true" data-module="ga4-form-tracker" data-ga4-form=\'' + JSON.stringify({ event_name: 'form_submit', type: 'survey banner', action: 'submit', section: '{{title}}', text: '{{surveyFormCta}}', tool_name: '{{title}}' }) + '\'>' +
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
  var MAX_MOBILE_WIDTH = '(max-width: 800px)'

  /* This data structure is explained in `docs/surveys.md` */
  var userSurveys = {
    defaultSurvey: {
      url: 'https://www.smartsurvey.co.uk/s/gov_uk?c={{currentPath}}',
      identifier: 'user_satisfaction_survey',
      frequency: 6,
      surveyType: 'email'
    },
    smallSurveys: [],

    init: function () {
      if (userSurveys.canShowAnySurvey()) {
        var activeSurvey = userSurveys.getActiveSurvey(userSurveys.defaultSurvey, userSurveys.smallSurveys)
        if (activeSurvey !== undefined) {
          // Hide global bar if one is showing
          var globalBar = document.getElementById('global-bar')
          if (globalBar) {
            globalBar.style.display = 'none'
          }
          userSurveys.displaySurvey(activeSurvey)
        }
      }
    },

    canShowAnySurvey: function () {
      var userSatisfactionSurveyContainer = document.getElementById('user-satisfaction-survey-container')
      if (userSurveys.pathInBlocklist()) {
        return false
      } else if (userSurveys.otherNotificationVisible()) {
        return false
      } else if (userSurveys.userCompletedTransaction()) {
        // We don't want any survey appearing for users who have completed a
        // transaction as they may complete the survey with the department's
        // transaction in mind as opposed to the GOV.UK content.
        return false
      } else if (!userSatisfactionSurveyContainer) {
        return false
      } else {
        return true
      }
    },

    processTemplate: function (args, template) {
      for (var key in args) {
        template = template.replace(new RegExp('{{' + key + '}}', 'g'), args[key])
      }
      return template
    },

    getUrlSurveyTemplate: function () {
      return {
        render: function (survey) {
          var defaultUrlArgs = {
            title: 'Tell us what you think of GOV.UK',
            surveyCta: 'Take the 3 minute survey',
            surveyCtaPostscript: 'This will open a short survey on another website',
            surveyUrl: userSurveys.addParamsToURL(userSurveys.getSurveyUrl(survey))
          }
          var mergedArgs = window.GOVUK.extendObject(defaultUrlArgs, survey.templateArgs)
          return userSurveys.processTemplate(mergedArgs, URL_SURVEY_TEMPLATE)
        }
      }
    },

    getEmailSurveyTemplate: function () {
      return {
        render: function (survey) {
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
            surveyUrl: userSurveys.addParamsToURL(userSurveys.getSurveyUrl(survey)),
            gaClientId: GOVUK.analytics.gaClientId
          }
          var mergedArgs = window.GOVUK.extendObject(defaultEmailArgs, survey.templateArgs)
          return userSurveys.processTemplate(mergedArgs, EMAIL_SURVEY_TEMPLATE)
        }
      }
    },

    getActiveSurveys: function (surveys) {
      return surveys.filter(function (survey, _index) {
        if (userSurveys.currentTime() >= survey.startTime && userSurveys.currentTime() <= survey.endTime) {
          return userSurveys.activeWhen(survey)
        }
        return false
      })
    },

    getDisplayableSurveys: function (surveys) {
      return surveys.filter(function (survey, _index) {
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
      var surveyContainer = document.getElementById('user-satisfaction-survey-container')
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
      surveyContainer.innerHTML = urlSurveyTemplate.render(survey)
      window.GOVUK.modules.start(surveyContainer) // Initialises our GA4 modules
      userSurveys.setURLSurveyEventHandlers(survey)
    },

    displayEmailSurvey: function (survey, surveyContainer) {
      var emailSurveyTemplate = userSurveys.getEmailSurveyTemplate()
      surveyContainer.innerHTML = emailSurveyTemplate.render(survey)
      window.GOVUK.modules.start(surveyContainer) // Initialises our GA4 modules
      userSurveys.setEmailSurveyEventHandlers(survey)
    },

    addParamsToURL: function (surveyUrl) {
      var newSurveyUrl = surveyUrl.replace(/\{\{currentPath\}\}/g, userSurveys.currentPath())
      if (surveyUrl.indexOf('?c=') !== -1) {
        return newSurveyUrl + '&gcl=' + GOVUK.analytics.gaClientId
      } else {
        return newSurveyUrl + '?gcl=' + GOVUK.analytics.gaClientId
      }
    },

    setEmailSurveyEventHandlers: function (survey) {
      var $emailSurveyOpen = document.getElementById('email-survey-open')
      var $emailSurveyCancel = document.getElementById('user-survey-cancel')
      var $emailSurveyPre = document.getElementById('email-survey-pre')
      var $emailSurveyForm = document.getElementById('email-survey-form')
      var $emailSurveyPostSuccess = document.getElementById('email-survey-post-success')
      var $emailSurveyPostFailure = document.getElementById('email-survey-post-failure')
      var $emailSurveyField = document.getElementById('survey-email-address')
      var $takeSurvey = document.getElementById('take-survey')

      if ($takeSurvey) {
        $takeSurvey.addEventListener('click', function () {
          userSurveys.setSurveyTakenCookie(survey)
          userSurveys.hideSurvey(survey)
          userSurveys.trackEvent(survey.identifier, 'no_email_link', 'User taken survey via no email link')
        })
      }

      if ($emailSurveyOpen) {
        $emailSurveyOpen.addEventListener('click', function (e) {
          e.preventDefault() // otherwise focus doesn't work properly and screen jumps to form
          survey.surveyExpanded = true
          userSurveys.trackEvent(survey.identifier, 'email_survey_open', 'Email survey opened')
          $emailSurveyPre.classList.add('js-hidden')
          $emailSurveyPre.setAttribute('aria-hidden', 'true')
          $emailSurveyForm.classList.remove('js-hidden')
          $emailSurveyForm.setAttribute('aria-hidden', 'false')
          $emailSurveyField.focus()
          e.stopPropagation()
        })
      }

      if ($emailSurveyCancel) {
        $emailSurveyCancel.addEventListener('click', function (e) {
          userSurveys.setSurveyTakenCookie(survey)
          userSurveys.hideSurvey(survey)
          if (survey.surveyExpanded) {
            userSurveys.trackEvent(survey.identifier, 'email_survey_cancel', 'Email survey cancelled')
          } else {
            userSurveys.trackEvent(survey.identifier, 'banner_no_thanks', 'No thanks clicked')
          }
          e.stopPropagation()
          e.preventDefault()
        })
      }

      if ($emailSurveyForm) {
        $emailSurveyForm.addEventListener('submit', function (e) {
          var successCallback = function () {
            $emailSurveyForm.classList.add('js-hidden')
            $emailSurveyForm.setAttribute('aria-hidden', 'true')
            $emailSurveyPostSuccess.classList.remove('js-hidden')
            $emailSurveyPostSuccess.setAttribute('aria-hidden', 'false')
            $emailSurveyPostSuccess.focus()
            userSurveys.setSurveyTakenCookie(survey)
            userSurveys.trackEvent(survey.identifier, 'email_survey_taken', 'Email survey taken')
            userSurveys.trackEvent(survey.identifier, 'banner_taken', 'User taken survey')
          }
          var errorCallback = function () {
            $emailSurveyForm.classList.add('js-hidden')
            $emailSurveyForm.setAttribute('aria-hidden', 'true')
            $emailSurveyPostFailure.classList.remove('js-hidden')
            $emailSurveyPostFailure.setAttribute('aria-hidden', 'false')
            $emailSurveyPostFailure.focus()
          }
          var surveyFormUrl = $emailSurveyForm.getAttribute('action')
          // make sure the survey form is a js url
          if (!(/\.js$/.test(surveyFormUrl))) {
            surveyFormUrl += '.js'
          }

          var xhr = new XMLHttpRequest()
          var params = new FormData($emailSurveyForm)
          params = new URLSearchParams(params).toString()
          xhr.open('POST', surveyFormUrl, true)

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              successCallback()
              userSurveys.attachGa4FormCompleteElement($emailSurveyForm, false)
            } else {
              errorCallback()
              userSurveys.attachGa4FormCompleteElement($emailSurveyForm, true)
            }
          }

          xhr.send(params)
          e.stopPropagation()
          e.preventDefault()
        })
      }
    },

    attachGa4FormCompleteElement: function (emailSurveyElement, error) {
      // When the email survey form is submitted, this attaches a HTML element with our GA4 auto tracker to the DOM.
      // The module is then started - the module will send data-ga4-auto object to the dataLayer.
      // Doing it this way prevents us from calling and having to maintaining GA4 JS/cookie consent in this repo.
      var emailSurveyHeading = document.getElementById('survey-title').textContent.trim()

      var emailSurveyText = error ? document.getElementById('email-survey-post-failure') : document.getElementById('email-survey-post-success')
      emailSurveyText = emailSurveyText.textContent.trim()
      var span = document.createElement('span')
      span.setAttribute('data-module', 'ga4-auto-tracker')
      span.setAttribute('data-ga4-auto', JSON.stringify({
        event_name: 'form_complete',
        action: 'complete',
        type: 'survey banner',
        text: emailSurveyText,
        section: emailSurveyHeading,
        tool_name: emailSurveyHeading
      }))
      emailSurveyElement.appendChild(span)
      window.GOVUK.modules.start(emailSurveyElement)
    },

    setURLSurveyEventHandlers: function (survey) {
      var $emailSurveyCancel = document.getElementById('user-survey-cancel')
      var $takeSurvey = document.getElementById('take-survey')

      if ($emailSurveyCancel) {
        $emailSurveyCancel.addEventListener('click', function (e) {
          userSurveys.setSurveyTakenCookie(survey)
          userSurveys.hideSurvey(survey)
          userSurveys.trackEvent(survey.identifier, 'banner_no_thanks', 'No thanks clicked')
          e.stopPropagation()
          e.preventDefault()
        })
      }

      if ($takeSurvey) {
        $takeSurvey.addEventListener('click', function () {
          userSurveys.setSurveyTakenCookie(survey)
          userSurveys.hideSurvey(survey)
          userSurveys.trackEvent(survey.identifier, 'banner_taken', 'User taken survey')
        })
      }
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

    pathInBlocklist: function () {
      var blockList = new RegExp('^/(?:' +
        /service-manual/.source +
        /|coronavirus/.source +
        /|account/.source +
        // add more blockList paths in the form:
        // + /|path-to\/blockList/.source
        ')(?:/|$)'
      )
      return blockList.test(userSurveys.currentPath())
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
        window.GOVUK.cookie(cookieName, seenCount, { days: 365 * 2 })
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
      var userSatisfactionSurvey = document.getElementById('user-satisfaction-survey')
      userSatisfactionSurvey.classList.remove('visible')
      userSatisfactionSurvey.setAttribute('aria-hidden', 'true')
    },

    randomNumberMatches: function (frequency) {
      return (Math.floor(Math.random() * frequency) === 0)
    },

    getSurveyUrl: function (survey) {
      if (survey.url instanceof Array) {
        return survey.url[Math.floor(Math.random() * survey.url.length)]
      } else {
        return survey.url
      }
    },

    otherNotificationVisible: function () {
      function isVisible (el) {
        return el.offsetParent !== null
      }
      var notificationIds = [
        '.emergency-banner',
        '#taxonomy-survey',
        '#global-bar' // Currently about Coronavirus
      ]
      var count = 0
      for (var i = 0; i < notificationIds.length; i++) {
        var el = document.querySelector(notificationIds[i])
        if (el && isVisible(el)) {
          count++
        }
      }
      return count > 0
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
      function buildPath (path) {
        if (/[\^$]/.test(path)) {
          return '(?:' + path + ')'
        } else {
          return '(?:/' + path + '(?:/|$))'
        }
      }

      if (paths === undefined) {
        return false
      } else {
        var pathMatchingExpr = []
        for (var i = 0; i < paths.length; i++) {
          pathMatchingExpr.push(buildPath(paths[i]))
        }

        pathMatchingExpr = new RegExp(pathMatchingExpr.join('|'))
        return pathMatchingExpr.test(userSurveys.currentPath())
      }
    },

    breadcrumbMatch: function (breadcrumbs) {
      if (breadcrumbs === undefined) {
        return false
      } else {
        var breadcrumbMatchingExpr = new RegExp(breadcrumbs.join('|'), 'i')
        return breadcrumbMatchingExpr.test(userSurveys.currentBreadcrumb())
      }
    },

    sectionMatch: function (sections) {
      if (sections === undefined) {
        return false
      } else {
        var sectionMatchingExpr = new RegExp(sections.join('|'), 'i')
        return sectionMatchingExpr.test(userSurveys.currentSection()) || sectionMatchingExpr.test(userSurveys.currentThemes())
      }
    },

    organisationMatch: function (organisations) {
      if (organisations === undefined) {
        return false
      } else {
        var orgMatchingExpr = new RegExp(organisations.join('|'))
        return orgMatchingExpr.test(userSurveys.currentOrganisation())
      }
    },

    tlsCookieMatch: function (tlsCookieVersionLimit) {
      var currentTlsVersion = userSurveys.currentTlsVersion()
      if (tlsCookieVersionLimit === undefined || currentTlsVersion === '') {
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
    currentBreadcrumb: function () {
      var breadcrumb = document.querySelector('.gem-c-breadcrumbs')
      if (breadcrumb) {
        return breadcrumb.textContent
      } else {
        return ''
      }
    },
    currentSection: function () {
      var metaSection = document.querySelector('meta[name="govuk:section"]')
      if (metaSection) {
        return metaSection.getAttribute('content')
      } else {
        return ''
      }
    },
    currentThemes: function () {
      var metaThemes = document.querySelector('meta[name="govuk:themes"]')
      if (metaThemes) {
        return metaThemes.getAttribute('content')
      } else {
        return ''
      }
    },
    currentOrganisation: function () {
      var metaOrganisations = document.querySelector('meta[name="govuk:analytics:organisations"]')
      if (metaOrganisations) {
        return metaOrganisations.getAttribute('content')
      } else {
        return ''
      }
    },
    currentTlsVersion: function () {
      var tlsCookie = GOVUK.getCookie('TLSversion')
      if (tlsCookie === null || tlsCookie === 'unknown') {
        return ''
      } else {
        var cookieVersion = parseFloat(tlsCookie.replace('TLSv', ''))
        return cookieVersion || ''
      }
    }
  }

  var generateCookieName = function (cookieName) {
    // taken_user_satisfaction_survey => takenUserSatisfactionSurvey
    var cookieStub = cookieName.replace(/(_\w)/g, function (m) {
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

  if (GOVUK.userSurveys) {
    if (GOVUK.analytics && GOVUK.analytics.gaClientId) {
      window.GOVUK.userSurveys.init()
    } else {
      window.addEventListener('gaClientSet', function () {
        window.GOVUK.userSurveys.init()
      })
    }
  }
})()
