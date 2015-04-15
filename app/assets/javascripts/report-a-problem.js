(function() {
  "use strict";

  window.GOVUK = window.GOVUK || {};

  window.GOVUK.reportAProblem = {
    showErrorMessage: function (jqXHR) {
      var response = "<h2>Sorry, we're unable to receive your message right now.</h2> " +
                     "<p>We have other ways for you to provide feedback on the " +
                     "<a href='/contact'>contact page</a>.</p>"
      $('.report-a-problem-content').html(response);
    },

    promptUserToEnterValidData: function() {
      GOVUK.reportAProblem.enableSubmitButton();
      $('<p class="error-notification">Please enter details of what you were doing.</p>').insertAfter('.report-a-problem-container h2');
    },

    disableSubmitButton: function() {
      $('.report-a-problem-container .button').attr("disabled", true);
    },

    enableSubmitButton: function() {
      $('.report-a-problem-container .button').attr("disabled", false);
    },

    showConfirmation: function(data) {
      $('.report-a-problem-content').html(data.message);
    },

    submit: function() {
      $('.report-a-problem-container .error-notification').remove();
      $('input#url').val(window.location);

      GOVUK.reportAProblem.disableSubmitButton();
      $.ajax({
        type: "POST",
        url: "/contact/govuk/problem_reports",
        dataType: "json",
        data: $('.report-a-problem-container form').serialize(),
        success: GOVUK.reportAProblem.showConfirmation,
        error: function(jqXHR, status) {
          if (status === 'error' || !jqXHR.responseText) {
            if (jqXHR.status == 422) {
              GOVUK.reportAProblem.promptUserToEnterValidData();
            }
            else {
              GOVUK.reportAProblem.showErrorMessage();
            }
          }
        },
        statusCode: {
          500: GOVUK.reportAProblem.showErrorMessage
        }
      });
      return false;
    }
  }

  $(document).ready(function() {
    // Add in the toggle link for reporting a problem at the bottom of the page
    var toggleBlock = '<div class="report-a-problem-toggle-wrapper js-footer">' +
                        '<p class="report-a-problem-toggle">' +
                          '<a href="">Is there anything wrong with this page?</a>' +
                        '</p>' +
                      '</div>';
    var $container = $('.report-a-problem-container')
    $container.before(toggleBlock);

    // Add a click handler for the toggle
    $('.report-a-problem-toggle a').on('click', function() {
      $container.toggle();
      return false;
    });

    // form submission for reporting a problem
    var $form = $container.find('form');
    $form.append('<input type="hidden" name="javascript_enabled" value="true"/>');
    $form.append($('<input type="hidden" name="referrer">').val(document.referrer || "unknown"));
    $form.submit(GOVUK.reportAProblem.submit);

  });

}());
