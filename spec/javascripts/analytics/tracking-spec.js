describe("success event tracking", function () {

  var guideMarkup = $("<div id='content' class='test-stub'>" +
    "<a id='guide-internal-link' href='#this-is-a-test'>link</a>" +
    "<a id='guide-external-link' href='http://www.google.com/' rel='external'>link</a>" +
    "<div id='get-started'>" +
    "<a id='transaction-external-link' href='http://www.google.com/' data-transaction-slug='test-slug' rel='external'>link</a>" +
    "</div>" +
    "</div>");

  var articleContainer = $("<div class='article-container test-stub'><a id='transaction-link' href='#'>link</a></div>");

  beforeEach(function () {
    $('a').unbind();
    articleContainer.clone().appendTo('body');
    guideMarkup.clone().appendTo('body');
    spyOn(GOVUK, 'sendToAnalytics');
  });

  afterEach(function () {
    GOVUK.cookie("successEvents", null);
    $(".test-stub").remove();
    $.event.trigger("smartanswerOutcome");
  });

  describe("isTheSameArtefact", function () {
    it("should support basic case", function () {
      var result = GOVUK.Analytics.isTheSameArtefact(
        "http://www.gov.uk/claim-tax/first",
        "http://www.gov.uk/claim-tax/second",
        0);

      expect(result).toBeTruthy();
    });

    it("should support coming to very same url", function () {
      var result = GOVUK.Analytics.isTheSameArtefact(
        "http://www.gov.uk/claim-tax/first",
        "http://www.gov.uk/claim-tax/first",
        0);

      expect(result).toBeTruthy();
    });

    it("should support local anchor on previous url", function () {
      var result = GOVUK.Analytics.isTheSameArtefact(
        "http://www.gov.uk/claim-tax",
        "http://www.gov.uk/claim-tax#foobar",
        0);

      expect(result).toBeTruthy();
    });

    it("should support local anchor on current url", function () {
      var result = GOVUK.Analytics.isTheSameArtefact(
        "http://www.gov.uk/claim-tax#foobar",
        "http://www.gov.uk/claim-tax",
        0);

      expect(result).toBeTruthy();
    });

    it("should support different slug locations", function () {
      var result = GOVUK.Analytics.isTheSameArtefact(
        "https://www.gov.uk/government/policies/making-sure-council-tax-payers-get-good-value-for-money",
        "https://www.gov.uk/government/policies/making-sure-council-tax-payers-get-good-value-for-money/foo",
        2);

      expect(result).toBeTruthy();
    });

    it("should support different slug locations", function () {
      var result = GOVUK.Analytics.isTheSameArtefact(
        "https://www.gov.uk/government/policies/making-sure-council-tax-payers-get-good-value-for-money",
        "https://www.gov.uk/government/policies/something-different",
        2);

      expect(result).toBeFalsy();
    });
  });

  describe("isRootArtefact", function () {
    it("should be true for standard artefact url", function () {
      expect(GOVUK.Analytics.isRootOfArtefact("http://smartanswers.dev.gov.uk/student-finance-calculator", 0))
      .toBeTruthy();
      expect(GOVUK.Analytics.isRootOfArtefact("http://smartanswers.dev.gov.uk/government/policies/foo", 2))
      .toBeTruthy();
    });

    it("should be true for standard artefact url ending with a slash", function () {
      expect(GOVUK.Analytics.isRootOfArtefact("http://smartanswers.dev.gov.uk/student-finance-calculator/", 0))
      .toBeTruthy();
      expect(GOVUK.Analytics.isRootOfArtefact("http://smartanswers.dev.gov.uk/government/policies/foo/", 2))
      .toBeTruthy();
    });

    it("should be false for non-root artefact url", function () {
      expect(GOVUK.Analytics.isRootOfArtefact("http://smartanswers.dev.gov.uk/student-finance-calculator/y", 0))
      .toBeFalsy();
      expect(GOVUK.Analytics.isRootOfArtefact("http://smartanswers.dev.gov.uk/government/policies/foo/bar", 2))
      .toBeFalsy();
    });

  });

  describe("getSlug", function () {
    it("should return the slug from a url", function () {
      var mainstreamSlug = GOVUK.Analytics.getSlug("https://www.gov.uk/student-finance-calculator", 0);
      var insideGovPolicySlug = GOVUK.Analytics.getSlug("https://www.gov.uk/government/policies/making-sure-council-tax-payers-get-good-value-for-money", 2);

      expect(mainstreamSlug).toEqual("student-finance-calculator");
      expect(insideGovPolicySlug).toEqual("making-sure-council-tax-payers-get-good-value-for-money");
    });

    it("should return slug even if there is a fragment", function () {
      var result = GOVUK.Analytics.getSlug("https://www.gov.uk/student-finance-calculator#foobar", 0);

      expect(result).toEqual("student-finance-calculator");
    });

    it("should return slug even if there is more of the request path", function () {
      var result = GOVUK.Analytics.getSlug("https://www.gov.uk/student-finance-calculator/foobar", 0);

      expect(result).toEqual("student-finance-calculator");
    });

    it("should return slug even if there is a query string", function () {
      var result = GOVUK.Analytics.getSlug("https://www.gov.uk/student-finance-calculator?foobar=barfoo", 0);

      expect(result).toEqual("student-finance-calculator");
    });
  });

  describe("analytics integration", function () {
    beforeEach(function() {
      spyOn(GOVUK.Analytics, "getSlug").and.returnValue("");
    });

    it("should register entry event", function () {
      GOVUK.Analytics.Format = 'guide';
      GOVUK.Analytics.startAnalytics();

      var arguments = GOVUK.sendToAnalytics.calls.allArgs();
      var expectedDataToSendToGoogle = ['_trackEvent', 'MS_guide', '', 'Entry', 0, true];
      expect(arguments.length).toBe(1);
              // using JSONEquals because there is a bug in the .toHaveBeenCalledWith() method
              // see: https://github.com/pivotal/jasmine/issues/45
              expect(arguments[0][0]).toBeEqualAsJSON(expectedDataToSendToGoogle);
            });

    it("should only call guide strategy when format is guide", function () {
      GOVUK.Analytics.Format = 'guide';
      spyOn(GOVUK.Analytics.Trackers, 'guide');
      GOVUK.Analytics.Trackers.guide.slugLocation = 0;
      spyOn(GOVUK.Analytics.Trackers, 'transaction');

      GOVUK.Analytics.startAnalytics();

      expect(GOVUK.Analytics.Trackers.transaction).not.toHaveBeenCalled();
      expect(GOVUK.Analytics.Trackers.guide).toHaveBeenCalled();
    });

    it("should only call transaction strategy when format is transaction", function () {
      GOVUK.Analytics.Format = 'transaction';
      spyOn(GOVUK.Analytics.Trackers, 'guide');
      spyOn(GOVUK.Analytics.Trackers, 'transaction');
      GOVUK.Analytics.Trackers.transaction.slugLocation = 0;

      GOVUK.Analytics.startAnalytics();

      expect(GOVUK.Analytics.Trackers.transaction).toHaveBeenCalled();
      expect(GOVUK.Analytics.Trackers.guide).not.toHaveBeenCalled();
    });

    it("should not error if format is not supported", function () {
      GOVUK.Analytics.Format = 'blahblah';

      GOVUK.Analytics.startAnalytics();
    });
  });

  describe("user interactions", function () {
    beforeEach(function() {
      spyOn(GOVUK.Analytics, "getSlug").and.returnValue("");
    });

    it("should register success event for guide format when an internal link inside #content receives a 'return' key press", function () {
      GOVUK.Analytics.Format = 'guide';
      GOVUK.Analytics.startAnalytics();

      var e = jQuery.Event("keydown");
      e.which = 13;
      e.keyCode = 13;
      $("#guide-internal-link").trigger(e);

      var arguments = GOVUK.sendToAnalytics.calls.allArgs();
      expect(arguments.length).toBe(2);
      expect(arguments[1][0]).toBeEqualAsJSON(['_trackEvent', 'MS_guide', '', 'Success', 0, false]);
    });

    it("should register success event for guide format when an internal link inside #content is clicked", function () {
      GOVUK.Analytics.Format = 'guide';
      GOVUK.Analytics.startAnalytics();

      $('#guide-internal-link').click();

      var arguments = GOVUK.sendToAnalytics.calls.allArgs();
      expect(arguments.length).toBe(2);
      expect(arguments[1][0]).toBeEqualAsJSON(['_trackEvent', 'MS_guide', '', 'Success', 0, false]);
    });

    it("should not register multiple guide success events when navigating to items on the same page", function () {
      GOVUK.Analytics.Format = 'guide';
      GOVUK.Analytics.startAnalytics();

      $('#guide-internal-link').click();
      $('#guide-internal-link').click();
      $('#guide-internal-link').click();
      $('#guide-internal-link').click();

      var arguments = GOVUK.sendToAnalytics.calls.allArgs();
      expect(arguments.length).toBe(2);
      expect(arguments[1][0]).toBeEqualAsJSON(['_trackEvent', 'MS_guide', '', 'Success', 0, false]);
    });

    it("should not register external click if internal link has been clicked", function () {
      GOVUK.Analytics.Format = 'guide';
      GOVUK.Analytics.startAnalytics();

      $('#guide-internal-link').click();
      $('#guide-external-link').click();

      var href = $("#guide-external-link").prop("href");
      expect(href).toEqual("http://www.google.com/");
    });

    it("should not register internal click if external link has been clicked", function () {
      GOVUK.Analytics.Format = 'guide';
      GOVUK.Analytics.startAnalytics();

      $('#guide-external-link').click();
      $('#guide-internal-link').click();

      expect(GOVUK.cookie("successEvents")).toBe(null);
    });

    it("should register a smart answer success if the smartanswerOutcome event is fired", function () {
      GOVUK.Analytics.Format = 'smart_answer';
      spyOn(GOVUK.Analytics.Trackers.smart_answer, 'shouldTrackSuccess').and.returnValue(true);
      GOVUK.Analytics.startAnalytics();

      $.event.trigger("smartanswerOutcome");

      var arguments = GOVUK.sendToAnalytics.calls.allArgs();
      expect(arguments.length).toBe(1);
      expect(arguments[0][0]).toBeEqualAsJSON(['_trackEvent', 'MS_smart_answer', '', 'Success', 0, false]);
    });

    it("should not register a smart answer success if a smartanswerOutcome event has already been fired", function () {
      GOVUK.Analytics.Format = 'smart_answer';
      spyOn(GOVUK.Analytics.Trackers.smart_answer, 'shouldTrackSuccess').and.returnValue(true);
      GOVUK.Analytics.startAnalytics();

      $.event.trigger("smartanswerOutcome");
      $.event.trigger("smartanswerOutcome");

      var arguments = GOVUK.sendToAnalytics.calls.allArgs();
      expect(arguments.length).toBe(1);
      expect(arguments[0][0]).toBeEqualAsJSON(['_trackEvent', 'MS_smart_answer', '', 'Success', 0, false]);
    });

    it("should register custom condition for entry and success tracking for smart answers", function () {
      GOVUK.Analytics.Format = 'smart_answer';
      spyOn(GOVUK.Analytics.Trackers.smart_answer, 'shouldTrackEntry');
      spyOn(GOVUK.Analytics.Trackers.smart_answer, 'shouldTrackSuccess');

      GOVUK.Analytics.startAnalytics();

      expect(GOVUK.Analytics.Trackers.smart_answer.shouldTrackEntry).toHaveBeenCalled();
      expect(GOVUK.Analytics.Trackers.smart_answer.shouldTrackSuccess).toHaveBeenCalled();
    });
  });

  describe("Success tracking for inside gov. policy format", function () {
    var policyMarkup = $("<div id='page' class='policy-stub'>" +
      "<a id='policy-in-page-link' href='#foo'></a>" +
      "<a id='policy-internal-link' href='/foobar'></a>" +
      "</div>");

    beforeEach(function () {
      spyOn(GOVUK.Analytics, "getSlug").and.returnValue("");
      policyMarkup.clone().appendTo('body');
    });

    afterEach(function () {
      $('.policy-stub').remove();
    });

    it("should register a success event for internal (GOV.UK) links", function () {
      GOVUK.Analytics.Format = 'policy';
      GOVUK.Analytics.startAnalytics();

      spyOn(GOVUK.Analytics.internalSiteEvents, 'push');

      $('#policy-internal-link').click();

      expect(GOVUK.Analytics.internalSiteEvents.push).toHaveBeenCalled();
    });

    it("should not register a success event for in-page links", function () {
      GOVUK.Analytics.Format = 'policy';
      GOVUK.Analytics.startAnalytics();

      $('#policy-in-page-link').click();
      var arguments = GOVUK.sendToAnalytics.calls.allArgs();

      // should only get entry event, not success.
      expect(arguments.length).toBe(1);
      expect(arguments[0][0][3]).toBe('Entry');
      expect(arguments[0][0][1]).toBe('IG_policy');
      expect(arguments[0][0][5]).toBe(true);
    });

    it("should register a success timeout for thirty seconds", function () {
      spyOn(window, 'setTimeout');
      GOVUK.Analytics.Format = 'policy';
      GOVUK.Analytics.startAnalytics();

      expect(window.setTimeout.calls.allArgs()[0][1]).toBe(30000);

      // call the timeout function
      window.setTimeout.calls.allArgs()[0][0]();

      var arguments = GOVUK.sendToAnalytics.calls.allArgs();
      expect(arguments.length).toBe(2);
      expect(arguments[1][0]).toBeEqualAsJSON(['_trackEvent', 'IG_policy', '', 'Success', 0, true]);
    });
  });

  describe("Success tracking for inside gov. detailed-guidance format", function () {
    var detailedGuidanceMarkup = $("<div id='page' class='guidance-stub'>" +
      "<a id='detailed-guide-in-page-link' href='#foo'></a>" +
      "<a id='detailed-guide-internal-link' href='/foobar'></a>" +
      "<a id='detailed-guide-external-link' href='http://www.google.com/foobar'></a>" +
      "</div>");

    beforeEach(function () {
      detailedGuidanceMarkup.clone().appendTo('body');
      spyOn(GOVUK.Analytics, "getSlug").and.returnValue("");
    });

    afterEach(function () {
      $('.guidance-stub').remove();
    });

    it("should register a success event for internal (GOV.UK) links", function () {
      GOVUK.Analytics.Format = 'detailed_guidance';
      GOVUK.Analytics.startAnalytics();

      spyOn(GOVUK.Analytics.internalSiteEvents, 'push');

      $('#detailed-guide-internal-link').click();

      expect(GOVUK.Analytics.internalSiteEvents.push).toHaveBeenCalled();
    });

    it("should register a success event for in-page links", function () {
      GOVUK.Analytics.Format = 'detailed_guidance';
      GOVUK.Analytics.startAnalytics();

      $('#detailed-guide-in-page-link').click();
      var arguments = GOVUK.sendToAnalytics.calls.allArgs();

      expect(arguments.length).toBe(2);
      expect(arguments[0][0][3]).toBe('Entry');
      expect(arguments[0][0][1]).toBe('IG_detailed_guidance');
      expect(arguments[0][0][5]).toBe(true);
      expect(arguments[1][0][3]).toBe('Success');
      expect(arguments[1][0][1]).toBe('IG_detailed_guidance');
      expect(arguments[1][0][5]).toBe(false);
    });

    it("should not attempt to rewrite the href for external links", function () {
      GOVUK.Analytics.Format = 'detailed_guidance';
      GOVUK.Analytics.startAnalytics();

      var currentHref = $('#detailed-guide-external-link').attr('href');

      $('#detailed-guide-external-link').click();

      expect($('#detailed-guide-external-link').attr('href')).toBe(currentHref);
    });

    it("should register a success timeout for thirty seconds", function () {
      spyOn(window, 'setTimeout');
      GOVUK.Analytics.Format = 'detailed_guidance';
      GOVUK.Analytics.startAnalytics();

      expect(window.setTimeout.calls.allArgs()[0][1]).toBe(30000);
    });
  });

  describe("success tracking for inside-gov news format", function () {
    var newsMarkup = $("<div id='page' class='page-stub'>" +
      "<a id='news-in-page-link' href='#foo'></a>" +
      "<a id='news-internal-link' href='/foobar'></a>" +
      "<a id='news-external-link' href='http://www.google.com/foobar'></a>" +
      "</div>");

    beforeEach(function () {
      newsMarkup.clone().appendTo('body');
      spyOn(GOVUK.Analytics, "getSlug").and.returnValue("");
    });

    afterEach(function () {
      $('.page-stub').remove();
    });

    it("should register a success event when an internal link is clicked inside the format content", function () {
      GOVUK.Analytics.Format = 'news';
      GOVUK.Analytics.startAnalytics();

      spyOn(GOVUK.Analytics.internalSiteEvents, 'push');

      $('#news-internal-link').click();

      expect(GOVUK.Analytics.internalSiteEvents.push).toHaveBeenCalled();
    });

    it("should register a success event for in-page links", function () {
      GOVUK.Analytics.Format = 'news';
      GOVUK.Analytics.startAnalytics();

      $('#news-in-page-link').click();
      var arguments = GOVUK.sendToAnalytics.calls.allArgs();

      expect(arguments.length).toBe(2);
      expect(arguments[0][0][3]).toBe('Entry');
      expect(arguments[0][0][1]).toBe('IG_news');
      expect(arguments[0][0][5]).toBe(true);
      expect(arguments[1][0][3]).toBe('Success');
      expect(arguments[1][0][1]).toBe('IG_news');
      expect(arguments[1][0][5]).toBe(false);
    });

    it("should not attempt to rewrite the href for external links", function () {
      GOVUK.Analytics.Format = 'news';
      GOVUK.Analytics.startAnalytics();

      var currentHref = $('#news-external-link').attr('href');

      $('#news-external-link').click();

      expect($('#news-external-link').attr('href')).toBe(currentHref);
    });

    it("should register a callback for success after 30 seconds", function () {
      spyOn(window, "setTimeout");
      GOVUK.Analytics.Format = 'news';
      GOVUK.Analytics.startAnalytics();

      var argumentsForSetTimeout = window.setTimeout.calls.allArgs();
      expect(argumentsForSetTimeout[0][1]).toBe(30000);
    });
  });
});
