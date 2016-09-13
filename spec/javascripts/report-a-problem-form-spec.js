describe("form submission for reporting a problem", function () {
  var FORM_TEXT = '<form action="ajax-endpoint"><button class="button" name="button" type="submit">Send</button></form>';
  var $form, reportAProblemForm;

  beforeEach(function() {
    setFixtures(FORM_TEXT);
    $form = $('form');
    reportAProblemForm = new GOVUK.ReportAProblemForm($form);
  });

  it("should append a hidden 'javascript_enabled' field to the form", function() {
    expect($form.find("[name=javascript_enabled]").val()).toBe("true");
  });

  it("should append a hidden 'referrer' field to the form", function() {
    expect($form.find("[name=referrer]").val()).toBe("unknown");
  });

  describe("while the request is being handled", function() {
    it("should disable the submit button to prevent multiple problem reports", function () {
      spyOn($, "ajax").and.callFake(function(options) {});

      $form.triggerHandler('submit');

      expect($('.button')).toBeDisabled();
    });
  });

  describe("when the form is submitted", function() {
    it("should submit using ajax to the action specified by the form", function() {
      var args;
      spyOn($, "ajax");
      $form.triggerHandler('submit');

      expect($.ajax).toHaveBeenCalled();
      args = $.ajax.calls.mostRecent().args;
      expect(args[0].url).toBe('ajax-endpoint');
    });

    it("should track the event", function() {
      spyOn(GOVUK.analytics, "trackEvent");
      $form.triggerHandler('submit');

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
        'Onsite Feedback', 'GOVUK Send Feedback', jasmine.any(Object)
      );
    });
  });

  describe("if the request succeeds", function() {
    it("should trigger a success event", function() {
      spyOn($form, "trigger");
      spyOn($, "ajax").and.callFake(function(options) {
        options.success({message: 'great success!'});
      });

      $form.triggerHandler('submit');
      expect($form.trigger).toHaveBeenCalledWith("reportAProblemForm.success", {message: 'great success!'});
    });
  });

  describe("if the request is invalid", function() {
    it("should re-enable the submit button, in order to allow the user to resubmit", function () {
      spyOn($, "ajax").and.callFake(function(options) {
        options.error({status: 422}, 'error');
      });

      $form.triggerHandler('submit');

      expect($form).toBeVisible();
      expect($('.button')).not.toBeDisabled();
    });
  });

  describe("if the request has failed with a status 500", function() {
    it("sshould trigger an error event", function() {
      spyOn($form, "trigger");
      spyOn($, "ajax").and.callFake(function(options) {
        options.statusCode[500]({responseText: 'this might not even be JSON because nginx intercepts the error'});
      });

      $form.triggerHandler('submit');

      expect($form.trigger).toHaveBeenCalledWith("reportAProblemForm.error");
    });
  });
});
