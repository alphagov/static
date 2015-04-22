(function() {
  "use strict";

  window.GOVUK = window.GOVUK || {};

  var ReportAProblemForm = function($form) {
    this.$form = $form;

    this.appendHiddenContextInformation();
    this.configureSubmission();
  }

  ReportAProblemForm.prototype.appendHiddenContextInformation = function() {
    // form submission for reporting a problem
    this.$form.append('<input type="hidden" name="javascript_enabled" value="true"/>');
    this.$form.append($('<input type="hidden" name="referrer">').val(document.referrer || "unknown"));
  };

  ReportAProblemForm.prototype.configureSubmission = function() {
    this.$form.submit($.proxy(this.submit, this));
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
      }
      else {
        GOVUK.reportAProblem.showErrorMessage();
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
      success: $.proxy(this.showConfirmation, this),
      error: $.proxy(this.handleError, this),
      statusCode: {
        500: $.proxy(this.showErrorMessage, this),
      }
    });
  };

  ReportAProblemForm.prototype.submit = function() {
    this.hidePrompt();
    this.setUrl();
    this.disableSubmitButton();
    this.postFormViaAjax();

    return false;
  };

  ReportAProblemForm.prototype.showConfirmation = function(data) {
    $('.report-a-problem-content').html(data.message);
  };

  ReportAProblemForm.prototype.showErrorMessage = function(jqXHR) {
    var response = "<h2>Sorry, we're unable to receive your message right now.</h2> " +
                   "<p>We have other ways for you to provide feedback on the " +
                   "<a href='/contact'>contact page</a>.</p>";

    $('.report-a-problem-content').html(response);
  };

  GOVUK.ReportAProblemForm = ReportAProblemForm;

  var ReportAProblem = function ($container) {
    this.$container = $container;

    this.form = new GOVUK.ReportAProblemForm($container.find('form'));

    this.addToggleLink();
  };

  ReportAProblem.prototype.addToggleLink = function() {
    var $toggleBlock = $('<div class="report-a-problem-toggle-wrapper js-footer">' +
                           '<p class="report-a-problem-toggle">' +
                             '<a href="">Is there anything wrong with this page?</a>' +
                           '</p>' +
                         '</div>');
    this.$container.before($toggleBlock);

    var $container = this.$container;
    $toggleBlock.on("click", '.report-a-problem-toggle a', function(evt) {
      $container.toggle();
      evt.preventDefault();
    });
  };

  GOVUK.ReportAProblem = ReportAProblem;

  $(document).ready(function() {
    new GOVUK.ReportAProblem($('.report-a-problem-container'));
  });
}());
