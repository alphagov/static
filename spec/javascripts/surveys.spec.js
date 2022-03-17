// = require surveys
//= require govuk_publishing_components/lib/trigger-event.js

describe('Surveys', function () {
  var surveys = GOVUK.userSurveys
  var $block

  var defaultSurvey = {
    url: 'smartsurvey.co.uk/default',
    frequency: 1, // no randomness in the test suite pls
    identifier: 'user_satisfaction_survey',
    surveyType: 'url'
  }
  var smallSurvey = {
    startTime: new Date('July 5, 2016').getTime(),
    endTime: new Date('July 10, 2016 23:50:00').getTime(),
    url: 'example.com/small-survey',
    surveyType: 'url'
  }
  var urlSurvey = {
    surveyType: 'url',
    url: 'smartsurvey.co.ukdefault',
    identifier: 'url-survey'
  }
  var emailSurvey = {
    surveyType: 'email',
    url: 'smartsurvey.co.ukdefault',
    identifier: 'email-survey'
  }

  beforeEach(function () {
    $block = $('<div class="emergency-banner" style="display: none"></div>' +
               '<div id="global-cookie-message" style="display: none"></div>' +
               '<div id="taxonomy-survey" style="display: none"></div>' +
               '<div id="user-satisfaction-survey-container"></div>')

    $('body').append($block)
    $('#user-satisfaction-survey').remove()

    // Don't actually try and take a survey in test.
    document.addEventListener('click', function (e) {
      var matchingIds = ['take-survey', 'user-survey-cancel', 'email-survey-open']
      if (matchingIds.indexOf(e.target.getAttribute('id')) >= 0) { // true
        e.preventDefault()
      }
    })

    GOVUK.analytics = {
      trackEvent: function () {},
      gaClientId: '12345.67890'
    }
  })

  afterEach(function () {
    $.each([defaultSurvey, smallSurvey, urlSurvey, emailSurvey], function (_idx, survey) {
      GOVUK.cookie(surveys.surveyTakenCookieName(survey), null)
      GOVUK.cookie(surveys.surveySeenCookieName(survey), null)
    })
    $block.remove()
    $('#global-bar').remove()
  })

  describe('init', function () {
    it('shows a survey if we can show any surveys', function () {
      spyOn(surveys, 'canShowAnySurvey').and.returnValue(true)
      spyOn(surveys, 'getActiveSurvey').and.returnValue(surveys.defaultSurvey)
      spyOn(surveys, 'randomNumberMatches').and.returnValue(true)
      surveys.init()

      expect($('#take-survey').attr('href')).toContain(surveys.addParamsToURL(surveys.getSurveyUrl(surveys.defaultSurvey)))
      expect($('#user-satisfaction-survey').length).toBe(1)
      expect($('#user-satisfaction-survey').hasClass('visible')).toBe(true)
      expect($('#user-satisfaction-survey').attr('aria-hidden')).toBe('false')
    })

    it('fails quickly if we cannot show any surveys', function () {
      spyOn(surveys, 'canShowAnySurvey').and.returnValue(false)
      spyOn(surveys, 'getActiveSurvey')
      surveys.init()

      expect(surveys.getActiveSurvey).not.toHaveBeenCalled()
    })
  })

  describe('displaySurvey', function () {
    it('displays the user satisfaction div', function () {
      expect($('#user-satisfaction-survey').length).toBe(0)
      surveys.displaySurvey(defaultSurvey)
      expect($('#user-satisfaction-survey').length).toBe(1)
      expect($('#user-satisfaction-survey').hasClass('visible')).toBe(true)
      expect($('#user-satisfaction-survey').attr('aria-hidden')).toBe('false')
    })

    it('increments the survey seen cookie counter', function () {
      GOVUK.cookie(surveys.surveySeenCookieName(defaultSurvey), null)
      surveys.displaySurvey(defaultSurvey)
      expect(GOVUK.cookie(surveys.surveySeenCookieName(defaultSurvey))).toBe('1')
    })

    describe("for a 'url' survey", function () {
      it('records an event when showing the survey', function () {
        spyOn(surveys, 'trackEvent')
        surveys.displaySurvey(urlSurvey)
        expect(surveys.trackEvent).toHaveBeenCalledWith(urlSurvey.identifier, 'banner_shown', 'Banner has been shown')
      })

      it('sets event handlers on the survey', function () {
        spyOn(surveys, 'setURLSurveyEventHandlers')
        surveys.displaySurvey(urlSurvey)
        expect(surveys.setURLSurveyEventHandlers).toHaveBeenCalledWith(urlSurvey)
      })

      it('replaces the current path if the survey url contains the {{currentPath}} template parameter', function () {
        var urlSurveyWithCurrentPath = {
          surveyType: 'url',
          url: 'smartsurvey.com/default?c={{currentPath}}',
          identifier: 'url-survey'
        }
        surveys.displaySurvey(urlSurveyWithCurrentPath)

        expect($('#take-survey').attr('href')).toContain('?c=' + window.location.pathname)
      })

      it('does not inject the current path if the survey url does not contain the {{currentPath}} template parameter', function () {
        surveys.displaySurvey(urlSurvey)

        var expectedUrl = urlSurvey.url + '?gcl=' + GOVUK.analytics.gaClientId

        expect($('#take-survey').attr('href')).toEqual(expectedUrl)
      })

      describe('without overrides for the template defaults', function () {
        it('uses the default title', function () {
          surveys.displaySurvey(urlSurvey)

          expect($('#user-satisfaction-survey h2').text()).toEqual('Tell us what you think of GOV.UK')
        })

        it('uses the default call-to-action text', function () {
          surveys.displaySurvey(urlSurvey)

          expect($('#user-satisfaction-survey .survey-primary-link').text()).toEqual('Take the 3 minute survey')
        })

        it('uses the default call-to-action postscript text', function () {
          surveys.displaySurvey(urlSurvey)

          expect($('#user-satisfaction-survey .postscript-cta').text()).toEqual('This will open a short survey on another website')
        })
      })

      describe('with overrides for the template defaults', function () {
        it('uses the title defined in the survey', function () {
          var survey = {
            surveyType: 'url',
            url: 'surveymonkey.com/default',
            identifier: 'url-survey',
            templateArgs: { title: 'Take my survey' }
          }
          surveys.displaySurvey(survey)
          expect($('#user-satisfaction-survey h2').text()).toEqual('Take my survey')
        })

        it('uses the call to action text defined in survey', function () {
          var survey = {
            surveyType: 'url',
            url: 'surveymonkey.com/default',
            identifier: 'url-survey',
            templateArgs: { surveyCta: 'Do it, do it now!' }
          }
          surveys.displaySurvey(survey)
          expect($('#user-satisfaction-survey .survey-primary-link').text()).toEqual('Do it, do it now!')
        })

        it('uses the call to action postscript text defined in the survey', function () {
          var survey = {
            surveyType: 'url',
            url: 'surveymonkey.com/default',
            identifier: 'url-survey',
            templateArgs: { surveyCtaPostscript: 'This is a nice survey, please take it.' }
          }
          surveys.displaySurvey(survey)
          expect($('#user-satisfaction-survey .postscript-cta').text()).toEqual('This is a nice survey, please take it.')
        })
      })
    })

    describe("for an 'email' survey", function () {
      it('adds the survey identifier to the form', function () {
        surveys.displaySurvey(emailSurvey)

        expect($('#email-survey-form input[name="email_survey_signup[survey_id]"]').val()).toEqual(emailSurvey.identifier)
      })

      it('adds the current path to the form', function () {
        surveys.displaySurvey(emailSurvey)

        expect($('#email-survey-form input[name="email_survey_signup[survey_source]"]').val()).toEqual(window.location.pathname)
      })

      it('adds the GA client ID to the form', function () {
        surveys.displaySurvey(emailSurvey)

        expect($('#email-survey-form input[name="email_survey_signup[ga_client_id]"]').val()).toEqual(GOVUK.analytics.gaClientId)
      })

      it('sets event handlers on the survey', function () {
        spyOn(surveys, 'setEmailSurveyEventHandlers')
        surveys.displaySurvey(emailSurvey)
        expect(surveys.setEmailSurveyEventHandlers).toHaveBeenCalledWith(emailSurvey)
      })

      it('records an event when showing the survey', function () {
        spyOn(surveys, 'trackEvent')
        surveys.displaySurvey(emailSurvey)
        expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'banner_shown', 'Banner has been shown')
      })

      it('replaces the current path if the survey url contains the {{currentPath}} template parameter', function () {
        var emailSurveyWithCurrentPath = {
          surveyType: 'email',
          url: 'smartsurvey.com/default?c={{currentPath}}',
          identifier: 'email-survey'
        }
        surveys.displaySurvey(emailSurveyWithCurrentPath)

        expect($('#take-survey').attr('href')).toContain('?c=' + window.location.pathname)
      })

      it('does not inject the current path if the {{currentPath}} template parameter is missing', function () {
        surveys.displaySurvey(emailSurvey)

        expect($('#take-survey').attr('href')).not.toContain('?c=' + window.location.pathname)
      })

      it('adds the GA client ID to the survey url if the {{currentPath}} template parameter is present', function () {
        var emailSurveyWithCurrentPath = {
          surveyType: 'email',
          url: 'smartsurvey.com/default?c={{currentPath}}',
          identifier: 'email-survey'
        }
        surveys.displaySurvey(emailSurveyWithCurrentPath)

        expect($('#take-survey').attr('href')).toContain('?c=' + window.location.pathname + '&gcl=' + GOVUK.analytics.gaClientId)
      })

      it('adds the GA client ID to the survey url if the {{currentPath}} template parameter is missing', function () {
        surveys.displaySurvey(emailSurvey)

        expect($('#take-survey').attr('href')).toEqual(emailSurvey.url + '?gcl=' + GOVUK.analytics.gaClientId)
      })

      describe('without overrides for the template defaults', function () {
        it('uses the default title', function () {
          surveys.displaySurvey(emailSurvey)

          expect($('#user-satisfaction-survey h2').text()).toEqual('Tell us what you think of GOV.UK')
        })

        it('uses the default call-to-action text', function () {
          surveys.displaySurvey(emailSurvey)

          expect($('#user-satisfaction-survey .survey-primary-link').text()).toEqual('    Take a short survey to give us your feedback  ')
        })

        it('uses the default survey form call-to-action-postscript text', function () {
          surveys.displaySurvey(emailSurvey)

          expect($('#user-satisfaction-survey form #survey-form-description').text()).toEqual('We’ll send you a link to a feedback form. It only takes 2 minutes to fill in.       Don’t worry: we won’t send you spam or share your email address with anyone.    ')
        })

        it('uses the default survey form success text', function () {
          surveys.displaySurvey(emailSurvey)

          expect($('#user-satisfaction-survey #email-survey-post-success').text()).toEqual('  Thanks, we’ve sent you an email with a link to the survey.')
        })

        it('uses the default survey form failure text', function () {
          surveys.displaySurvey(emailSurvey)

          expect($('#user-satisfaction-survey  #email-survey-post-failure').text()).toEqual('  Sorry, we’re unable to send you an email right now. Please try again later.')
        })
      })

      describe('with overrides for the template defaults', function () {
        it('uses the title defined in the survey', function () {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            frequency: 6,
            startTime: new Date('July 17, 2017').getTime(),
            endTime: new Date('August 16, 2017 23:59:50').getTime(),
            url: 'https://www.smartsurvey.co.uk/s/govukpublisherguidance?c={{currentPath}}',
            templateArgs: {
              title: 'Do you like email?'
            }
          }
          surveys.displaySurvey(survey)

          expect($('#user-satisfaction-survey h2').text()).toEqual('Do you like email?')
        })

        it('uses the call to action text defined in the survey', function () {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            frequency: 6,
            startTime: new Date('July 17, 2017').getTime(),
            endTime: new Date('August 16, 2017 23:59:50').getTime(),
            url: 'https://www.smartsurvey.co.uk/s/govukpublisherguidance?c={{currentPath}}',
            templateArgs: {
              surveyCta: 'Click here now!'
            }
          }
          surveys.displaySurvey(survey)

          expect($('#user-satisfaction-survey .survey-primary-link').text()).toEqual('    Click here now!  ')
        })

        it('uses the survey form call to action defined in the survey', function () {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            frequency: 6,
            startTime: new Date('July 17, 2017').getTime(),
            endTime: new Date('August 16, 2017 23:59:50').getTime(),
            url: 'https://www.smartsurvey.co.uk/s/govukpublisherguidance?c={{currentPath}}',
            templateArgs: {
              surveyFormCta: 'Clicking this sends us your address'
            }
          }
          surveys.displaySurvey(survey)

          expect($('#user-satisfaction-survey form button').text()).toEqual('Clicking this sends us your address')
        })

        it('uses the survey form call to action postscript defined in the survey', function () {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            frequency: 6,
            startTime: new Date('July 17, 2017').getTime(),
            endTime: new Date('August 16, 2017 23:59:50').getTime(),
            url: 'https://www.smartsurvey.co.uk/s/govukpublisherguidance?c={{currentPath}}',
            templateArgs: {
              title: 'Do you like email?'
            }
          }
          surveys.displaySurvey(survey)

          expect($('#user-satisfaction-survey h2').text()).toEqual('Do you like email?')
        })

        it('uses the call to action text defined in the survey', function () {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            frequency: 6,
            startTime: new Date('July 17, 2017').getTime(),
            endTime: new Date('August 16, 2017 23:59:50').getTime(),
            url: 'https://www.smartsurvey.co.uk/s/govukpublisherguidance?c={{currentPath}}',
            templateArgs: {
              surveyCta: 'Click here now!'
            }
          }
          surveys.displaySurvey(survey)

          expect($('#user-satisfaction-survey .survey-primary-link').text()).toEqual('    Click here now!  ')
        })

        it('uses the survey form call to action defined in the survey', function () {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            frequency: 6,
            startTime: new Date('July 17, 2017').getTime(),
            endTime: new Date('August 16, 2017 23:59:50').getTime(),
            url: 'https://www.smartsurvey.co.uk/s/govukpublisherguidance?c={{currentPath}}',
            templateArgs: {
              surveyFormCta: 'Clicking this sends us your address'
            }
          }
          surveys.displaySurvey(survey)

          expect($('#user-satisfaction-survey form button').text()).toEqual('Clicking this sends us your address')
        })

        it('uses the survey form call to action postscript defined in the survey', function () {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            frequency: 6,
            startTime: new Date('July 17, 2017').getTime(),
            endTime: new Date('August 16, 2017 23:59:50').getTime(),
            url: 'https://www.smartsurvey.co.uk/s/govukpublisherguidance?c={{currentPath}}',
            templateArgs: {
              surveyFormDescription: 'We will be sending you a link.',
              surveyFormCtaPostscript: 'We will not send you spam'
            }
          }
          surveys.displaySurvey(survey)

          expect($('#user-satisfaction-survey form #survey-form-description').text()).toEqual('We will be sending you a link.       We will not send you spam    ')
        })

        it('uses the survey form success text defined in the survey', function () {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            frequency: 6,
            startTime: new Date('July 17, 2017').getTime(),
            endTime: new Date('August 16, 2017 23:59:50').getTime(),
            url: 'https://www.smartsurvey.co.uk/s/govukpublisherguidance?c={{currentPath}}',
            templateArgs: {
              surveySuccess: 'Yay, it worked!'
            }
          }
          surveys.displaySurvey(survey)

          expect($('#user-satisfaction-survey  #email-survey-post-success').text()).toEqual('  Yay, it worked!')
        })

        it('uses the survey form failure text defined in the survey', function () {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            frequency: 6,
            startTime: new Date('July 17, 2017').getTime(),
            endTime: new Date('August 16, 2017 23:59:50').getTime(),
            url: 'https://www.smartsurvey.co.uk/s/govukpublisherguidance?c={{currentPath}}',
            templateArgs: {
              surveyFailure: 'Boo, it failed'
            }
          }
          surveys.displaySurvey(survey)

          expect($('#user-satisfaction-survey  #email-survey-post-failure').text()).toEqual('  Boo, it failed')
        })
      })
    })
  })

  describe('canShowAnySurvey', function () {
    it('returns false if any other notification is visible', function () {
      spyOn(surveys, 'otherNotificationVisible').and.returnValue(true)

      expect(surveys.canShowAnySurvey()).toBeFalsy()
    })

    it('returns false if the user has completed a transaction', function () {
      spyOn(surveys, 'userCompletedTransaction').and.returnValue(true)

      expect(surveys.canShowAnySurvey()).toBeFalsy()
    })

    it("returns false if the survey container isn't present", function () {
      $('#user-satisfaction-survey-container').remove()

      expect(surveys.canShowAnySurvey()).toBeFalsy()
    })

    it('returns false if the path is blacklisted', function () {
      spyOn(surveys, 'pathInBlocklist').and.returnValue(true)

      expect(surveys.canShowAnySurvey()).toBeFalsy()
    })

    it('returns true otherwise', function () {
      spyOn(surveys, 'otherNotificationVisible').and.returnValue(false)
      spyOn(surveys, 'userCompletedTransaction').and.returnValue(false)
      spyOn(surveys, 'pathInBlocklist').and.returnValue(false)
      expect(surveys.canShowAnySurvey()).toBeTruthy()
    })
  })

  describe('otherNotificationVisible', function () {
    beforeEach(function () {
      $('#global-cookie-message').css('display', 'none')
      $('.emergency-banner').css('display', 'none')
      $('#taxonomy-survey').css('display', 'none')
      $('#global-bar').css('display', 'none')
    })

    it('returns true if the global cookie banner is visible', function () {
      $('#global-cookie-message').css('display', 'block')

      expect(surveys.canShowAnySurvey(defaultSurvey)).toBeTruthy()
    })

    it('returns false if the emergency banner is visible', function () {
      $('.emergency-banner').css('display', 'block')

      expect(surveys.canShowAnySurvey(defaultSurvey)).toBeFalsy()
    })

    it('returns false if the taxonomy survey is visible', function () {
      $('#taxonomy-survey').css('display', 'block')

      expect(surveys.canShowAnySurvey(defaultSurvey)).toBeFalsy()
    })
  })

  describe('isSurveyToBeDisplayed', function () {
    describe('when the page is viewed on desktop', function () {
      beforeEach(function () {
        spyOn(surveys, 'isBeingViewedOnMobile').and.returnValue(false)
      })

      it("returns false if the 'survey taken' cookie is set", function () {
        GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey), 'true')
        expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy()
      })

      it('returns false when the random number does not match', function () {
        spyOn(surveys, 'randomNumberMatches').and.returnValue(false)
        expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy()
      })

      it('returns false if the survey has been seen too many times', function () {
        spyOn(surveys, 'surveyHasBeenSeenTooManyTimes').and.returnValue(true)
        expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy()
      })

      it('returns true when the random number matches', function () {
        spyOn(surveys, 'randomNumberMatches').and.returnValue(true)
        expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeTruthy()
      })

      it('returns true even if the survey is not allowed on mobile', function () {
        spyOn(surveys, 'surveyIsAllowedOnMobile').and.returnValue(false)
        spyOn(surveys, 'randomNumberMatches').and.returnValue(true)
        expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeTruthy()
      })

      it('returns true even if the survey is allowed on mobile', function () {
        spyOn(surveys, 'surveyIsAllowedOnMobile').and.returnValue(true)
        spyOn(surveys, 'randomNumberMatches').and.returnValue(true)
        expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeTruthy()
      })
    })

    describe('when the page is viewed on mobile', function () {
      beforeEach(function () {
        spyOn(surveys, 'isBeingViewedOnMobile').and.returnValue(true)
      })

      it("returns false if the 'survey taken' cookie is set", function () {
        GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey), 'true')
        expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy()
      })

      it('returns false when the random number does not match', function () {
        spyOn(surveys, 'randomNumberMatches').and.returnValue(false)
        expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy()
      })

      it('returns false if the survey has been seen too many times', function () {
        spyOn(surveys, 'surveyHasBeenSeenTooManyTimes').and.returnValue(true)
        expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy()
      })

      it('returns true when the random number matches and is allowed on mobile', function () {
        spyOn(surveys, 'surveyIsAllowedOnMobile').and.returnValue(true)
        spyOn(surveys, 'randomNumberMatches').and.returnValue(true)
        expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeTruthy()
      })

      it('returns false when the random number matches and is not allowed on mobile', function () {
        spyOn(surveys, 'surveyIsAllowedOnMobile').and.returnValue(false)
        spyOn(surveys, 'randomNumberMatches').and.returnValue(true)
        expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy()
      })
    })
  })

  describe('currentTlsVersion', function () {
    beforeEach(function () {
      window.GOVUK.setConsentCookie({ usage: true })
    })

    afterEach(function () {
      window.GOVUK.setCookie('TLSversion', '')
    })

    it('returns an empty string when the cookie returns null', function () {
      window.GOVUK.setCookie('TLSversion', '')
      expect(surveys.currentTlsVersion()).toBe('')
    })

    it('returns an empty string when the cookie returns "unknown"', function () {
      window.GOVUK.setCookie('TLSversion', 'unknown')
      expect(surveys.currentTlsVersion()).toBe('')
    })

    it('returns the correct version when the cookie returns a valid value"', function () {
      window.GOVUK.setCookie('TLSversion', 'TLSv1.1')
      expect(surveys.currentTlsVersion()).toBe(1.1)
    })

    it('returns an empty string when the TLS version is malformed"', function () {
      window.GOVUK.setCookie('TLSversion', 'TLSvabcd11123')
      expect(surveys.currentTlsVersion()).toBe('')
    })
  })

  describe('pathInBlocklist', function () {
    // we make sure that slash-terminated and slash-unterminated versions
    // of these paths work
    it('returns true if the path is /service-manual', function () {
      spyOn(surveys, 'currentPath').and.returnValues('/service-manual', '/service-manual/')
      expect(surveys.pathInBlocklist()).toBeTruthy()
      expect(surveys.pathInBlocklist()).toBeTruthy()
    })

    it('returns true if the path is a sub-folder under /service-manual', function () {
      spyOn(surveys, 'currentPath').and.returnValues('/service-manual/some-other-page', '/service-manual/some-other-page/')
      expect(surveys.pathInBlocklist()).toBeTruthy()
      expect(surveys.pathInBlocklist()).toBeTruthy()
    })

    it('returns false if the path is /service-manual-with-a-suffix', function () {
      spyOn(surveys, 'currentPath').and.returnValues('/service-manual-with-a-suffix', '/service-manual-with-a-suffix/')
      expect(surveys.pathInBlocklist()).toBeFalsy()
      expect(surveys.pathInBlocklist()).toBeFalsy()
    })

    it('returns false if the path is /some-other-parent-of/service-manual', function () {
      spyOn(surveys, 'currentPath').and.returnValues('/some-other-parent-of/service-manual', '/some-other-parent-of/service-manual/')
      expect(surveys.pathInBlocklist()).toBeFalsy()
      expect(surveys.pathInBlocklist()).toBeFalsy()
    })

    it('returns true if the path is /account', function () {
      spyOn(surveys, 'currentPath').and.returnValues('/account', '/account/')
      expect(surveys.pathInBlocklist()).toBeTruthy()
      expect(surveys.pathInBlocklist()).toBeTruthy()
    })

    it('returns true if the path is a sub-folder under /account', function () {
      spyOn(surveys, 'currentPath').and.returnValues('/account/home', '/account/home/')
      expect(surveys.pathInBlocklist()).toBeTruthy()
      expect(surveys.pathInBlocklist()).toBeTruthy()
    })

    it('returns false otherwise', function () {
      spyOn(surveys, 'currentPath').and.returnValue('/')
      expect(surveys.pathInBlocklist()).toBeFalsy()
    })
  })

  describe('userCompletedTransaction', function () {
    it('normally returns false', function () {
      spyOn(surveys, 'currentPath').and.returnValue('/')
      expect(surveys.userCompletedTransaction()).toBeFalsy()
    })

    it('returns true when /done', function () {
      spyOn(surveys, 'currentPath').and.returnValue('/done')
      expect(surveys.userCompletedTransaction()).toBeTruthy()
    })

    it('returns true when /transaction-finished', function () {
      spyOn(surveys, 'currentPath').and.returnValue('/transaction-finished')
      expect(surveys.userCompletedTransaction()).toBeTruthy()
    })

    it('returns true when /driving-transaction-finished', function () {
      spyOn(surveys, 'currentPath').and.returnValue('/driving-transaction-finished')
      expect(surveys.userCompletedTransaction()).toBeTruthy()
    })
  })

  describe('Event handlers', function () {
    describe('for a url survey', function () {
      beforeEach(function () {
        surveys.displaySurvey(defaultSurvey)
      })

      it("sets a cookie when clicking 'take survey'", function () {
        $('#take-survey')[0].click()
        expect(GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey))).toBe('true')
      })

      it("sets a cookie when clicking 'no thanks'", function () {
        $('#user-survey-cancel')[0].click()
        expect(GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey))).toBe('true')
      })

      it("hides the satisfaction survey bar after clicking 'take survey'", function () {
        $('#take-survey')[0].click()
        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false)
        expect($('#user-satisfaction-survey').attr('aria-hidden')).toBe('true')
      })

      it("hides the satisfaction survey bar after clicking 'no thanks'", function () {
        $('#user-survey-cancel')[0].click()
        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false)
      })

      it("records an event when clicking 'take survey'", function () {
        spyOn(surveys, 'trackEvent')
        $('#take-survey')[0].click()
        expect(surveys.trackEvent).toHaveBeenCalledWith(defaultSurvey.identifier, 'banner_taken', 'User taken survey')
      })

      it("records an event when clicking 'no thanks'", function () {
        spyOn(surveys, 'trackEvent')
        $('#user-survey-cancel')[0].click()
        expect(surveys.trackEvent).toHaveBeenCalledWith(defaultSurvey.identifier, 'banner_no_thanks', 'No thanks clicked')
      })
    })

    describe('for an email survey', function () {
      var emailSurvey = {
        surveyType: 'email',
        identifier: 'email-survey',
        url: 'smartsurvey.co.ukdefault'
      }

      beforeEach(function () {
        surveys.displaySurvey(emailSurvey)
      })

      it("sets a cookie when clicking 'no thanks'", function () {
        $('#user-survey-cancel')[0].click()
        expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).toBe('true')
      })

      it("hides the satisfaction survey bar after clicking 'no thanks'", function () {
        $('#user-survey-cancel')[0].click()
        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false)
      })

      it("records an event when clicking 'no thanks'", function () {
        spyOn(surveys, 'trackEvent')
        emailSurvey.surveyExpanded = false
        $('#user-survey-cancel')[0].click()
        expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'banner_no_thanks', 'No thanks clicked')
      })

      it("opens the email form when clicking on 'Your feedback will help us ...'", function () {
        $('#email-survey-open')[0].click()
        expect($('#email-survey-form').hasClass('js-hidden')).toBe(false)
      })

      it("hides the invitation to take the survey when clicking on 'Your feedback will help us ...'", function () {
        $('#email-survey-open')[0].click()
        expect($('#email-survey-pre').hasClass('js-hidden')).toBe(true)
      })

      it("records an event when clicking on 'Your feedback will help us ...'", function () {
        spyOn(surveys, 'trackEvent')
        $('#email-survey-open')[0].click()
        expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'email_survey_open', 'Email survey opened')
      })

      describe('once the email form is opened', function () {
        beforeEach(function () {
          jasmine.Ajax.install()
        })

        afterEach(function () {
          jasmine.Ajax.uninstall()
        })

        it('sends the details to the feedback app with ajax when submitting the form', function () {
          window.GOVUK.triggerEvent($('#email-survey-form')[0], 'submit')

          var request = jasmine.Ajax.requests.mostRecent()
          expect(request.url).toBe('/contact/govuk/email-survey-signup.js')
        })

        it("doesn't add .js to the form action if it's already a .js url when submitting the form", function () {
          $('#email-survey-form').attr('action', '/contact/govuk/js-already/email-survey-signup.js')
          window.GOVUK.triggerEvent($('#email-survey-form')[0], 'submit')

          var request = jasmine.Ajax.requests.mostRecent()
          expect(request.url).toBe('/contact/govuk/js-already/email-survey-signup.js')
        })

        describe('and submitting it is a success', function () {
          beforeEach(function () {
            jasmine.Ajax.stubRequest('/contact/govuk/email-survey-signup.js').andReturn({
              status: 200
            })
          })

          it('opens the post submit success message', function () {
            window.GOVUK.triggerEvent($('#email-survey-form')[0], 'submit')
            expect($('#email-survey-post-success').hasClass('js-hidden')).toBe(false)
          })

          it('hides the email form', function () {
            window.GOVUK.triggerEvent($('#email-survey-form')[0], 'submit')
            expect($('#email-survey-form').hasClass('js-hidden')).toBe(true)
          })

          it('sets a cookie', function () {
            window.GOVUK.triggerEvent($('#email-survey-form')[0], 'submit')
            expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).toBe('true')
          })

          it('records an event', function () {
            spyOn(surveys, 'trackEvent')
            window.GOVUK.triggerEvent($('#email-survey-form')[0], 'submit')
            expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'email_survey_taken', 'Email survey taken')
            expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'banner_taken', 'User taken survey')
          })
        })

        describe('but submitting it results in an error', function () {
          beforeEach(function () {
            jasmine.Ajax.stubRequest('/contact/govuk/email-survey-signup.js').andReturn({
              status: 422
            })
          })

          it('opens the post submit failure message', function () {
            window.GOVUK.triggerEvent($('#email-survey-form')[0], 'submit')
            expect($('#email-survey-post-failure').hasClass('js-hidden')).toBe(false)
          })

          it('hides the email form', function () {
            window.GOVUK.triggerEvent($('#email-survey-form')[0], 'submit')
            expect($('#email-survey-form').hasClass('js-hidden')).toBe(true)
          })

          it('does not sets a cookie', function () {
            window.GOVUK.triggerEvent($('#email-survey-form')[0], 'submit')
            expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).not.toBe('true')
          })

          it('does not records any events', function () {
            spyOn(surveys, 'trackEvent')
            window.GOVUK.triggerEvent($('#email-survey-form')[0], 'submit')
            expect(surveys.trackEvent).not.toHaveBeenCalled()
          })
        })

        it("hides the email form when clicking 'No thanks'", function () {
          $('#user-survey-cancel')[0].click()
          expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).toBe('true')
        })

        it("hides the whole email survey interface after clicking 'no thanks'", function () {
          $('#user-survey-cancel')[0].click()
          expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false)
        })

        it("records an event when clicking 'no thanks'", function () {
          spyOn(surveys, 'trackEvent')
          emailSurvey.surveyExpanded = true
          $('#user-survey-cancel')[0].click()
          expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'email_survey_cancel', 'Email survey cancelled')
        })

        it("hides the email form when clicking 'take survey' if no email", function () {
          $('#take-survey')[0].click()
          expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).toBe('true')
        })

        it("hides the whole email survey interface after clicking 'take survey' if no email", function () {
          $('#take-survey')[0].click()
          expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false)
        })

        it("records an event when clicking 'take survey' if no email", function () {
          spyOn(surveys, 'trackEvent')
          $('#take-survey')[0].click()
          expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'no_email_link', 'User taken survey via no email link')
        })
      })
    })
  })

  describe('currentTime', function () {
    it('actually returns a value from `currentTime`', function () {
      expect(surveys.currentTime()).not.toBe(undefined)
    })
  })

  describe('surveyTakenCookieName', function () {
    it('returns a cookie name based on the survey identifier', function () {
      var surveyMock = { identifier: 'sample_survey' }
      expect(surveys.surveyTakenCookieName(surveyMock)).toBe('govuk_takenSampleSurvey')
    })
  })

  describe('surveySeenCookieName', function () {
    it('returns a cookie name based on the survey identifier', function () {
      var surveyMock = { identifier: 'sample_survey' }
      expect(surveys.surveySeenCookieName(surveyMock)).toBe('govuk_surveySeenSampleSurvey')
    })
  })

  describe('surveyHasBeenSeenTooManyTimes', function () {
    it('returns false if the survey seen cookie is not set', function () {
      GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), null)
      expect(surveys.surveyHasBeenSeenTooManyTimes(smallSurvey)).toBeFalsy()
    })

    it('returns false if the survey seen cookie is set but the value is not a number', function () {
      GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), 'a few times')
      expect(surveys.surveyHasBeenSeenTooManyTimes(smallSurvey)).toBeFalsy()
    })

    describe('for surveys without a configured seenTooManyTimesLimit', function () {
      it('returns false if the survey seen cookie is set and the value is less than 2', function () {
        GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), 0)
        expect(surveys.surveyHasBeenSeenTooManyTimes(smallSurvey)).toBeFalsy()

        GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), 1)
        expect(surveys.surveyHasBeenSeenTooManyTimes(smallSurvey)).toBeFalsy()
      })

      it('returns true if the survey seen cookie is set and the value is exactly 2', function () {
        GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), 2)
        expect(surveys.surveyHasBeenSeenTooManyTimes(smallSurvey)).toBeTruthy()
      })

      it('returns true if the survey seen cookie is set and the value is more than 2', function () {
        GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), 10)
        expect(surveys.surveyHasBeenSeenTooManyTimes(smallSurvey)).toBeTruthy()
      })
    })

    describe('for surveys that configure their own seenTooManyTimesLimit', function () {
      var bigLimitSurvey = { identifier: 'big_limit_survey', seenTooManyTimesLimit: 4 }

      it('returns false if the survey seen cookie is set and the value is less than the limit', function () {
        GOVUK.cookie(surveys.surveySeenCookieName(bigLimitSurvey), 0)
        expect(surveys.surveyHasBeenSeenTooManyTimes(bigLimitSurvey)).toBeFalsy()

        GOVUK.cookie(surveys.surveySeenCookieName(bigLimitSurvey), 1)
        expect(surveys.surveyHasBeenSeenTooManyTimes(bigLimitSurvey)).toBeFalsy()

        GOVUK.cookie(surveys.surveySeenCookieName(bigLimitSurvey), 2)
        expect(surveys.surveyHasBeenSeenTooManyTimes(bigLimitSurvey)).toBeFalsy()

        GOVUK.cookie(surveys.surveySeenCookieName(bigLimitSurvey), 3)
        expect(surveys.surveyHasBeenSeenTooManyTimes(bigLimitSurvey)).toBeFalsy()
      })

      it('returns true if the survey seen cookie is set and the value is exactly the limit', function () {
        GOVUK.cookie(surveys.surveySeenCookieName(bigLimitSurvey), 4)
        expect(surveys.surveyHasBeenSeenTooManyTimes(bigLimitSurvey)).toBeTruthy()
      })

      it('returns true if the survey seen cookie is set and the value is greater than the limit', function () {
        GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), 10)
        expect(surveys.surveyHasBeenSeenTooManyTimes(smallSurvey)).toBeTruthy()
      })
    })

    describe('for unlimited surveys', function () {
      var unlimitedSurvey = { identifier: 'unlimited_survey', seenTooManyTimesLimit: 'unlimited' }

      it('returns false', function () {
        GOVUK.cookie(surveys.surveySeenCookieName(unlimitedSurvey), 2000)
        expect(surveys.surveyHasBeenSeenTooManyTimes(unlimitedSurvey)).toBeFalsy()
      })
    })
  })

  describe('surveySeenTooManyTimesLimit', function () {
    it('returns the default limit (2) if the survey is not configured with a limit', function () {
      var survey = { identifier: 'no_configured_limit' }
      expect(surveys.surveySeenTooManyTimesLimit(survey)).toBe(2)
    })

    it('returns the configured limit if the survey is configured with a limit', function () {
      var survey = { identifier: 'no_configured_limit', seenTooManyTimesLimit: 3 }
      expect(surveys.surveySeenTooManyTimesLimit(survey)).toBe(3)
    })

    it('returns the default limit (2) if the survey is configured with a limit that is not a number', function () {
      var survey = { identifier: 'no_configured_limit', seenTooManyTimesLimit: 'a couple of times' }
      expect(surveys.surveySeenTooManyTimesLimit(survey)).toBe(2)
    })

    it('returns the default limit (2) if the survey is configured with a limit that is less than 1', function () {
      var survey = { identifier: 'no_configured_limit', seenTooManyTimesLimit: 0 }
      expect(surveys.surveySeenTooManyTimesLimit(survey)).toBe(2)
    })

    it('returns Infinity if the survey is configured with a limit that is the string "unlimited"', function () {
      var survey = { identifier: 'no_configured_limit', seenTooManyTimesLimit: 'unlimited' }
      expect(surveys.surveySeenTooManyTimesLimit(survey)).toBe(Infinity)

      survey.seenTooManyTimesLimit = 'UNLIMITED'
      expect(surveys.surveySeenTooManyTimesLimit(survey)).toBe(Infinity)
    })
  })

  describe('getActiveSurveys', function () {
    it('returns an empty array when no surveys are present', function () {
      expect(surveys.getActiveSurveys([])).toHaveLength(0)
    })

    it('does not include a survey that has not started yet', function () {
      var testSurvey = {
        startTime: new Date('July 5, 2016').getTime(),
        endTime: new Date('July 10, 2016 23:50:00').getTime(),
        url: 'example.com/test-survey'
      }
      spyOn(surveys, 'currentTime').and.returnValue(new Date('July 04, 2016 10:00:00').getTime())

      var activeSurveys = surveys.getActiveSurveys([testSurvey])
      expect(activeSurveys).not.toContain(testSurvey)
    })

    it('does not include a survey that has finished', function () {
      var testSurvey = {
        startTime: new Date('July 5, 2016').getTime(),
        endTime: new Date('July 10, 2016 23:50:00').getTime(),
        url: 'example.com/test-survey'
      }
      spyOn(surveys, 'currentTime').and.returnValue(new Date('July 11, 2016 10:00:00').getTime())

      var activeSurveys = surveys.getActiveSurveys([testSurvey])
      expect(activeSurveys).not.toContain(testSurvey)
    })

    it('includes the survey when we are between its start and end times', function () {
      var testSurvey = {
        startTime: new Date('July 5, 2016').getTime(),
        endTime: new Date('July 10, 2016 23:50:00').getTime(),
        url: 'example.com/test-survey'
      }
      spyOn(surveys, 'currentTime').and.returnValue(new Date('July 9, 2016 10:00:00').getTime())

      var activeSurveys = surveys.getActiveSurveys([testSurvey])
      expect(activeSurveys).toContain(testSurvey)
    })

    describe('checking activeWhen attribute', function () {
      it('includes the survey when the activeWhen function returns true', function () {
        spyOn(surveys, 'currentTime').and.returnValue(new Date('July 9, 2016 10:00:00').getTime())
        var testSurvey = {
          startTime: new Date('July 5, 2016').getTime(),
          endTime: new Date('July 10, 2016 23:50:00').getTime(),
          activeWhen: function () { return true },
          url: 'example.com/small-survey'
        }
        spyOn(surveys, 'activeWhen').and.returnValue(true)

        var activeSurveys = surveys.getActiveSurveys([testSurvey])
        expect(activeSurveys).toContain(testSurvey)
      })

      it('does not include the survey when the activeWhen function returns false', function () {
        spyOn(surveys, 'currentTime').and.returnValue(new Date('July 9, 2016 10:00:00').getTime())
        var testSurvey = {
          startTime: new Date('July 5, 2016').getTime(),
          endTime: new Date('July 10, 2016 23:50:00').getTime(),
          url: 'example.com/small-survey'
        }
        spyOn(surveys, 'activeWhen').and.returnValue(false)

        var activeSurveys = surveys.getActiveSurveys([testSurvey])
        expect(activeSurveys).not.toContain(testSurvey)
      })

      it('includes the survey when it has no activeWhen function', function () {
        spyOn(surveys, 'currentTime').and.returnValue(new Date('July 9, 2016 10:00:00').getTime())
        var testSurvey = {
          startTime: new Date('July 5, 2016').getTime(),
          endTime: new Date('July 10, 2016 23:50:00').getTime(),
          url: 'example.com/small-survey'
        }

        var activeSurveys = surveys.getActiveSurveys([testSurvey])
        expect(activeSurveys).toContain(testSurvey)
      })
    })
  })

  describe('incrementSurveySeenCounter', function () {
    it("sets the value of the cookie to 1 if it's not set", function () {
      var survey = { identifier: 'my_survey' }
      var cookieName = surveys.surveySeenCookieName(survey)
      GOVUK.cookie(cookieName, null)
      surveys.incrementSurveySeenCounter(survey)
      expect(GOVUK.cookie(cookieName)).toBe('1')
    })

    it("increments the value of the cookie by 1 if it's already set", function () {
      var survey = { identifier: 'my_survey' }
      var cookieName = surveys.surveySeenCookieName(survey)
      GOVUK.cookie(cookieName, 3)
      surveys.incrementSurveySeenCounter(survey)
      expect(GOVUK.cookie(cookieName)).toBe('4')
    })

    it("sets the value of the cookie to 1 if it's set to something that's not a number", function () {
      var survey = { identifier: 'my_survey' }
      var cookieName = surveys.surveySeenCookieName(survey)
      GOVUK.cookie(cookieName, 'a couple of times')
      surveys.incrementSurveySeenCounter(survey)
      expect(GOVUK.cookie(cookieName)).toBe('1')
    })

    it("sets the value of the cookie to 1 if it's set to a number less than 1", function () {
      var survey = { identifier: 'my_survey' }
      var cookieName = surveys.surveySeenCookieName(survey)
      GOVUK.cookie(cookieName, -1)
      surveys.incrementSurveySeenCounter(survey)
      expect(GOVUK.cookie(cookieName)).toBe('1')
    })

    describe('for surveys with no seenTooManyTimesCooloff', function () {
      it('sets the cookie to session scope', function () {
        var survey = { identifier: 'my_survey' }
        var cookieName = surveys.surveySeenCookieName(survey)
        spyOn(GOVUK, 'cookie')
        surveys.incrementSurveySeenCounter(survey)
        expect(GOVUK.cookie).toHaveBeenCalledWith(cookieName, 1, { days: 365 * 2 })
      })
    })

    describe('for surveys with a seenTooManyTimesCooloff', function () {
      it('sets the cookie to expire in that many days', function () {
        var survey = { identifier: 'my_survey', seenTooManyTimesCooloff: 10 }
        var cookieName = surveys.surveySeenCookieName(survey)
        spyOn(GOVUK, 'cookie')
        surveys.incrementSurveySeenCounter(survey)
        expect(GOVUK.cookie).toHaveBeenCalledWith(cookieName, 1, { days: 10 })
      })
    })
  })

  describe('getDisplayableSurveys', function () {
    it('does not include a survey that should not be displayed', function () {
      spyOn(surveys, 'isSurveyToBeDisplayed').and.returnValue(false)
      var testSurvey = {
        startTime: new Date('July 5, 2016').getTime(),
        endTime: new Date('July 10, 2016 23:50:00').getTime(),
        url: 'example.com/small-survey'
      }

      var displayableSurveys = surveys.getDisplayableSurveys([testSurvey])
      expect(displayableSurveys).not.toContain(testSurvey)
    })

    it('includes a survey if it should be displayed', function () {
      spyOn(surveys, 'isSurveyToBeDisplayed').and.returnValue(true)
      var testSurvey = {
        startTime: new Date('July 5, 2016').getTime(),
        endTime: new Date('July 10, 2016 23:50:00').getTime(),
        url: 'example.com/small-survey'
      }

      var displayableSurveys = surveys.getDisplayableSurveys([testSurvey])
      expect(displayableSurveys).toContain(testSurvey)
    })
  })

  describe('activeWhen', function () {
    it('returns true if the survey has empty activeWhen definitions', function () {
      var survey = {
        identifier: 'a_survey'
      }
      expect(surveys.activeWhen(survey)).toBe(true)

      survey.activeWhen = {}
      expect(surveys.activeWhen(survey)).toBe(true)
    })

    describe("for 'include' matchType", function () {
      describe('path matches', function () {
        it('returns true if the path definition matches a complete path segment in the currentPath', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['foo']
            }
          }
          spyOn(surveys, 'currentPath').and.returnValues('/foo', '/foo/bar', '/bar/foo')
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('allows path separators in the path definition, returning true if they match a complete set of path segments in the currentPath', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['foo/bar']
            }
          }
          spyOn(surveys, 'currentPath').and.returnValues('/foo', '/foo/bar', '/bar/foo', '/baz/foo/bar/qux')
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if the path definition does not match the currentPath at all', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['foo']
            }
          }
          spyOn(surveys, 'currentPath').and.returnValue('/bar')
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns false if the path definition matches an incomplete path segment of the currentPath', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['foo']
            }
          }
          spyOn(surveys, 'currentPath').and.returnValues('/foo-bar', '/bar-foo', '/i/like/food/')
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns true if any of the path definitions matches a complete path segment in the currentPath', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['foo', 'bar', 'baz']
            }
          }
          spyOn(surveys, 'currentPath').and.returnValues('/foo', '/food/bar', '/bard/baz/food')
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it("treats the path definition as a complete match, rather than a path segment match if it includes '^' or '$'", function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['^/foo$']
            }
          }
          spyOn(surveys, 'currentPath').and.returnValues('/foo', '/food', 'foo/', '/foo/bar', '/bar/foo')
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
        })
      })

      describe('breadcrumb matches', function () {
        it('returns true if the breadcrumb definition matches something in the breadcrumb text', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              breadcrumb: ['education']
            }
          }
          spyOn(surveys, 'currentBreadcrumb').and.returnValue('Home  Education and learning  Schools')
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if the breadcrumb definition does not match the breadcrumb text at all', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              breadcrumb: ['childcare']
            }
          }
          spyOn(surveys, 'currentBreadcrumb').and.returnValue('Home  Education and learning  Schools')
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns true if any of the breadcrumb definitions matches the breadcrumb text', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              breadcrumb: ['education', 'childcare']
            }
          }
          spyOn(surveys, 'currentBreadcrumb').and.returnValues('Home  Education and learning  Schools', 'Home  Childcare and parenting  Maternity leave')
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if none of the breadcrumb definitions matches the breadcrumb text', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              breadcrumb: ['education', 'childcare']
            }
          }
          spyOn(surveys, 'currentBreadcrumb').and.returnValue('Home  Benefits  Benfits for families')
          expect(surveys.activeWhen(survey)).toBe(false)
        })
      })

      describe('section matches', function () {
        it('returns true if the section definition matches something in the section meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['education']
            }
          }
          spyOn(surveys, 'currentSection').and.returnValue('Education')
          spyOn(surveys, 'currentThemes').and.returnValue('childcare')
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns true if the section definition matches something in the themes meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['education']
            }
          }
          spyOn(surveys, 'currentSection').and.returnValue('Childcare')
          spyOn(surveys, 'currentThemes').and.returnValue('education')
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if the section definition does not match the section or themes meta tags at all', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['childcare']
            }
          }
          spyOn(surveys, 'currentSection').and.returnValue('Education')
          spyOn(surveys, 'currentThemes').and.returnValue('higher-learning')
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns true if any of the section definitions matches the section meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['education', 'childcare']
            }
          }
          spyOn(surveys, 'currentSection').and.returnValues('Education', 'Childcare')
          spyOn(surveys, 'currentThemes').and.returnValues('higher-learning', 'higher-learning')
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns true if any of the section definitions matches the themes meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['education', 'childcare']
            }
          }
          spyOn(surveys, 'currentSection').and.returnValues('Higher Learning', 'Higher Learning')
          spyOn(surveys, 'currentThemes').and.returnValues('education', 'childcare')
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if none of the section definitions matches the section or themes meta tags', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['education', 'childcare']
            }
          }
          spyOn(surveys, 'currentSection').and.returnValue('Schools')
          spyOn(surveys, 'currentThemes').and.returnValue('Parenting')
          expect(surveys.activeWhen(survey)).toBe(false)
        })
      })

      describe('organisation matches', function () {
        it('returns true if the organisation definition matches one of the ids in the organisation meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              organisation: ['<D10>']
            }
          }
          spyOn(surveys, 'currentOrganisation').and.returnValue('<D10><E1345>')
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if the organisation definition does not match one of the ids in the organisation meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              organisation: ['<D20>']
            }
          }
          spyOn(surveys, 'currentOrganisation').and.returnValue('<D10><E1345>')
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns true if any of the organisation definitions matches an id in the organisation meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              organisation: ['<D10>', '<E1555>']
            }
          }
          spyOn(surveys, 'currentOrganisation').and.returnValues('<D10><E1345>', '<D20><E1555>')
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if none of the organisation definitions matches the organisation meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              organisation: ['<D20>', '<E1555>']
            }
          }
          spyOn(surveys, 'currentOrganisation').and.returnValue('<D10><E1345>')
          expect(surveys.activeWhen(survey)).toBe(false)
        })
      })

      describe('TLS version matches', function () {
        it('returns true if the TLS version is lower than the version limit set in the survey', function () {
          var survey = {
            identifier: 'tls_survey',
            activeWhen: {
              tlsCookieVersionLimit: [1.2]
            }
          }
          spyOn(surveys, 'currentTlsVersion').and.returnValue(1.1)
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if the TLS version is greater or equal to the version limit set in the survey', function () {
          var survey = {
            identifier: 'tls_survey',
            activeWhen: {
              tlsCookieVersionLimit: [1.2]
            }
          }
          spyOn(surveys, 'currentTlsVersion').and.returnValue(1.2)
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns false if the TLS version cannot be found in the cookie', function () {
          var survey = {
            identifier: 'tls_survey',
            activeWhen: {
              tlsCookieVersionLimit: [1.2]
            }
          }
          spyOn(surveys, 'currentTlsVersion').and.returnValue('')
          expect(surveys.activeWhen(survey)).toBe(false)
        })
      })

      it('combines multiple definitions in an OR; if any of them match activeWhen will return true', function () {
        var survey = {
          identifier: 'a_survey',
          activeWhen: {
            path: ['^/government/statistics/?$'],
            breadcrumb: ['education'],
            section: ['schools'],
            organisation: ['<D10>']
          }
        }

        spyOn(surveys, 'currentPath').and.returnValues('/government/statistics/a-long-detailed-report.xls', '/government/statistics', '/government/publications/', '/find-your-local-council', '/')
        spyOn(surveys, 'currentBreadcrumb').and.returnValues('Home  Education', 'Home', 'Home  Schools  Applying for a place', 'Home  Benefits  Family benefits', 'Home')
        spyOn(surveys, 'currentSection').and.returnValues('education', '', 'schools', 'benefits', 'homepage')
        spyOn(surveys, 'currentOrganisation').and.returnValues('<E1555><F12>', '<D20>', '<E1234>', '<D20><F10>', '<D10><E134>')

        expect(surveys.activeWhen(survey)).toBe(true) // because of the breadcrumb
        expect(surveys.activeWhen(survey)).toBe(true) // because of the path
        expect(surveys.activeWhen(survey)).toBe(true) // because of the section
        expect(surveys.activeWhen(survey)).toBe(false) // because nothing matches
        expect(surveys.activeWhen(survey)).toBe(true) // because of the organisation
      })
    })

    describe("for 'exclude' matchType", function () {
      describe('path matches', function () {
        it('returns false if the path definition matches a complete path segment in the currentPath', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['foo'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentPath').and.returnValues('/foo', '/foo/bar', '/bar/foo')
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('allows path separators in the path definition, returning false if they match a complete set of path segments in the currentPath', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['foo/bar'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentPath').and.returnValues('/foo', '/foo/bar', '/bar/foo', '/baz/foo/bar/qux')
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns true if the excludes path definition does not match the currentPath at all', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['foo'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentPath').and.returnValue('/bar')
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns true if the excludes path definition matches an incomplete path segment of the currentPath', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['foo'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentPath').and.returnValues('/foo-bar', '/bar-foo', '/i/like/food/')
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if any of the path definitions matches a complete path segment in the currentPath', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['foo', 'bar', 'baz'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentPath').and.returnValues('/foo', '/food/bar', '/bard/baz/food')
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it("treats the path definition as a complete match, rather than a path segment match if it includes '^' or '$'", function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              path: ['^/foo$'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentPath').and.returnValues('/foo', '/food', 'foo/', '/foo/bar', '/bar/foo')
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
          expect(surveys.activeWhen(survey)).toBe(true)
        })
      })

      describe('breadcrumb matches', function () {
        it('returns false if the breadcrumb definition matches something in the breadcrumb text', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              breadcrumb: ['education'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentBreadcrumb').and.returnValue('Home  Education and learning  Schools')
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns true if the breadcrumb definition does not match the breadcrumb text at all', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              breadcrumb: ['childcare'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentBreadcrumb').and.returnValue('Home  Education and learning  Schools')
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if any of the breadcrumb definitions matches the breadcrumb text', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              breadcrumb: ['education', 'childcare'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentBreadcrumb').and.returnValues('Home  Education and learning  Schools', 'Home  Childcare and parenting  Maternity leave')
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns true if none of the breadcrumb definitions matches the breadcrumb text', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              breadcrumb: ['education', 'childcare'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentBreadcrumb').and.returnValue('Home  Benefits  Benfits for families')
          expect(surveys.activeWhen(survey)).toBe(true)
        })
      })

      describe('section matches', function () {
        it('returns false if the section definition matches something in the section meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['education'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentSection').and.returnValue('Education')
          spyOn(surveys, 'currentThemes').and.returnValue('childcare')
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns false if the section definition matches something in the themes meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['education'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentSection').and.returnValue('Childcare')
          spyOn(surveys, 'currentThemes').and.returnValue('education')
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns true if the section definition does not match the section or themes meta tags at all', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['childcare'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentSection').and.returnValue('Education')
          spyOn(surveys, 'currentThemes').and.returnValue('higher-learning')
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if any of the section definitions matches the section meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['education', 'childcare'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentSection').and.returnValues('Education', 'Childcare')
          spyOn(surveys, 'currentThemes').and.returnValues('higher-learning', 'higher-learning')
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns false if any of the section definitions matches the themes meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['education', 'childcare'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentSection').and.returnValues('Higher Learning', 'Higher Learning')
          spyOn(surveys, 'currentThemes').and.returnValues('education', 'childcare')
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns true if none of the section definitions matches the section or themes meta tags', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              section: ['education', 'childcare'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentSection').and.returnValue('Schools')
          spyOn(surveys, 'currentThemes').and.returnValue('Parenting')
          expect(surveys.activeWhen(survey)).toBe(true)
        })
      })

      describe('organisation matches', function () {
        it('returns false if the organisation definition matches one of the ids in the organisation meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              organisation: ['<D10>'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentOrganisation').and.returnValue('<D10><E1345>')
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns true if the organisation definition does not match one of the ids in the organisation meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              organisation: ['<D20>'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentOrganisation').and.returnValue('<D10><E1345>')
          expect(surveys.activeWhen(survey)).toBe(true)
        })

        it('returns false if any of the organisation definitions matches an id in the organisation meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              organisation: ['<D10>', '<E1555>'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentOrganisation').and.returnValues('<D10><E1345>', '<D20><E1555>')
          expect(surveys.activeWhen(survey)).toBe(false)
          expect(surveys.activeWhen(survey)).toBe(false)
        })

        it('returns true if none of the organisation definitions matches the organisation meta tag', function () {
          var survey = {
            identifier: 'a_survey',
            activeWhen: {
              organisation: ['<D20>', '<E1555>'],
              matchType: 'exclude'
            }
          }
          spyOn(surveys, 'currentOrganisation').and.returnValue('<D10><E1345>')
          expect(surveys.activeWhen(survey)).toBe(true)
        })
      })
    })
  })

  describe('getActiveSurvey', function () {
    it('combines the default survey with the active small surveys to find all possible surveys to display', function () {
      spyOn(surveys, 'getActiveSurveys').and.returnValue([smallSurvey, urlSurvey])
      spyOn(surveys, 'getDisplayableSurveys').and.callThrough()
      surveys.getActiveSurvey(defaultSurvey, [smallSurvey, urlSurvey])
      expect(surveys.getActiveSurveys).toHaveBeenCalledWith([smallSurvey, urlSurvey])
      expect(surveys.getDisplayableSurveys).toHaveBeenCalledWith([defaultSurvey, smallSurvey, urlSurvey])
    })

    it('returns nothing if no surveys are displayable', function () {
      spyOn(surveys, 'getDisplayableSurveys').and.returnValue([])

      var activeSurvey = surveys.getActiveSurvey(defaultSurvey, [smallSurvey, urlSurvey])
      expect(activeSurvey).toBe(undefined)
    })

    it('returns the only displayable survey', function () {
      spyOn(surveys, 'getDisplayableSurveys').and.returnValue([urlSurvey])

      var activeSurvey = surveys.getActiveSurvey(defaultSurvey, [smallSurvey, urlSurvey])
      expect(activeSurvey).toBe(urlSurvey)
    })

    it('randomly chooses a survey if multiple surveys are displayable', function () {
      spyOn(surveys, 'getDisplayableSurveys').and.returnValue([defaultSurvey, smallSurvey, urlSurvey])
      spyOn(Math, 'random').and.returnValue(0.5) // this'll result in us picking the 2nd item

      var activeSurvey = surveys.getActiveSurvey(defaultSurvey, [smallSurvey, urlSurvey])
      expect(Math.random).toHaveBeenCalled()
      expect(activeSurvey).toBe(smallSurvey)
    })
  })
})
