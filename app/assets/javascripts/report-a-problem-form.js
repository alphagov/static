(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var ReportAProblemForm = function($form) {
    this.$form = $form;

    $form.on('submit', $.proxy(this.submit, this));

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
    this.$form.find('.button').attr("disabled", true);
  };

  ReportAProblemForm.prototype.enableSubmitButton = function() {
    this.$form.find('.button').attr("disabled", false);
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
      url: "/contact/govuk/problem_reports",
      dataType: "json",
      data: this.$form.serialize(),
      success: $.proxy(this.triggerSuccess, this),
      error: $.proxy(this.handleError, this),
      statusCode: {
        500: $.proxy(this.triggerError, this),
      }
    });
  };

  ReportAProblemForm.prototype.submit = function(evt) {
    this.hidePrompt();
    this.setUrl();
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

  GOVUK.ReportAProblemForm = ReportAProblemForm;
}());
