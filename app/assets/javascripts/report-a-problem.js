(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var ReportAProblem = function ($container) {
    this.$container = $container;
    var $form = $container.find('form'),
        form = new GOVUK.ReportAProblemForm($form);

    this.addToggleLink();
    $form.on('reportAProblemForm.success', this.showConfirmation.bind(this));
    $form.on('reportAProblemForm.error', this.showError.bind(this));
  };

  ReportAProblem.prototype.addToggleLink = function() {
    var $toggle = $('\
      <div class="report-a-problem-toggle-wrapper js-footer">\
        <p class="report-a-problem-toggle">\
          <a href="">Is there anything wrong with this page?</a>\
        </p>\
      </div>');

    this.$container.before($toggle);
    $toggle.on("click", ".report-a-problem-toggle a", function(evt) {
      this.$container.toggle();
      evt.preventDefault();
    }.bind(this));
  };

  ReportAProblem.prototype.showConfirmation = function(evt, data) {
    this.$container.find('.report-a-problem-content').html(data.message);
  }

  ReportAProblem.prototype.showError = function() {
    var response = "\
      <h2>Sorry, we’re unable to receive your message right now.</h2>\
      <p>We have other ways for you to provide feedback on the \
      <a href='/contact'>contact page</a>.</p>";

    this.$container.find('.report-a-problem-content').html(response);
  }

  GOVUK.ReportAProblem = ReportAProblem;

  $(document).ready(function() {
    new GOVUK.ReportAProblem($('.report-a-problem-container'));
  });
}());
