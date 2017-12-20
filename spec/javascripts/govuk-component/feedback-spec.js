describe("Improve this page", function () {
   var FIXTURE =
    '<div class="pub-c-feedback">' +
      '<div class="js-prompt">' +
        '<span class="pub-c-feedback__is-useful-question">Is this page useful?</span>' +
        '<a href="/contact/govuk" class="js-page-is-useful" data-track-category="improve-this-page" data-track-action="page-is-useful">Yes</a>' +
        '<a href="/contact/govuk" class="js-page-is-not-useful" data-track-category="improve-this-page" data-track-action="page-is-not-useful" aria-controls="improveThisPageForm">No</a>' +
        '<div class="pub-c-feedback__anything-wrong">' +
          '<a href="/contact/govuk" class="js-something-is-wrong" data-track-category="improve-this-page" data-track-action="something-is-wrong" aria-controls="improveThisPageForm">Is there anything wrong with this page?</a>' +
        '</div>' +
      '</div>' +
      '<div id="improveThisPageForm" class="pub-c-feedback__form js-feedback-form js-hidden" data-track-category="improve-this-page" data-track-action="give-feedback">' +
        '<a href="#" class="pub-c-feedback__close js-close-feedback-form">Close</a>' +
        '<div class="js-errors"></div>' +
        '<form>' +
          '<input type="hidden" name="url" value="http://example.com/path/to/page"></input>' +
          '<input type="hidden" name="user_agent" value="Safari"></input>' +
          '<div class="form-group">' +
            '<label class="form-label-bold" for="description-field">' +
              'How should we improve this page?' +
            '</label>' +
            '<textarea id="description-field" class="form-control" name="description" rows="5" aria-required="true"></textarea>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label" for="name-field">' +
              'Name (optional)' +
              '<span class="form-hint">Include your name and email address if you\'d like us to get back to you.</span>' +
            '</label>' +
            '<input id="name-field" class="form-control" type="text" name="name">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label" for="email-field">Email (optional)</label>' +
            '<input id="email-field" class="form-control" type="text" name="email">' +
          '</div>' +
          '<div>' +
            '<input class="button" type="submit" value="Send message">' +
          '</div>' +
        '</form>' +
      '</div>' +
    '</div>';

  beforeEach(function () {
    setFixtures(FIXTURE);
  });

  it("hides the form", function () {
    loadImproveThisPage();

    expect($('.js-feedback-form')).toHaveClass('js-hidden');
  });

  it("shows the prompt", function () {
    loadImproveThisPage();

    expect($('.pub-c-feedback .js-prompt')).not.toHaveClass('js-hidden');
  });

  it("conveys that the feedback form is hidden", function() {
    loadImproveThisPage();

    expect($('.js-feedback-form').attr('aria-hidden')).toBe('true');
  });

  it("conveys that the form is not expanded", function () {
    loadImproveThisPage();

    expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false');
    expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false');
  });

  describe("Clicking the 'page was useful' link", function () {
    it("displays a success message", function () {
      loadImproveThisPage();
      $('a.js-page-is-useful').click();

      var $prompt = $('.pub-c-feedback .js-prompt')

      expect($prompt).not.toHaveClass('js-hidden');
      expect($prompt).toHaveText("Thanks for your feedback.");
    });

    it("triggers a Google Analytics event", function () {
      var analytics = {
        trackEvent: function() {}
      };

      withGovukAnalytics(analytics, function () {
        spyOn(GOVUK.analytics, 'trackEvent');

        loadImproveThisPage();

        $('a.js-page-is-useful').click();

        expect(GOVUK.analytics.trackEvent).
          toHaveBeenCalledWith('improve-this-page', 'page-is-useful');
      });
    });
  });

  describe("Clicking the 'page was not useful' link", function () {
    it("shows the feedback form", function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();

      expect($('.pub-c-feedback .js-feedback-form')).not.toHaveClass('js-hidden');
    });

    it("hides the prompt", function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();

      expect($('.pub-c-feedback .js-prompt')).toHaveClass('js-hidden');
    });

    it("conveys that the form is now visible", function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();

      expect($('.js-feedback-form').attr('aria-hidden')).toBe('false');
    });

    it("conveys that the form is now expanded", function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('true');
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('true');
    });

    it("focusses the first field in the form", function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();

      expect(document.activeElement).toBe($('.form-control').get(0));
    });

    it("triggers a Google Analytics event", function () {
      var analytics = {
        trackEvent: function() {}
      };

      withGovukAnalytics(analytics, function () {
        spyOn(GOVUK.analytics, 'trackEvent');

        loadImproveThisPage();

        $('a.js-page-is-not-useful').click();

        expect(GOVUK.analytics.trackEvent).
          toHaveBeenCalledWith('improve-this-page', 'page-is-not-useful');
      });
    });
  });

  describe("Clicking the 'something is wrong with the page' link", function () {
    it("shows the feedback form", function () {
      loadImproveThisPage();
      $('a.js-something-is-wrong').click();

      expect($('.pub-c-feedback .js-feedback-form')).not.toHaveClass('js-hidden');
    });

    it("hides the prompt", function () {
      loadImproveThisPage();
      $('a.js-something-is-wrong').click();

      expect($('.pub-c-feedback .js-prompt')).toHaveClass('js-hidden');
    });

    it("conveys that the form is now visible", function () {
      loadImproveThisPage();
      $('a.js-something-is-wrong').click();

      expect($('.js-feedback-form').attr('aria-hidden')).toBe('false');
    });

    it("conveys that the form is now expanded", function () {
      loadImproveThisPage();
      $('a.js-something-is-wrong').click();

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('true');
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('true');
    });

    it("focusses the first field in the form", function () {
      loadImproveThisPage();
      $('a.js-page-is-not-useful').click();

      expect(document.activeElement).toBe($('.form-control').get(0));
    });

    it("triggers a Google Analytics event", function () {
      var analytics = {
        trackEvent: function() {}
      };

      withGovukAnalytics(analytics, function () {
        spyOn(GOVUK.analytics, 'trackEvent');

        loadImproveThisPage();

        $('a.js-something-is-wrong').click();

        expect(GOVUK.analytics.trackEvent).
          toHaveBeenCalledWith('improve-this-page', 'something-is-wrong');
      });
    });
  });

  describe("Clicking the close link", function () {
    beforeEach(function () {
      loadImproveThisPage();

      $('a.js-something-is-wrong').click();
      $('a.js-close-feedback-form').click();
    })

    it("hides the form", function() {
      expect($('.pub-c-feedback .js-feedback-form')).toHaveClass('js-hidden');
    });

    it("shows the prompt", function() {
      expect($('.pub-c-feedback .js-prompt')).not.toHaveClass('js-hidden');
    });

    it("conveys that the feedback form is hidden", function() {
      loadImproveThisPage();

      expect($('.js-feedback-form').attr('aria-hidden')).toBe('true');
    });

    it("conveys that the form is not expanded", function () {
      loadImproveThisPage();

      expect($('.js-page-is-not-useful').attr('aria-expanded')).toBe('false');
      expect($('.js-something-is-wrong').attr('aria-expanded')).toBe('false');
    });
  })

  describe("Successfully submitting the feedback form", function () {

    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("triggers a Google Analytics event", function () {
      var analytics = {
        trackEvent: function() {}
      };

      withGovukAnalytics(analytics, function () {
        spyOn(GOVUK.analytics, 'trackEvent');

        loadImproveThisPage();
        fillAndSubmitFeedbackForm();

        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/plain',
          responseText: ''
        });

        expect(GOVUK.analytics.trackEvent).
          toHaveBeenCalledWith('improve-this-page', 'give-feedback');
      });
    });

    it("submits the feedback to the feedback frontend", function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe('/contact/govuk/page_improvements');
      expect(request.method).toBe('POST');
      expect(request.data()).toEqual({
        url: ["http://example.com/path/to/page"],
        description: ["The background should be green."],
        name: ["Henry"],
        email: ["henry@example.com"],
        user_agent: ["Safari"]
      });
    });

    it("displays a success message", function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      var $prompt = $('.pub-c-feedback .js-prompt');

      expect($prompt).not.toHaveClass('js-hidden');
      expect($prompt).toHaveText("Thanks for your feedback.");
    });

    if("focusses the success message", function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      var $prompt = $('.pub-c-feedback .js-prompt');
      expect(document.activeElement).toBe($prompt);
    })

    it("hides the form", function() {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect($('.js-feedback-form')).toHaveClass('js-hidden');
    });

    it("removes the links to show the feedback form", function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: '{}'
      });

      expect($('.js-page-is-not-useful, .js-something-is-wrong').length).toBe(0);
    });
  });

  describe("Submitting a form with invalid data", function () {
    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("disables the submit button until the server responds", function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      expect($('.pub-c-feedback form [type=submit]')).toBeDisabled();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('.pub-c-feedback form [type=submit]')).not.toBeDisabled();
    });

    it('retains the feedback the user originally entered', function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('[name=description]').val()).toEqual('The background should be green.');
      expect($('[name=name]').val()).toEqual('Henry');
      expect($('[name=email]').val()).toEqual('henry@example.com');
    });

    it("displays validation errors in the label of each field", function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('label[for=description-field]')).toContainText("Description can't be blank.");
    });

    it("marks fields with validation errors as invalid", function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect($('[name=description]')).toHaveAttr('aria-invalid', 'true');
    });

    it("focusses the first form group if there are no generic errors", function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"description": ["can\'t be blank"]}}'
      });

      expect(document.activeElement).toBe($('[name=description]').get(0));
    });

    it("displays a generic error if the field isn't a visible part of the form", function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "another": ["weird error"]}}'
      });

      expect($('.pub-c-feedback .error-summary')).toContainText("Path can't be blank. Another weird error.");
    });

    it("focusses the generic error if there is one", function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "description": ["can\'t be blank"]}}'
      });

      expect(document.activeElement).toBe($('.error-summary').get(0));
    });

    it("associates the error summary with its message so screen readers will read it when the div is focussed", function () {
      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 422,
        contentType: 'application/json',
        responseText: '{"errors": {"path": ["can\'t be blank"], "description": ["can\'t be blank"]}}'
      });

      var $genericErrorMessage = $('#generic-error-message');

      expect($('.error-summary').attr('aria-labelledby')).toEqual(
        $genericErrorMessage.attr('id')
      );
    });
  })

  describe("Submitting a form that fails for some reason", function () {
    beforeEach(function() {
      jasmine.Ajax.install();

      loadImproveThisPage();
      fillAndSubmitFeedbackForm();

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 500,
        contentType: 'text/plain',
        responseText: ''
      });
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("displays a generic error message", function () {
      expect($('.pub-c-feedback').html()).toContainText(
        'Sorry, we’re unable to receive your message right now. ' +
        'If the problem persists, we have other ways for you to provide ' +
        'feedback on the contact page.'
      );
    });

    it('retains the feedback the user originally entered', function () {
      expect($('[name=description]').val()).toEqual('The background should be green.');
      expect($('[name=name]').val()).toEqual('Henry');
      expect($('[name=email]').val()).toEqual('henry@example.com');
    });

    it('re-enables the submit button', function () {
      expect($('.pub-c-feedback form [type=submit]')).not.toBeDisabled();
    });
  })

  function loadImproveThisPage () {
    var improveThisPage = new GOVUK.Modules.ImproveThisPage();
    improveThisPage.start($('.pub-c-feedback'));
  }

  function fillAndSubmitFeedbackForm () {
    $form = $('.pub-c-feedback form');
    $form.find("[name=description]").val("The background should be green.");
    $form.find("[name=name]").val("Henry");
    $form.find("[name=email]").val("henry@example.com");
    $form.find("[type=submit]").click();
  }
});
