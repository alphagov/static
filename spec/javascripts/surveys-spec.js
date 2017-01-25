describe("Surveys", function() {
  var surveys = GOVUK.userSurveys;
  var $block;

  var defaultSurvey = {
    url: 'surveymonkey.com/default',
    frequency: 1, // no randomness in the test suite pls
    identifier: 'user_satisfaction_survey',
    template: '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
              '  <a href="#survey-no-thanks" id="survey-no-thanks">No thanks</a>' +
              '  <a href="javascript:void()" id="take-survey" target="_blank"></a>' +
              '</section>'
  };
  var smallSurvey = {
    startTime: new Date("July 5, 2016").getTime(),
    endTime: new Date("July 10, 2016 23:50:00").getTime(),
    url: 'example.com/small-survey'
  };

  beforeEach(function () {
    $block = $('<div id="banner-notification" style="display: none"></div>' +
               '<div id="global-cookie-message" style="display: none"></div>' +
               '<div id="global-browser-prompt" style="display: none"></div>' +
               '<div id="user-satisfaction-survey-container"></div>');

    $('body').append($block);
    $("#user-satisfaction-survey").remove();

    // Don't actually try and take a survey in test.
    $('#take-survey').on('click', function(e) {
      e.preventDefault();
    });
  });

  afterEach(function () {
    GOVUK.cookie(surveys.surveyTakenCookieName(defaultSurvey), null);
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

    it("links to the url for a surveymonkey survey with a completion redirect query parameter", function () {
      surveys.displaySurvey(defaultSurvey);

      expect($('#take-survey').attr('href')).toContain(defaultSurvey.url);
      expect($('#take-survey').attr('href')).toContain("?c=" + window.location.pathname);
    });

    it("records an event when showing the survey", function() {
      spyOn(surveys, 'trackEvent');
      surveys.displaySurvey(defaultSurvey);
      expect(surveys.trackEvent).toHaveBeenCalledWith(defaultSurvey.identifier, 'banner_shown', 'Banner has been shown');
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
