describe("form submission for reporting a problem", function () {
  var FORM_TEXT = '<div class="report-a-problem-container">' +
                    '<div class="report-a-problem-content">' +
                      '<form><button class="button" name="button" type="submit">Send</button></form>' +
                    '</div>' +
                  '</div>';
  var form;

  beforeEach(function() {
    setFixtures(FORM_TEXT);
    form = $('form');
    new GOVUK.ReportAProblem($('.report-a-problem-container'));
  });

  describe("clicking on the toggle", function(){
    it("should toggle the visibility of the form", function() {
      expect(form).toBeVisible();

      $('a').click();

      expect(form).toBeHidden();

      $('a').click();

      expect(form).toBeVisible();
    });
  });

  describe("if the request succeeds", function() {
    it("should replace the form with the response from the AJAX call", function() {

      form.trigger('reportAProblemForm.success', {message: 'great success!'});

      expect(form).toBeHidden();
      expect($('.report-a-problem-content').html()).toEqual('great success!');
    });
  });

  describe("if the request has failed", function() {
    it("should display an error message", function() {

      form.trigger('reportAProblemForm.error');

      expect(form).not.toBeVisible();
      expect($('.report-a-problem-content').html()).toContain("Sorry, we’re unable to receive your message");
    });
  });
});
