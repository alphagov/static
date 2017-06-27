// = require surveys
describe('Surveys', function () {
  var surveys = GOVUK.userSurveys
  var $block

  var defaultSurvey = {
    url: 'smartsurvey.co.uk/default',
    frequency: 1, // no randomness in the test suite pls
    identifier: 'user_satisfaction_survey',
    template: '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
              '  <a href="#user-survey-cancel" id="user-survey-cancel">No thanks</a>' +
              '  <a href="javascript:void()" id="take-survey" target="_blank"></a>' +
              '</section>',
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
    identifier: 'email-survey'
  }

  beforeEach(function () {
    $block = $('<div class="govuk-emergency-banner" style="display: none"></div>' +
               '<div id="global-cookie-message" style="display: none"></div>' +
               '<div id="global-browser-prompt" style="display: none"></div>' +
               '<div id="taxonomy-survey" style="display: none"></div>' +
               '<div id="user-satisfaction-survey-container"></div>')

    $('body').append($block)
    $('#user-satisfaction-survey').remove()

    // Don't actually try and take a survey in test.
    $('#take-survey').on('click', function (e) {
      e.preventDefault()
    })
  })

  afterEach(function () {
    $.each([defaultSurvey, smallSurvey, urlSurvey, emailSurvey], function (_idx, survey) {
      GOVUK.cookie(surveys.surveyTakenCookieName(survey), null)
      GOVUK.cookie(surveys.surveySeenCookieName(survey), null)
    })
    $block.remove()
  })

  describe('init', function () {
    it("shows a survey if we can show any surveys", function () {
      spyOn(surveys, 'canShowAnySurvey').and.returnValue(true)
      spyOn(surveys, 'getActiveSurvey').and.returnValue(surveys.defaultSurvey)
      spyOn(surveys, 'randomNumberMatches').and.returnValue(true)
      surveys.init()

      expect($('#take-survey').attr('href')).toContain(surveys.defaultSurvey.url)
      expect($('#user-satisfaction-survey').length).toBe(1)
      expect($('#user-satisfaction-survey').hasClass('visible')).toBe(true)
      expect($('#user-satisfaction-survey').attr('aria-hidden')).toBe('false')
    })

    it("fails quickly if we cannot show any surveys", function () {
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

      GOVUK.cookie(surveys.surveySeenCookieName(defaultSurvey), 10)
      surveys.displaySurvey(defaultSurvey)
      expect(GOVUK.cookie(surveys.surveySeenCookieName(defaultSurvey))).toBe('11')

      GOVUK.cookie(surveys.surveySeenCookieName(defaultSurvey), 'a few times')
      surveys.displaySurvey(defaultSurvey)
      expect(GOVUK.cookie(surveys.surveySeenCookieName(defaultSurvey))).toBe('1')
    })

    describe("for a 'url' survey", function () {
      it('links to the url for a smartsurvey survey with a completion redirect query parameter', function () {
        surveys.displaySurvey(urlSurvey)

        expect($('#take-survey').attr('href')).toContain(urlSurvey.url)
        expect($('#take-survey').attr('href')).toContain('?c=' + window.location.pathname)
      })

      it('sets event handlers on the survey', function () {
        spyOn(surveys, 'setURLSurveyEventHandlers')
        surveys.displaySurvey(urlSurvey)
        expect(surveys.setURLSurveyEventHandlers).toHaveBeenCalledWith(urlSurvey)
      })

      it('records an event when showing the survey', function () {
        spyOn(surveys, 'trackEvent')
        surveys.displaySurvey(urlSurvey)
        expect(surveys.trackEvent).toHaveBeenCalledWith(urlSurvey.identifier, 'banner_shown', 'Banner has been shown')
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
    })
  })

  describe("canShowAnySurvey", function () {
    it("returns false if any other notification is visible", function () {
      spyOn(surveys, 'otherNotificationVisible').and.returnValue(true)

      expect(surveys.canShowAnySurvey()).toBeFalsy()
    })

    it("returns false if the user has completed a transaction", function () {
      spyOn(surveys, 'userCompletedTransaction').and.returnValue(true)

      expect(surveys.canShowAnySurvey()).toBeFalsy()
    })

    it("returns false if the survey container isn't present", function () {
      $("#user-satisfaction-survey-container").remove()

      expect(surveys.canShowAnySurvey()).toBeFalsy()
    })

    it("returns false if the path is blacklisted", function () {
      spyOn(surveys, 'pathInBlacklist').and.returnValue(true)

      expect(surveys.canShowAnySurvey()).toBeFalsy()
    })

    it("returns true otherwise", function () {
      expect(surveys.canShowAnySurvey()).toBeTruthy()
    })
  })

  describe("otherNotificationVisible", function () {
    it("returns false if the global cookie banner is visible", function () {
      $('#global-cookie-message').css('display', 'block')

      expect(surveys.canShowAnySurvey(defaultSurvey)).toBeFalsy()
    })

    it("returns false if the emergency banner is visible", function () {
      $('.govuk-emergency-banner').css('display', 'block')

      expect(surveys.canShowAnySurvey(defaultSurvey)).toBeFalsy()
    })

    it("returns false if the global browser prompt message is visible", function () {
      $('#global-browser-prompt').css('display', 'block')

      expect(surveys.canShowAnySurvey(defaultSurvey)).toBeFalsy()
    })

    it("returns false if the taxonomy survey is visible", function () {
      $('#taxonomy-survey').css('display', 'block')

      expect(surveys.canShowAnySurvey(defaultSurvey)).toBeFalsy()
    })
  })

  describe("isSurveyToBeDisplayed", function () {
    it("returns false if the 'survey taken' cookie is set", function () {
      GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey), 'true')
      expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy()
    })

    it('returns false when the random number does not match', function () {
      spyOn(surveys, 'randomNumberMatches').and.returnValue(false)
      expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy()
    })

    it('returns false if the survey has been seen too many times', function () {
      spyOn(surveys, 'surveySeenTooManyTimes').and.returnValue(true)
      expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy()
    })

    it('returns true when the random number matches', function () {
      spyOn(surveys, 'randomNumberMatches').and.returnValue(true)
      expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeTruthy()
    })
  })

  describe('pathInBlacklist', function () {
    // we make sure that slash-terminated and slash-unterminated versions
    // of these paths work
    it('returns true if the path is /service-manual', function () {
      spyOn(surveys, 'currentPath').and.returnValue('/service-manual', '/service-manual/')
      expect(surveys.pathInBlacklist()).toBeTruthy()
      expect(surveys.pathInBlacklist()).toBeTruthy()
    })

    it('returns true if the path is a sub-folder under /service-manual', function () {
      spyOn(surveys, 'currentPath').and.returnValue('/service-manual/some-other-page', '/service-manual/some-other-page/')
      expect(surveys.pathInBlacklist()).toBeTruthy()
      expect(surveys.pathInBlacklist()).toBeTruthy()
    })

    it('returns false if the path is /service-manual-with-a-suffix', function () {
      spyOn(surveys, 'currentPath').and.returnValues('/service-manual-with-a-suffix', '/service-manual-with-a-suffix/')
      expect(surveys.pathInBlacklist()).toBeFalsy()
      expect(surveys.pathInBlacklist()).toBeFalsy()
    })

    it('returns false if the path is /some-other-parent-of/service-manual', function () {
      spyOn(surveys, 'currentPath').and.returnValue('/some-other-parent-of/service-manual', '/some-other-parent-of/service-manual/')
      expect(surveys.pathInBlacklist()).toBeFalsy()
      expect(surveys.pathInBlacklist()).toBeFalsy()
    })

    it('returns false otherwise', function () {
      spyOn(surveys, 'currentPath').and.returnValue('/')
      expect(surveys.pathInBlacklist()).toBeFalsy()
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
        $('#take-survey').trigger('click')
        expect(GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey))).toBe('true')
      })

      it("sets a cookie when clicking 'no thanks'", function () {
        $('#user-survey-cancel').trigger('click')
        expect(GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey))).toBe('true')
      })

      it("hides the satisfaction survey bar after clicking 'take survey'", function () {
        $('#take-survey').trigger('click')
        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false)
        expect($('#user-satisfaction-survey').attr('aria-hidden')).toBe('true')
      })

      it("hides the satisfaction survey bar after clicking 'no thanks'", function () {
        $('#user-survey-cancel').trigger('click')
        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false)
      })

      it("records an event when clicking 'take survey'", function () {
        spyOn(surveys, 'trackEvent')
        $('#take-survey').trigger('click')
        expect(surveys.trackEvent).toHaveBeenCalledWith(defaultSurvey.identifier, 'banner_taken', 'User taken survey')
      })

      it("records an event when clicking 'no thanks'", function () {
        spyOn(surveys, 'trackEvent')
        $('#user-survey-cancel').trigger('click')
        expect(surveys.trackEvent).toHaveBeenCalledWith(defaultSurvey.identifier, 'banner_no_thanks', 'No thanks clicked')
      })
    })

    describe('for an email survey', function () {
      var emailSurvey = {
        surveyType: 'email',
        identifier: 'email-survey'
      }

      beforeEach(function () {
        surveys.displaySurvey(emailSurvey)
      })

      it("sets a cookie when clicking 'no thanks'", function () {
        $('#user-survey-cancel').trigger('click')
        expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).toBe('true')
      })

      it("hides the satisfaction survey bar after clicking 'no thanks'", function () {
        $('#user-survey-cancel').trigger('click')
        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false)
      })

      it("records an event when clicking 'no thanks'", function () {
        spyOn(surveys, 'trackEvent')
        $('#user-survey-cancel').trigger('click')
        expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'banner_no_thanks', 'No thanks clicked')
      })

      it("opens the email form when clicking on 'Your feedback will help us ...'", function () {
        $('#email-survey-open').trigger('click')
        expect($('#email-survey-form').hasClass('js-hidden')).toBe(false)
      })

      it("hides the invitation to take the survey when clicking on 'Your feedback will help us ...'", function () {
        $('#email-survey-open').trigger('click')
        expect($('#email-survey-pre').hasClass('js-hidden')).toBe(true)
      })

      it("records an event when clicking on 'Your feedback will help us ...'", function () {
        spyOn(surveys, 'trackEvent')
        $('#email-survey-open').trigger('click')
        expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'email_survey_open', 'Email survey opened')
      })

      describe('once the email form is opened', function () {
        it('sends the details to the feedback app with ajax when submitting the form', function () {
          spyOn($, 'ajax')
          $('#email-survey-form').trigger('submit')

          expect($.ajax).toHaveBeenCalled()
          var args = $.ajax.calls.mostRecent().args
          expect(args[0].url).toBe('/contact/govuk/email-survey-signup.js')
        })

        it("doesn't add .js to the form action if it's already a .js url when submitting the form", function () {
          spyOn($, 'ajax')
          $('#email-survey-form').attr('action', '/contact/govuk/js-already/email-survey-signup.js')
          $('#email-survey-form').trigger('submit')

          expect($.ajax).toHaveBeenCalled()
          var args = $.ajax.calls.mostRecent().args
          expect(args[0].url).toBe('/contact/govuk/js-already/email-survey-signup.js')
        })

        describe('and submitting it is a success', function () {
          beforeEach(function () {
            spyOn($, 'ajax').and.callFake(function (options) {
              if (options.success) {
                options.success({message: 'great success!'})
              }
            })
          })

          it('opens the post submit success message', function () {
            $('#email-survey-form').trigger('submit')
            expect($('#email-survey-post-success').hasClass('js-hidden')).toBe(false)
          })

          it('hides the email form', function () {
            $('#email-survey-form').trigger('submit')
            expect($('#email-survey-form').hasClass('js-hidden')).toBe(true)
          })

          it('sets a cookie', function () {
            $('#email-survey-form').trigger('submit')
            expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).toBe('true')
          })

          it('records an event', function () {
            spyOn(surveys, 'trackEvent')
            $('#email-survey-form').trigger('submit')
            expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'email_survey_taken', 'Email survey taken')
            expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'banner_taken', 'User taken survey')
          })
        })

        describe('but submitting it results in an error', function () {
          beforeEach(function () {
            spyOn($, 'ajax').and.callFake(function (options) {
              options.error({message: 'bad error!'})
            })
          })

          it('opens the post submit failure message', function () {
            $('#email-survey-form').trigger('submit')
            expect($('#email-survey-post-failure').hasClass('js-hidden')).toBe(false)
          })

          it('hides the email form', function () {
            $('#email-survey-form').trigger('submit')
            expect($('#email-survey-form').hasClass('js-hidden')).toBe(true)
          })

          it('does not sets a cookie', function () {
            $('#email-survey-form').trigger('submit')
            expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).not.toBe('true')
          })

          it('does not records any events', function () {
            spyOn(surveys, 'trackEvent')
            $('#email-survey-form').trigger('submit')
            expect(surveys.trackEvent).not.toHaveBeenCalled()
          })
        })

        it("hides the email form when clicking 'No thanks'", function () {
          $('#user-survey-cancel').trigger('click')
          expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).toBe('true')
        })

        it("hides the whole email survey interface after clicking 'no thanks'", function () {
          $('#user-survey-cancel').trigger('click')
          expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false)
        })

        it("records an event when clicking 'no thanks'", function () {
          spyOn(surveys, 'trackEvent')
          $('#user-survey-cancel').trigger('click')
          expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'email_survey_cancel', 'Email survey cancelled')
        })

        it("hides the email form when clicking 'take survey' if no email", function () {
          $('#take-survey').trigger('click')
          expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).toBe('true')
        })

        it("hides the whole email survey interface after clicking 'take survey' if no email", function () {
          $('#take-survey').trigger('click')
          expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false)
        })

        it("records an event when clicking 'take survey' if no email", function () {
          spyOn(surveys, 'trackEvent')
          $('#take-survey').trigger('click')
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
      var surveyMock = {identifier: 'sample_survey'}
      expect(surveys.surveyTakenCookieName(surveyMock)).toBe('govuk_takenSampleSurvey')
    })
  })

  describe('surveySeenCookieName', function () {
    it('returns a cookie name based on the survey identifier', function () {
      var surveyMock = {identifier: 'sample_survey'}
      expect(surveys.surveySeenCookieName(surveyMock)).toBe('govuk_surveySeenSampleSurvey')
    })
  })

  describe("surveySeenTooManyTimes", function () {
    it('returns false if the survey seen cookie is not set', function () {
      GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), null)
      expect(surveys.surveySeenTooManyTimes(smallSurvey)).toBeFalsy()
    })

    it('returns false if the survey seen cookie is set but the value is not a number', function () {
      GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), 'a few times')
      expect(surveys.surveySeenTooManyTimes(smallSurvey)).toBeFalsy()
    })

    it('returns false if the survey seen cookie is set but the value is less than 2', function () {
      GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), 0)
      expect(surveys.surveySeenTooManyTimes(smallSurvey)).toBeFalsy()

      GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), 1)
      expect(surveys.surveySeenTooManyTimes(smallSurvey)).toBeFalsy()
    })

    it('returns true if the survey seen cookie is set but the value is 2 or more', function () {
      GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), 2)
      expect(surveys.surveySeenTooManyTimes(smallSurvey)).toBeTruthy()

      GOVUK.cookie(surveys.surveySeenCookieName(smallSurvey), 10)
      expect(surveys.surveySeenTooManyTimes(smallSurvey)).toBeTruthy()
    })
  })

  describe("getActiveSurveys", function () {
    it("returns an empty array when no surveys are present", function () {
      expect(surveys.getActiveSurveys([])).toHaveLength(0)
    })

    it("does not include a survey that has not started yet", function () {
      var testSurvey = {
        startTime: new Date("July 5, 2016").getTime(),
        endTime: new Date("July 10, 2016 23:50:00").getTime(),
        url: 'example.com/test-survey'
      }
      var smallSurveys = []
      spyOn(surveys, 'currentTime').and.returnValue(new Date("July 04, 2016 10:00:00").getTime())

      var activeSurveys = surveys.getActiveSurveys([testSurvey])
      expect(activeSurveys).not.toContain(testSurvey)
    })

    it("does not include a survey that has finished", function () {
      var testSurvey = {
        startTime: new Date("July 5, 2016").getTime(),
        endTime: new Date("July 10, 2016 23:50:00").getTime(),
        url: 'example.com/test-survey'
      }
      spyOn(surveys, 'currentTime').and.returnValue(new Date("July 11, 2016 10:00:00").getTime())

      var activeSurveys = surveys.getActiveSurveys([testSurvey])
      expect(activeSurveys).not.toContain(testSurvey)
    })

    it("includes the survey when we are between its start and end times", function () {
      var testSurvey = {
        startTime: new Date("July 5, 2016").getTime(),
        endTime: new Date("July 10, 2016 23:50:00").getTime(),
        url: 'example.com/test-survey'
      }
      spyOn(surveys, 'currentTime').and.returnValue(new Date("July 9, 2016 10:00:00").getTime())

      var activeSurveys = surveys.getActiveSurveys([testSurvey])
      expect(activeSurveys).toContain(testSurvey)
    })

    describe("checking activeWhen attribute", function () {
      it("includes the survey when the activeWhen function returns true", function () {
        spyOn(surveys, 'currentTime').and.returnValue(new Date("July 9, 2016 10:00:00").getTime())
        var testSurvey = {
          startTime: new Date('July 5, 2016').getTime(),
          endTime: new Date('July 10, 2016 23:50:00').getTime(),
          activeWhen: function () { return true },
          url: 'example.com/small-survey'
        }

        var activeSurveys = surveys.getActiveSurveys([testSurvey])
        expect(activeSurveys).toContain(testSurvey)
      })

      it("does not include the survey when the activeWhen function returns false", function () {
        spyOn(surveys, 'currentTime').and.returnValue(new Date("July 9, 2016 10:00:00").getTime())
        var testSurvey = {
          startTime: new Date('July 5, 2016').getTime(),
          endTime: new Date('July 10, 2016 23:50:00').getTime(),
          activeWhen: function () { return false },
          url: 'example.com/small-survey'
        }

        var activeSurveys = surveys.getActiveSurveys([testSurvey])
        expect(activeSurveys).not.toContain(testSurvey)
      })

      it("includes the survey when it has no activeWhen function", function () {
        spyOn(surveys, 'currentTime').and.returnValue(new Date("July 9, 2016 10:00:00").getTime())
        var testSurvey = {
          startTime: new Date("July 5, 2016").getTime(),
          endTime: new Date("July 10, 2016 23:50:00").getTime(),
          url: 'example.com/small-survey'
        }

        var activeSurveys = surveys.getActiveSurveys([testSurvey])
        expect(activeSurveys).toContain(testSurvey)
      })
    })
  })

  describe("getDisplayableSurveys", function () {
    it("does not include a survey that should not be displayed", function () {
      spyOn(surveys, 'isSurveyToBeDisplayed').and.returnValue(false)
      var testSurvey = {
        startTime: new Date("July 5, 2016").getTime(),
        endTime: new Date("July 10, 2016 23:50:00").getTime(),
        url: 'example.com/small-survey'
      }

      var displayableSurveys = surveys.getDisplayableSurveys([testSurvey])
      expect(displayableSurveys).not.toContain(testSurvey)
    })

    it("includes a survey if it should be displayed", function () {
      spyOn(surveys, 'isSurveyToBeDisplayed').and.returnValue(true)
      var testSurvey = {
        startTime: new Date("July 5, 2016").getTime(),
        endTime: new Date("July 10, 2016 23:50:00").getTime(),
        url: 'example.com/small-survey'
      }

      var displayableSurveys = surveys.getDisplayableSurveys([testSurvey])
      expect(displayableSurveys).toContain(testSurvey)
    })
  })

  describe("getActiveSurvey", function () {
    it("combines the default survey with the active small surveys to find all possible surveys to display", function () {
      spyOn(surveys, 'getActiveSurveys').and.returnValue([smallSurvey, urlSurvey])
      spyOn(surveys, 'getDisplayableSurveys').and.callThrough()
      surveys.getActiveSurvey(defaultSurvey, [smallSurvey, urlSurvey])
      expect(surveys.getActiveSurveys).toHaveBeenCalledWith([smallSurvey, urlSurvey])
      expect(surveys.getDisplayableSurveys).toHaveBeenCalledWith([defaultSurvey, smallSurvey, urlSurvey])
    })

    it("returns nothing if no surveys are displayable", function () {
      spyOn(surveys, 'getDisplayableSurveys').and.returnValue([])

      var activeSurvey = surveys.getActiveSurvey(defaultSurvey, [smallSurvey, urlSurvey])
      expect(activeSurvey).toBe(undefined)
    })

    it("returns the only displayable survey", function () {
      spyOn(surveys, 'getDisplayableSurveys').and.returnValue([urlSurvey])

      var activeSurvey = surveys.getActiveSurvey(defaultSurvey, [smallSurvey, urlSurvey])
      expect(activeSurvey).toBe(urlSurvey)
    })

    it("randomly chooses a survey if multiple surveys are displayable", function () {
      spyOn(surveys, 'getDisplayableSurveys').and.returnValue([defaultSurvey, smallSurvey, urlSurvey])
      spyOn(Math, 'random').and.returnValue(0.5) // this'll result in us picking the 2nd item

      var activeSurvey = surveys.getActiveSurvey(defaultSurvey, [smallSurvey, urlSurvey])
      expect(Math.random).toHaveBeenCalled()
      expect(activeSurvey).toBe(smallSurvey)
    })
  })
})
