(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var ReportAProblem = function ($container) {
    var form = new GOVUK.ReportAProblemForm($container.find('form'));

    this.addToggleLink($container);
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
