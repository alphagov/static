(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var ReportAProblemForm = function($form) {
    this.$form = $form;

    $form.on('submit', this.submit.bind(this));

    this.appendHiddenContextInformation();
  }

  ReportAProblemForm.prototype.appendHiddenContextInformation = function() {
    // form submission for reporting a problem
    this.$form.append('<input type="hidden" name="javascript_enabled" value="true"/>');
    this.$form.append($('<input type="hidden" name="referrer">').val(document.referrer || "unknown"));
  };

  ReportAProblemForm.prototype.hidePrompt = function() {
    this.$form.find('.error-notification').remove();
  };

  ReportAProblemForm.prototype.disableSubmitButton = function() {
    this.$form.find('.button').prop("disabled", true);
  };

  ReportAProblemForm.prototype.enableSubmitButton = function() {
    this.$form.find('.button').prop("disabled", false);
  };

  ReportAProblemForm.prototype.promptUserToEnterValidData = function() {
    this.enableSubmitButton();
    var $prompt = $('<p class="error-notification">Please enter details of what you were doing.</p>');
    this.$form.prepend($prompt);
  };

  ReportAProblemForm.prototype.handleError = function(jqXHR, status) {
    if (status === 'error' || !jqXHR.responseText) {
      if (jqXHR.status == 422) {
        this.promptUserToEnterValidData();
      } else {
        this.triggerError();
      }
    }
  };

  ReportAProblemForm.prototype.setUrl = function() {
    this.$form.find('input#url').val(window.location);
  }

  ReportAProblemForm.prototype.postFormViaAjax = function() {
    $.ajax({
      type: "POST",
      url: this.$form.attr('action'),
      dataType: "json",
      data: this.$form.serialize(),
      success: this.triggerSuccess.bind(this),
      error: this.handleError.bind(this),
      statusCode: {
        500: this.triggerError.bind(this)
      }
    });
  };

  ReportAProblemForm.prototype.submit = function(evt) {
    this.hidePrompt();
    this.setUrl();
    this.trackEvent('GOVUK Send Feedback');
    this.disableSubmitButton();
    this.postFormViaAjax();

    evt.preventDefault();
  };

  ReportAProblemForm.prototype.triggerError = function() {
    this.$form.trigger('reportAProblemForm.error');
  };

  ReportAProblemForm.prototype.triggerSuccess = function(data) {
    this.$form.trigger('reportAProblemForm.success', data);
  };

  ReportAProblemForm.prototype.trackEvent = function(action){
    if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
      GOVUK.analytics.trackEvent('Onsite Feedback', action, { label: '(not set)' });
    }
  };

  GOVUK.ReportAProblemForm = ReportAProblemForm;
}());
