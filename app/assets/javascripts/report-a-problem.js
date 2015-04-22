(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var ReportAProblem = function ($container) {
    this.$container = $container;
    this.form = new GOVUK.ReportAProblemForm($container.find('form'));
    this.addToggleLink();
  };

  ReportAProblem.prototype.addToggleLink = function() {
    var $container = this.$container,
        $toggle = $('\
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
