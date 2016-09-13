(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var ReportAProblem = function ($container) {
    this.$container = $container;
    var $form = $container.find('form');
    new GOVUK.ReportAProblemForm($form);

    $form.on("reportAProblemForm.success", this.showConfirmation.bind(this));
    $form.on("reportAProblemForm.error", this.showError.bind(this));
    $container.parent().on("click", ".js-report-a-problem-toggle", this.toggleForm.bind(this));

    this.addToggleLink();
  };

  ReportAProblem.prototype.addToggleLink = function() {
    this.$container.before('<div class="report-a-problem-toggle-wrapper js-footer">' +
        '<p class="report-a-problem-toggle">' +
          '<a href="" class="js-report-a-problem-toggle">Is there anything wrong with this page?</a>' +
        '</p>' +
      '</div>');
  };

  ReportAProblem.prototype.toggleForm = function(evt) {
    this.$container.toggle();

    if (this.$container.is(':visible')) {
      this.trackEvent('GOVUK Open Form');
    } else {
      this.trackEvent('GOVUK Close Form');
    }

    if ($(evt.target).is('a')) {
      evt.preventDefault();
    }
  };

  ReportAProblem.prototype.showConfirmation = function(evt, data) {
    this.$container.find('.report-a-problem-content').html(data.message);
  };

  ReportAProblem.prototype.showError = function() {
    var response = '<h2>Sorry, we’re unable to receive your message right now.</h2>' +
      '<p>We have other ways for you to provide feedback on the ' +
      '<a href="/contact">contact page</a>.</p>';

    this.$container.find('.report-a-problem-content').html(response);
  };

  ReportAProblem.prototype.trackEvent = function(action){
    if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
      GOVUK.analytics.trackEvent('Onsite Feedback', action, { label: '(not set)'} );
    }
  };

  GOVUK.ReportAProblem = ReportAProblem;

  $(document).ready(function() {
    new GOVUK.ReportAProblem($('.report-a-problem-container'));
  });
}());
