(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var ReportAProblem = function ($container) {
    this.$container = $container;
    var $form = $container.find('form'),
        form = new GOVUK.ReportAProblemForm($form),
        renderOriginal = this.renderOriginal.bind(this),
        renderVariant = this.renderVariant.bind(this);

    $form.on('reportAProblemForm.success', this.showConfirmation.bind(this));
    $form.on('reportAProblemForm.error', this.showError.bind(this));

    if (ReportAProblem.isBeingTestedOnThisPage()) {
      this.multivariateTest = new GOVUK.MultivariateTest({
        name: 'report-a-problem-redesign-ab-test',
        contentExperimentId: "bTKGjWu5TDezXmfOa9F2lw",
        cohorts: {
          variant_0: {variantId: 0, callback: renderOriginal},
          variant_1: {variantId: 1, callback: renderVariant}
        }
      });

      $form.on("reportAProblemForm.success", this.trackSuccessfulFeedback.bind(this));
    } else {
      renderOriginal();
    }

  };

  ReportAProblem.isBeingTestedOnThisPage = function() {
    var slugsBeingTested = [
          '/bank-holidays',
          '/vehicle-tax-rate-tables',
          '/contact-the-dvla',
          '/check-uk-visa',
          '/life-in-the-uk-test',
          '/government/publications/application-to-transfer-or-retain-a-vehicle-registration-number',
          '/government/publications/income-tax-tax-relief-for-expenses-of-employment-p87',
          '/calculate-state-pension',
          '/calculate-your-holiday-entitlement',
          '/am-i-getting-minimum-wage'
        ],
        slug = ReportAProblem.getCurrentSlug();

    for (var i = 0, l = slugsBeingTested.length; i < l; i++) {
      // starts with
      if (slug.indexOf(slugsBeingTested[i]) === 0) {
        return true;
      }
    }

    return false;
  };

  ReportAProblem.getCurrentSlug = function() {
    // no parameters or fragments
    return window.location.pathname;
  };

  ReportAProblem.prototype.renderOriginal = function() {
    this.addToggleLink();
    this.$toggle.on("click", ".js-report-a-problem-toggle", this.toggleForm.bind(this));
  };

  ReportAProblem.prototype.addToggleLink = function() {
    this.$toggle = $('\
      <div class="report-a-problem-toggle-wrapper js-footer">\
        <p class="report-a-problem-toggle">\
          <a href="" class="js-report-a-problem-toggle">Is there anything wrong with this page?</a>\
        </p>\
      </div>');

    this.$container.before(this.$toggle);
  };

  ReportAProblem.prototype.renderVariant = function() {
    this.removeOriginalFormParts();
    this.addVariantFormParts();
    this.addYesNoLinks();

    this.$toggle.on("click", ".js-report-a-problem-toggle", this.showFormAndHideOption.bind(this));
    this.$toggle.on("click", ".js-report-a-problem-toggle", this.trackIfPageIsUseful.bind(this));
  };

  ReportAProblem.prototype.addYesNoLinks = function() {
    this.$toggle = $('\
      <div class="report-a-problem-toggle-wrapper was-this-useful js-footer">\
        <div class="report-a-problem-toggle">\
          <p>\
            Was this page useful?\
            <a href="#" data-useful="Yes" class="js-report-a-problem-toggle">Yes</a>\
            <a href="#" data-useful="No" class="js-report-a-problem-toggle">No</a>\
          <p>\
        </div>\
      </div>');

    this.$container.before(this.$toggle);
  };

  ReportAProblem.prototype.removeOriginalFormParts = function() {
    this.$container.find('.js-original-variant').remove();
  };

  ReportAProblem.prototype.addVariantFormParts = function() {
    this.$container.find('form').prepend('\
      <h2>Thanks. Your feedback has been recorded.</h2>\
      <input type="hidden" name="what_doing" value="" />\
      <label for="how-could-we-improve">How could we improve this page?</label>\
      <textarea id="how-could-we-improve" name="what_wrong"></textarea>\
      <p>This is anonymous feedback. Don’t include personal or financial information.</p>\
      <p>We can’t reply to this form. If you want a reply, use the <a href="/contact">contact form</a> to send your questions or comments about the website.</p>\
    ');
  };

  ReportAProblem.prototype.trackIfPageIsUseful = function(evt) {
    var wasUseful = $(evt.target).data('useful');

    this.$container.find('[name="what_doing"]').val('Was this page useful? ' + wasUseful)

    if (ReportAProblem.isBeingTestedOnThisPage() && typeof GOVUK.analytics === "object") {
      GOVUK.analytics.trackEvent('ab-test-report-a-problem', 'was-page-useful', {label: wasUseful.toLowerCase()});
    }
  };

  ReportAProblem.prototype.trackSuccessfulFeedback = function(evt) {
    var variant = this.multivariateTest.getCohort();
    if (typeof GOVUK.analytics === "object") {
      GOVUK.analytics.trackEvent('ab-test-report-a-problem', 'feedback-submitted', {label: variant});
    }
  };

  ReportAProblem.prototype.toggleForm = function(evt) {
    this.$container.toggle();

    if (ReportAProblem.isBeingTestedOnThisPage() && typeof GOVUK.analytics === "object") {
      GOVUK.analytics.trackEvent('ab-test-report-a-problem', 'link-toggled');
    }

    if ($(evt.target).is('a')) {
      evt.preventDefault();
    }
  };

  ReportAProblem.prototype.showFormAndHideOption = function(evt) {
    this.$container.show();
    this.$toggle.hide();
    evt.preventDefault();
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
