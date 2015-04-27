describe("form submission for reporting a problem", function () {
  var $form, reportAProblem;

  beforeEach(function() {
    setFixtures('\
              <div class="report-a-problem-container">\
                <div class="report-a-problem-content">\
                  <form action="might-be-changed">\
                    <button class="button" name="button" type="submit">Send</button>\
                  </form>\
                </div>\
              </div>');
    $form = $('form');

    // Simulate CSS
    $('.report-a-problem-container').hide();
  });

  describe("when not included in redesign test", function() {

    beforeEach(function() {
        spyOn(GOVUK.ReportAProblem, 'isBeingTestedOnThisPage').and.returnValue(false);
        spyOn(GOVUK, 'MultivariateTest');
        reportAProblem = new GOVUK.ReportAProblem($('.report-a-problem-container'));
    });

    it("does not create a multivariate test", function(){
      expect(GOVUK.MultivariateTest).not.toHaveBeenCalled();
      expect(reportAProblem.multivariateTest).toBe(undefined);
    });

    testToggleBehaviour();
    testRequestHandlingBehaviour();
  });

  describe("when included in redesign test", function() {

    beforeEach(function() {
      spyOn(GOVUK.ReportAProblem, 'isBeingTestedOnThisPage').and.returnValue(true);
    });

    it('creates a multivariate test', function() {
      reportAProblem = new GOVUK.ReportAProblem($('.report-a-problem-container'));
      expect(reportAProblem.multivariateTest.name).toBe('report-a-problem-redesign-ab-test');
    });

    describe("when showing original variant", function(){
      beforeEach(function() {
        spyOn(GOVUK, 'cookie').and.returnValue('variant_0');
        reportAProblem = new GOVUK.ReportAProblem($('.report-a-problem-container'));
      });

      it('uses variant_0', function() {
        expect(reportAProblem.multivariateTest.getCohort()).toBe('variant_0');
      });

      it('tracks an event when the form is toggled', function() {
        spyOn(GOVUK.analytics, 'trackEvent');
        $('.js-report-a-problem-toggle').first().click();
        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('report-a-problem', 'link-toggled');
      });

      testToggleBehaviour();
      testRequestHandlingBehaviour();
    });

    describe("when showing new variant", function(){
      beforeEach(function() {
        spyOn(GOVUK, 'cookie').and.returnValue('variant_1');
        reportAProblem = new GOVUK.ReportAProblem($('.report-a-problem-container'));
      });

      it('uses variant_1', function() {
        expect(reportAProblem.multivariateTest.getCohort()).toBe('variant_1');
      });

      it('shows the form when selecting yes or no', function() {
        expect($form).toBeHidden();
        $('[data-useful=Yes]').click();
        expect($form).toBeVisible();
      });

      it('tracks an event when yes or no is selected', function() {
        spyOn(GOVUK.analytics, 'trackEvent');

        $('[data-useful=No]').click();
        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('report-a-problem', 'was-page-useful', {label: 'no'});

        $('[data-useful=Yes]').click();
        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('report-a-problem', 'was-page-useful', {label: 'yes'});
      });

      it('records yes or no in a hidden input', function() {
        $('[data-useful=No]').click();
        expect($form.find('[name=what_doing]').val()).toBe('Was this page useful? No');

        $('[data-useful=Yes]').click();
        expect($form.find('[name=what_doing]').val()).toBe('Was this page useful? Yes');
      });

      testRequestHandlingBehaviour();
    });
  });

  function testToggleBehaviour() {
    describe("clicking on the toggle", function(){
      it("should toggle the visibility of the form", function() {
        expect($form).toBeHidden();
        $('.js-report-a-problem-toggle').click();
        expect($form).toBeVisible();
        $('.js-report-a-problem-toggle').click();
        expect($form).toBeHidden();
      });
    });
  }

  function testRequestHandlingBehaviour() {
    describe("if the request succeeds", function() {
      it("should replace the form with the response from the AJAX call", function() {

        $form.trigger('reportAProblemForm.success', {message: 'great success!'});

        expect($form).toBeHidden();
        expect($('.report-a-problem-content').html()).toEqual('great success!');
      });
    });

    describe("if the request has failed", function() {
      it("should display an error message", function() {

        $form.trigger('reportAProblemForm.error');

        expect($form).not.toBeVisible();
        expect($('.report-a-problem-content').html()).toContain("Sorry, we’re unable to receive your message");
      });
    });
  }
});
