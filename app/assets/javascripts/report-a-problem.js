(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var ReportAProblem = function ($container) {
    var $form = $container.find('form'),
        form = new GOVUK.ReportAProblemForm($form);

    this.addToggleLink($container);
    $form.on('reportAProblemForm.success', showConfirmation);
    $form.on('reportAProblemForm.error', showError);

    function showConfirmation(evt, data) {
      $container.find('.report-a-problem-content').html(data.message);
    }

    function showError() {
      var response = "\
        <h2>Sorry, we’re unable to receive your message right now.</h2>\
        <p>We have other ways for you to provide feedback on the \
        <a href='/contact'>contact page</a>.</p>";

      $container.find('.report-a-problem-content').html(response);
    }
  };

  ReportAProblem.prototype.addToggleLink = function($container) {
    var $toggle = $('\
      <div class="report-a-problem-toggle-wrapper js-footer">\
        <p class="report-a-problem-toggle">\
          <a href="">Is there anything wrong with this page?</a>\
        </p>\
      </div>');

    $container.before($toggle);
    $toggle.on("click", ".report-a-problem-toggle a", function(evt) {
      $container.toggle();
      evt.preventDefault();
    });
  };

  GOVUK.ReportAProblem = ReportAProblem;

  $(document).ready(function() {
    new GOVUK.ReportAProblem($('.report-a-problem-container'));
  });
}());
