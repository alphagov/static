describe("Surveys", function() {
  var surveys = GOVUK.userSurveys;
  var $block;

  var defaultSurvey = {
    url: 'surveymonkey.com/default',
    frequency: 1, // no randomness in the test suite pls
    identifier: 'user_satisfaction_survey',
    surveyType: 'url',
  };
  var smallSurvey = {
    startTime: new Date("July 5, 2016").getTime(),
    endTime: new Date("July 10, 2016 23:50:00").getTime(),
    url: 'example.com/small-survey',
    surveyType: 'url',
  };
  var urlSurvey = {
    surveyType: 'url',
    url: 'surveymonkey.com/default',
    identifier: 'url-survey',
  };
  var emailSurvey = {
    surveyType: 'email',
    identifier: 'email-survey',
  };

  var urlSurveyTemplate = '\
    <script type="text/html+template" \
            id="url-survey-template" \
            data-default-title="Tell us what you think of GOV.UK" \
            data-default-no-thanks="No thanks" \
            data-default-survey-cta="Take the 3 minute survey" \
            data-default-survey-cta-postscript="This will open a short survey on another website"> \
      <section id="user-satisfaction-survey" class="visible" aria-hidden="false"> \
        <h1>{{title}}</h1> \
        <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">{{noThanks}}</a></p> \
        <p class="cta"><a href="{{surveyUrl}}" id="take-survey">{{surveyCta}}</a> <span>{{surveyCtaPostscript}}</span></p> \
      </section> \
    </script>';
  var emailSurveyTemplate = '\
    <script type="text/html+template" \
            id="email-survey-template" \
            data-default-title="Tell us what you think of GOV.UK" \
            data-default-no-thanks="No thanks" \
            data-default-survey-cta="Your feedback will help us improve this website" \
            data-default-survey-form-title="We’d like to hear from you" \
            data-default-survey-form-email-label="Tell us your email address and we’ll send you a link to a quick feedback form." \
            data-default-survey-form-cta="Send" \
            data-default-survey-form-cta-postscript="We won’t store your email address or share it with anyone" \
            data-default-survey-success="Thanks, we’ve sent you an email with a link to the survey." \
            data-default-survey-failure="Sorry, we’re unable to send you an email right now.  Please try again later."> \
      <section id="user-satisfaction-survey" class="visible" aria-hidden="false"> \
        <div id="email-survey-pre" class="wrapper"> \
          <h1>{{title}}</h1> \
          <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">{{noThanks}}</a></p> \
          <p><a href="#email-survey-form" id="email-survey-open" rel="noopener noreferrer">{{surveyCta}}</a></p> \
        </div> \
        <form id="email-survey-form" action="/contact/govuk/email-survey-signup" method="post" class="wrapper js-hidden" aria-hidden="true"> \
          <h1>{{surveyFormTitle}}</h1> \
          <p class="right"><a href="#email-survey-cancel" id="email-survey-cancel">{{noThanks}}</a></p> \
          <label for="email">{{surveyFormEmailLabel}}</label> \
          <input name="email_survey_signup[survey_id]" type="hidden" value="{{surveyId}}"> \
          <input name="email_survey_signup[survey_source]" type="hidden" value="{{surveySource}}"> \
          <input name="email_survey_signup[email_address]" type="text" placeholder="Your email address"> \
          <button type="submit">{{surveyFormCta}}</button> \
          <p class="button-info">{{surveyFormCtaPostscript}}</p> \
        </form> \
        <div id="email-survey-post-success" class="wrapper js-hidden" aria-hidden="true"> \
          <p>{{surveySuccess}}</p> \
        </div> \
        <div id="email-survey-post-failure" class="wrapper js-hidden" aria-hidden="true"> \
          <p>{{surveyFailure}}</p> \
        </div> \
      </section> \
    </script>';

  beforeEach(function () {
    $block = $('<div id="banner-notification" style="display: none"></div>' +
               '<div id="global-cookie-message" style="display: none"></div>' +
               '<div id="global-browser-prompt" style="display: none"></div>' +
               '<div id="user-satisfaction-survey-container"></div>');

    $('body').append($block);
    $('#user-satisfaction-survey-container').append(emailSurveyTemplate).append(urlSurveyTemplate);
    $("#user-satisfaction-survey").remove();

    // Don't actually try and take a survey in test.
    $('#take-survey').on('click', function(e) {
      e.preventDefault();
    });
  });

  afterEach(function () {
    GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey), null);
    GOVUK.cookie(surveys.surveyTakenCookieName(smallSurvey), null);
    GOVUK.cookie(surveys.surveyTakenCookieName(urlSurvey), null);
    GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey), null);
    $block.remove();
  });

  describe("init", function() {
    it("shows the default survey", function() {
      spyOn(surveys, 'randomNumberMatches').and.returnValue(true);
      // So we're working with the user satisfaction survey, not any future small survey
      spyOn(surveys, 'currentTime').and.returnValue(new Date("July 11, 201610:00:00").getTime());
      surveys.init();

      expect($('#take-survey').attr('href')).toContain(surveys.defaultSurvey.url);
      expect($('#user-satisfaction-survey').length).toBe(1);
      expect($('#user-satisfaction-survey').hasClass('visible')).toBe(true);
      expect($('#user-satisfaction-survey').attr('aria-hidden')).toBe('false');
    });
  });

  describe("displaySurvey", function() {
    it("displays the user satisfaction div", function () {
      expect($('#user-satisfaction-survey').length).toBe(0);
      surveys.displaySurvey(defaultSurvey);
      expect($('#user-satisfaction-survey').length).toBe(1);
      expect($('#user-satisfaction-survey').hasClass('visible')).toBe(true);
      expect($('#user-satisfaction-survey').attr('aria-hidden')).toBe('false');
    });

    describe("for a 'url' survey", function() {
      it("links to the url for a surveymonkey survey and adds the current path as a `c` param", function () {
        surveys.displaySurvey(urlSurvey);

        expect($('#take-survey').attr('href')).toContain(urlSurvey.url);
        expect($('#take-survey').attr('href')).toContain("?c=" + window.location.pathname);
      });

      it("links to the url for a non-surveymonkey survey without adding the current path as a `c` param", function () {
        var nonSurveyMonkeyUrlSurvey = {
          surveyType: 'url',
          url: 'surveygorilla.com/default',
          identifier: 'url-survey',
        }
        surveys.displaySurvey(nonSurveyMonkeyUrlSurvey);

        expect($('#take-survey').attr('href')).toContain(nonSurveyMonkeyUrlSurvey.url);
        expect($('#take-survey').attr('href')).not.toContain("?c=" + window.location.pathname);
      });

      it("records an event when showing the survey", function() {
        spyOn(surveys, 'trackEvent');
        surveys.displaySurvey(urlSurvey);
        expect(surveys.trackEvent).toHaveBeenCalledWith(urlSurvey.identifier, 'banner_shown', 'Banner has been shown');
      });

      it("sets event handlers on the survey", function() {
        spyOn(surveys, 'setURLSurveyEventHandlers');
        surveys.displaySurvey(urlSurvey);
        expect(surveys.setURLSurveyEventHandlers).toHaveBeenCalledWith(urlSurvey);
      });

      it("records an event when showing the survey", function() {
        spyOn(surveys, 'trackEvent');
        surveys.displaySurvey(urlSurvey);
        expect(surveys.trackEvent).toHaveBeenCalledWith(urlSurvey.identifier, 'banner_shown', 'Banner has been shown');
      });

      describe("without overrides for the template defaults", function() {
        it("uses the title defined in the template data attributes", function() {
          surveys.displaySurvey(urlSurvey);
          defaultText = $('#url-survey-template').data('defaultTitle');

          expect($('#user-satisfaction-survey h1').text()).toEqual(defaultText);
        });

        it("uses the no thanks text defined in the template data attributes", function() {
          surveys.displaySurvey(urlSurvey);
          defaultText = $('#url-survey-template').data('defaultNoThanks');

          expect($('#user-satisfaction-survey #survey-no-thanks').text()).toEqual(defaultText);
        });

        it("uses the call to action text defined in the template data attributes", function() {
          surveys.displaySurvey(urlSurvey);
          defaultText = $('#url-survey-template').data('defaultSurveyCta');

          expect($('#user-satisfaction-survey .cta a').text()).toEqual(defaultText);
        });

        it("uses the call to action postscript text defined in the template data attributes", function() {
          surveys.displaySurvey(urlSurvey);
          defaultText = $('#url-survey-template').data('defaultSurveyCtaPostscript');

          expect($('#user-satisfaction-survey .cta span').text()).toEqual(defaultText);
        });
      });

      describe("with overrides for the template defaults", function() {
        it("uses the title defined in the survey", function() {
          var survey = {
            surveyType: 'url',
            url: 'surveymonkey.com/default',
            identifier: 'url-survey',
            templateArguments: { title: 'Take my survey' }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey h1').text()).toEqual('Take my survey');
        });

        it("uses the no thanks text defined in survey", function() {
          var survey = {
            surveyType: 'url',
            url: 'surveymonkey.com/default',
            identifier: 'url-survey',
            templateArguments: { noThanks: 'Nuh-uh!' }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey #survey-no-thanks').text()).toEqual('Nuh-uh!');
        });

        it("uses the call to action text defined in survey", function() {
          var survey = {
            surveyType: 'url',
            url: 'surveymonkey.com/default',
            identifier: 'url-survey',
            templateArguments: { surveyCta: 'Do it, do it now!' }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey .cta a').text()).toEqual('Do it, do it now!');
        });

        it("uses the call to action postscript text defined in the survey", function() {
          var survey = {
            surveyType: 'url',
            url: 'surveymonkey.com/default',
            identifier: 'url-survey',
            templateArguments: { surveyCtaPostscript: 'This is a nice survey, please take it.' }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey .cta span').text()).toEqual('This is a nice survey, please take it.');
        });
      });
    });

    describe("for an 'email' survey", function() {
      it("adds the survey identifier to the form", function() {
        surveys.displaySurvey(emailSurvey);

        expect($('#email-survey-form input[name="email_survey_signup[survey_id]"]').val()).toEqual(emailSurvey.identifier);
      });

      it("adds the current path to the form", function() {
        surveys.displaySurvey(emailSurvey);

        expect($('#email-survey-form input[name="email_survey_signup[survey_source]"]').val()).toEqual(window.location.pathname);
      });

      it("sets event handlers on the survey", function() {
        spyOn(surveys, 'setEmailSurveyEventHandlers');
        surveys.displaySurvey(emailSurvey);
        expect(surveys.setEmailSurveyEventHandlers).toHaveBeenCalledWith(emailSurvey);
      });

      it("records an event when showing the survey", function() {
        spyOn(surveys, 'trackEvent');
        surveys.displaySurvey(emailSurvey);
        expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'banner_shown', 'Banner has been shown');
      });

      describe("without overrides for the template defaults", function() {
        it("uses the title defined in the template data attributes", function() {
          surveys.displaySurvey(emailSurvey);
          defaultText = $('#email-survey-template').data('defaultTitle');

          expect($('#user-satisfaction-survey #email-survey-pre h1').text()).toEqual(defaultText);
        });

        it("uses the no thanks text defined in the template data attributes", function() {
          surveys.displaySurvey(emailSurvey);
          defaultText = $('#email-survey-template').data('defaultNoThanks');

          expect($('#user-satisfaction-survey #survey-no-thanks').text()).toEqual(defaultText);
          expect($('#user-satisfaction-survey #email-survey-cancel').text()).toEqual(defaultText);
        });

        it("uses the call to action text defined in the template data attributes", function() {
          surveys.displaySurvey(emailSurvey);
          defaultText = $('#email-survey-template').data('defaultSurveyCta');

          expect($('#user-satisfaction-survey #email-survey-open').text()).toEqual(defaultText);
        });

        it("uses the survey form title text defined in the template data attributes", function() {
          surveys.displaySurvey(emailSurvey);
          defaultText = $('#email-survey-template').data('defaultSurveyFormTitle');

          expect($('#user-satisfaction-survey form h1').text()).toEqual(defaultText);
        });

        it("uses the survey form email label defined in the template data attributes", function() {
          surveys.displaySurvey(emailSurvey);
          defaultText = $('#email-survey-template').data('defaultSurveyFormEmailLabel');

          expect($('#user-satisfaction-survey form label').text()).toEqual(defaultText);
        });

        it("uses the survey form call to action defined in the template data attributes", function() {
          surveys.displaySurvey(emailSurvey);
          defaultText = $('#email-survey-template').data('defaultSurveyFormCta');

          expect($('#user-satisfaction-survey form button').text()).toEqual(defaultText);
        });

        it("uses the survey form call to action postscript defined in the template data attributes", function() {
          surveys.displaySurvey(emailSurvey);
          defaultText = $('#email-survey-template').data('defaultSurveyFormCtaPostscript');

          expect($('#user-satisfaction-survey form .button-info').text()).toEqual(defaultText);
        });

        it("uses the survey form success text defined in the template data attributes", function() {
          surveys.displaySurvey(emailSurvey);
          defaultText = $('#email-survey-template').data('defaultSurveySuccess');

          expect($('#user-satisfaction-survey  #email-survey-post-success p').text()).toEqual(defaultText);
        });

        it("uses the survey form failure text defined in the template data attributes", function() {
          surveys.displaySurvey(emailSurvey);
          defaultText = $('#email-survey-template').data('defaultSurveyFailure');

          expect($('#user-satisfaction-survey  #email-survey-post-failure p').text()).toEqual(defaultText);
        });
      });

      describe("with overrides for the template defaults", function() {
        it("uses the title defined in the survey", function() {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            templateArguments: {
              title: 'Do you like email?'
            }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey #email-survey-pre h1').text()).toEqual('Do you like email?');
        });

        it("uses the no thanks text defined in the survey", function() {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            templateArguments: {
              noThanks: 'No way!'
            }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey #survey-no-thanks').text()).toEqual('No way!');
          expect($('#user-satisfaction-survey #email-survey-cancel').text()).toEqual('No way!');
        });

        it("uses the call to action text defined in the survey", function() {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            templateArguments: {
              surveyCta: 'Click here now!'
            }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey #email-survey-open').text()).toEqual('Click here now!');
        });

        it("uses the survey form title text defined in the survey", function() {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            templateArguments: {
              surveyFormTitle: 'Tell us your email address'
            }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey form h1').text()).toEqual('Tell us your email address');
        });

        it("uses the survey form email label defined in the survey", function() {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            templateArguments: {
              surveyFormEmailLabel: 'Enter it here'
            }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey form label').text()).toEqual('Enter it here');
        });

        it("uses the survey form call to action defined in the survey", function() {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            templateArguments: {
              surveyFormCta: 'Clicking this sends us your address'
            }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey form button').text()).toEqual('Clicking this sends us your address');
        });

        it("uses the survey form call to action postscript defined in the survey", function() {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            templateArguments: {
              surveyFormCtaPostscript: 'We will not send you spam'
            }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey form .button-info').text()).toEqual('We will not send you spam');
        });

        it("uses the survey form success text defined in the survey", function() {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            templateArguments: {
              surveySuccess: 'Yay, it worked!'
            }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey  #email-survey-post-success p').text()).toEqual('Yay, it worked!');
        });

        it("uses the survey form failure text defined in the survey", function() {
          var survey = {
            surveyType: 'email',
            identifier: 'email_survey',
            templateArguments: {
              surveyFailure: 'Boo, it failed'
            }
          };
          surveys.displaySurvey(survey);

          expect($('#user-satisfaction-survey  #email-survey-post-failure p').text()).toEqual('Boo, it failed');
        });
      });
    });
  });

  describe("isSurveyToBeDisplayed", function() {
    it("returns false if another notification banner is visible", function() {
      $('#global-cookie-message').css('display', 'block');

      expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy();
    });

    it("returns false if the path is blacklisted", function() {
      spyOn(surveys, 'pathInBlacklist').and.returnValue(true);

      expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy();
    })

    it("returns false if the 'survey taken' cookie is set", function () {
      GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey), 'true');

      expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy();
    });

    it("returns false when the random number does not match", function() {
      spyOn(surveys, 'randomNumberMatches').and.returnValue(false);
      expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeFalsy();
    });

    it("returns true when the random number matches", function() {
      spyOn(surveys, 'randomNumberMatches').and.returnValue(true);
      expect(surveys.isSurveyToBeDisplayed(defaultSurvey)).toBeTruthy();
    });
  });

  describe("pathInBlacklist", function() {
    // we make sure that slash-terminated and slash-unterminated versions
    // of these paths work
    it("returns true if the path is /service-manual", function() {
      spyOn(surveys, 'currentPath').and.returnValue('/service-manual', '/service-manual/');
      expect(surveys.pathInBlacklist()).toBeTruthy();
      expect(surveys.pathInBlacklist()).toBeTruthy();
    });

    it("returns true if the path is a sub-folder under /service-manual", function() {
      spyOn(surveys, 'currentPath').and.returnValue('/service-manual/some-other-page', '/service-manual/some-other-page/');
      expect(surveys.pathInBlacklist()).toBeTruthy();
      expect(surveys.pathInBlacklist()).toBeTruthy();
    });

    it("returns false if the path is /service-manual-with-a-suffix", function() {
      spyOn(surveys, 'currentPath').and.returnValues('/service-manual-with-a-suffix', '/service-manual-with-a-suffix/');
      expect(surveys.pathInBlacklist()).toBeFalsy();
      expect(surveys.pathInBlacklist()).toBeFalsy();
    });

    it("returns false if the path is /some-other-parent-of/service-manual", function() {
      spyOn(surveys, 'currentPath').and.returnValue('/some-other-parent-of/service-manual', '/some-other-parent-of/service-manual/');
      expect(surveys.pathInBlacklist()).toBeFalsy();
      expect(surveys.pathInBlacklist()).toBeFalsy();
    });

    it("returns false otherwise", function() {
      spyOn(surveys, 'currentPath').and.returnValue('/');
      expect(surveys.pathInBlacklist()).toBeFalsy();
    });
  });

  describe("userCompletedTransaction", function() {
    it("normally returns false", function() {
      spyOn(surveys, 'currentPath').and.returnValue('/');
      expect(surveys.userCompletedTransaction()).toBeFalsy();
    });

    it("returns true when /done", function() {
      spyOn(surveys, 'currentPath').and.returnValue('/done');
      expect(surveys.userCompletedTransaction()).toBeTruthy();
    });

    it("returns true when /transaction-finished", function() {
      spyOn(surveys, 'currentPath').and.returnValue('/transaction-finished');
      expect(surveys.userCompletedTransaction()).toBeTruthy();
    });

    it("returns true when /driving-transaction-finished", function() {
      spyOn(surveys, 'currentPath').and.returnValue('/driving-transaction-finished');
      expect(surveys.userCompletedTransaction()).toBeTruthy();
    });
  });

  describe("Event handlers", function () {
    describe("for a url survey", function() {
      beforeEach(function() {
        surveys.displaySurvey(defaultSurvey);
      });

      it("sets a cookie when clicking 'take survey'", function () {
        $('#take-survey').trigger('click');
        expect(GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey))).toBe('true');
      });

      it("sets a cookie when clicking 'no thanks'", function () {
        $('#survey-no-thanks').trigger('click');
        expect(GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey))).toBe('true');
      });

      it("hides the satisfaction survey bar after clicking 'take survey'", function () {
        $('#take-survey').trigger('click');
        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false);
        expect($('#user-satisfaction-survey').attr('aria-hidden')).toBe('true');
      });

      it("hides the satisfaction survey bar after clicking 'no thanks'", function () {
        $('#survey-no-thanks').trigger('click');
        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false);
      });

      it("records an event when clicking 'take survey'", function() {
        spyOn(surveys, 'trackEvent');
        $('#take-survey').trigger('click');
        expect(surveys.trackEvent).toHaveBeenCalledWith(defaultSurvey.identifier, 'banner_taken', 'User taken survey');
      });

      it("records an event when clicking 'no thanks'", function() {
        spyOn(surveys, 'trackEvent');
        $('#survey-no-thanks').trigger('click');
        expect(surveys.trackEvent).toHaveBeenCalledWith(defaultSurvey.identifier, 'banner_no_thanks', 'No thanks clicked');
      });
    });

    describe("for an email survey", function() {
      var emailSurvey = {
        surveyType: 'email',
        identifier: 'email-survey',
      };

      beforeEach(function() {
        surveys.displaySurvey(emailSurvey);
      });

      it("sets a cookie when clicking 'no thanks'", function () {
        $('#survey-no-thanks').trigger('click');
        expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).toBe('true');
      });

      it("hides the satisfaction survey bar after clicking 'no thanks'", function () {
        $('#survey-no-thanks').trigger('click');
        expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false);
      });

      it("records an event when clicking 'no thanks'", function() {
        spyOn(surveys, 'trackEvent');
        $('#survey-no-thanks').trigger('click');
        expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'banner_no_thanks', 'No thanks clicked');
      });

      it("opens the email form when clicking on 'Your feedback will help us ...'", function() {
        $('#email-survey-open').trigger('click');
        expect($('#email-survey-form').hasClass('js-hidden')).toBe(false);
      });

      it("hides the invitation to take the survey when clicking on 'Your feedback will help us ...'", function() {
        $('#email-survey-open').trigger('click');
        expect($('#email-survey-pre').hasClass('js-hidden')).toBe(true);
      });

      it("records an event when clicking on 'Your feedback will help us ...'", function() {
        spyOn(surveys, 'trackEvent');
        $('#email-survey-open').trigger('click');
        expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'email_survey_open', 'Email survey opened');
      });

      describe("once the email form is opened", function() {
        it("sends the details to the feedback app with ajax when submitting the form", function() {
          spyOn($, "ajax");
          $('#email-survey-form').trigger('submit');

          expect($.ajax).toHaveBeenCalled();
          var args = $.ajax.calls.mostRecent().args;
          expect(args[0].url).toBe('/contact/govuk/email-survey-signup.js');
        });

        it("doesn't add .js to the form action if it's already a .js url when submitting the form", function() {
          spyOn($, "ajax");
          $('#email-survey-form').attr('action', '/contact/govuk/js-already/email-survey-signup.js')
          $('#email-survey-form').trigger('submit');

          expect($.ajax).toHaveBeenCalled();
          var args = $.ajax.calls.mostRecent().args;
          expect(args[0].url).toBe('/contact/govuk/js-already/email-survey-signup.js');
        });

        describe("and submitting it is a success", function() {
          beforeEach(function() {
            spyOn($, "ajax").and.callFake(function(options) {
              if (options.success) {
                options.success({message: 'great success!'});
              }
            });
          });

          it("opens the post submit success message", function() {
            $('#email-survey-form').trigger('submit');
            expect($('#email-survey-post-success').hasClass('js-hidden')).toBe(false);
          });

          it("hides the email form", function() {
            $('#email-survey-form').trigger('submit');
            expect($('#email-survey-form').hasClass('js-hidden')).toBe(true);
          });

          it("sets a cookie", function () {
            $('#email-survey-form').trigger('submit');
            expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).toBe('true');
          });

          it("records an event", function() {
            spyOn(surveys, 'trackEvent');
            $('#email-survey-form').trigger('submit');
            expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'email_survey_taken', 'Email survey taken');
            expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'banner_taken', 'User taken survey');
          });
        });

        describe("but submitting it results in an error", function() {
          beforeEach(function() {
            spyOn($, "ajax").and.callFake(function(options) {
              options.error({message: 'bad error!'});
            });
          });

          it("opens the post submit failure message", function() {
            $('#email-survey-form').trigger('submit');
            expect($('#email-survey-post-failure').hasClass('js-hidden')).toBe(false);
          });

          it("hides the email form", function() {
            $('#email-survey-form').trigger('submit');
            expect($('#email-survey-form').hasClass('js-hidden')).toBe(true);
          });

          it("does not sets a cookie", function () {
            $('#email-survey-form').trigger('submit');
            expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).not.toBe('true');
          });

          it("does not records any events", function() {
            spyOn(surveys, 'trackEvent');
            $('#email-survey-form').trigger('submit');
            expect(surveys.trackEvent).not.toHaveBeenCalled();
          });
        });

        it("hides the email form when clicking 'No thanks'", function() {
          $('#email-survey-cancel').trigger('click');
          expect(GOVUK.cookie(surveys.surveyTakenCookieName(emailSurvey))).toBe('true');
        });

        it("hides the whole email survey interface after clicking 'no thanks'", function () {
          $('#email-survey-cancel').trigger('click');
          expect($('#user-satisfaction-survey').hasClass('visible')).toBe(false);
        });

        it("records an event when clicking 'no thanks'", function() {
          spyOn(surveys, 'trackEvent');
          $('#email-survey-cancel').trigger('click');
          expect(surveys.trackEvent).toHaveBeenCalledWith(emailSurvey.identifier, 'email_survey_cancel', 'Email survey cancelled');
        });
      });
    });
  });

  describe("currentTime", function() {
    it("actually returns a value from `currentTime`", function() {
      expect(surveys.currentTime()).not.toBe(undefined);
    });
  });

  describe("surveyTakenCookieName", function() {
    it("returns a cookie name based on the survey identifier", function() {
      var surveyMock = {identifier: 'sample_survey'}
      expect(surveys.surveyTakenCookieName(surveyMock)).toBe('govuk_takenSampleSurvey');
    });
  });

  describe("getActiveSurvey", function() {
    it("returns the default survey when no smallSurveys are present", function() {
      var smallSurveys = [smallSurvey];

      var activeSurvey = surveys.getActiveSurvey(defaultSurvey, smallSurveys);
      expect(activeSurvey).toBe(defaultSurvey);
    });

    it("returns the default survey when a smallSurvey is not active", function() {
      var smallSurveys = [smallSurvey];
      spyOn(surveys, 'currentTime').and.returnValue(new Date("July 11, 2016 10:00:00").getTime());

      var activeSurvey = surveys.getActiveSurvey(defaultSurvey, smallSurveys);
      expect(activeSurvey).toBe(defaultSurvey);
    });

    it("returns the small survey when a smallSurvey is active", function() {
      var smallSurveys = [smallSurvey];
      spyOn(surveys, 'currentTime').and.returnValue(new Date("July 9, 2016 10:00:00").getTime());

      var activeSurvey = surveys.getActiveSurvey(defaultSurvey, smallSurveys);
      expect(activeSurvey).toBe(smallSurvey);
    });

    describe("activeWhen function call", function() {
      it("returns the test survey when the callback returns true", function() {
        spyOn(surveys, 'currentTime').and.returnValue(new Date("July 9, 2016 10:00:00").getTime());
        var testSurvey = {
          startTime: new Date("July 5, 2016").getTime(),
          endTime: new Date("July 10, 2016 23:50:00").getTime(),
          activeWhen: function() { return true; },
          url: 'example.com/small-survey'
        };

        var activeSurvey = surveys.getActiveSurvey(defaultSurvey, [testSurvey]);
        expect(activeSurvey).toBe(testSurvey);
      });

      it("returns the default when the callback returns false", function() {
        spyOn(surveys, 'currentTime').and.returnValue(new Date("July 9, 2016 10:00:00").getTime());
        var testSurvey = {
          startTime: new Date("July 5, 2016").getTime(),
          endTime: new Date("July 10, 2016 23:50:00").getTime(),
          activeWhen: function() { return false; },
          url: 'example.com/small-survey'
        };

        var activeSurvey = surveys.getActiveSurvey(defaultSurvey, [testSurvey]);
        expect(activeSurvey).toBe(defaultSurvey);
      });
    });
  });
});
