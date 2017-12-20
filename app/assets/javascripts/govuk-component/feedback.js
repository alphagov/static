(function (Modules) {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  function ImproveThisPage () {
    this.controller = null;
    this.view = null;

    this.start = function ($element) {
      this.view = new View($element);
      this.controller = new Controller(this.view);

      this.controller.init();
    }
  };

  function View ($element) {
    var that = this;

    this.$pageIsUsefulButton = $element.find('.js-page-is-useful');
    this.$pageIsNotUsefulButton = $element.find('.js-page-is-not-useful');
    this.$somethingIsWrongButton = $element.find('.js-something-is-wrong');
    this.$feedbackFormContainer = $element.find('.js-feedback-form');
    this.$feedbackForm = that.$feedbackFormContainer.find('form');
    this.$feedbackFormSubmitButton = that.$feedbackFormContainer.find('[type=submit]');
    this.$feedbackFormCloseButton = that.$feedbackFormContainer.find('.js-close-feedback-form');
    this.$prompt = $element.find('.js-prompt');

    this.onPageIsUsefulButtonClicked = function (callback) {
      that.$pageIsUsefulButton.on('click', preventingDefault(callback));
    }

    this.onPageIsNotUsefulButtonClicked = function (callback) {
      that.$pageIsNotUsefulButton.on('click', preventingDefault(callback));
    }

    this.onSomethingIsWrongButtonClicked = function (callback) {
      that.$somethingIsWrongButton.on('click', preventingDefault(callback));
    }

    this.onFeedbackFormCloseButtonClicked = function (callback) {
      that.$feedbackFormCloseButton.on('click', preventingDefault(callback));
    }

    this.onSubmitFeedbackForm = function (callback) {
      that.$feedbackForm.on('submit', preventingDefault(callback));
    }

    this.showSuccess = function () {
      that.$prompt.html('<span id="feedback-success-message">Thanks for your feedback.</span>');

      if (that.$prompt.hasClass('js-hidden')) {
        that.toggleFeedbackForm();
      }

      that.$prompt.attr('aria-labelledby', 'feedback-success-message');
      that.$prompt.focus();
    }

    this.toggleFeedbackForm = function () {
      that.$prompt.toggleClass('js-hidden');
      that.$feedbackFormContainer.toggleClass('js-hidden');

      var formIsVisible = !that.$feedbackFormContainer.hasClass('js-hidden');

      that.updateAriaAttributes(formIsVisible)

      if (formIsVisible) {
        $('.form-control', that.$feedbackFormContainer).first().focus();
      }
    }

    this.updateAriaAttributes = function (formIsVisible) {
      that.$feedbackFormContainer.attr('aria-hidden', !formIsVisible);
      $('[aria-controls=improveThisPageForm]').attr('aria-expanded', formIsVisible);
    }

    this.feedbackFormContainerData = function () {
      return that.$feedbackFormContainer.find('input, textarea').serialize();
    }

    this.feedbackFormContainerTrackEventParams = function () {
      return that.getTrackEventParams(that.$feedbackFormContainer);
    }

    this.pageIsUsefulTrackEventParams = function () {
      return that.getTrackEventParams(that.$pageIsUsefulButton);
    }

    this.pageIsNotUsefulTrackEventParams = function () {
      return that.getTrackEventParams(that.$pageIsNotUsefulButton);
    }

    this.somethingIsWrongTrackEventParams = function () {
      return that.getTrackEventParams(that.$somethingIsWrongButton);
    }

    this.getTrackEventParams = function ($node) {
      return {
        category: $node.data('track-category'),
        action: $node.data('track-action')
      }
    }

    this.renderErrors = function (errors) {
      this.clearErrors();
      var genericErrors = [];

      $.each(errors, function (attrib, messages) {
        $.each(messages, function (index, message) {
          // Uppercase first character of field name
          var fieldDescription = attrib.charAt(0).toUpperCase() + attrib.slice(1);
          var errorMessage = fieldDescription + ' ' + message + '.';

          // If there is a field with the same name as the error attribute
          // then display the error inline with the field.
          if (that.addErrorToField(attrib, errorMessage)) {
            return;
          }

          // If a matching field doesn't exist then display it above the form.
          genericErrors.push(errorMessage);
        });
      });

      if (genericErrors.length) {
        that.addGenericError(
          '<h1 class="heading-medium error-summary-heading" id="generic-error-message">' +
            'There is a problem' +
          '</h1>' +
          $('<p>').text(genericErrors.join(' ')).html()
        );
      }

      that.focusFirstError();
    }

    this.clearErrors = function () {
      // Reset form groups
      $('.form-group', that.$feedbackFormContainer).removeClass('error');

      // Remove error messages and summaries
      $('.error-message, .error-summary', that.$feedbackFormContainer).remove();

      // Reset aria-describedby associations
      $('[name]', that.$feedbackFormContainer).attr({
        'aria-describedby': '',
        'aria-invalid': ''
      });
    }

    this.focusFirstError = function() {
      $('.error-summary, .form-group.error .form-control', that.$feedbackFormContainer)
        .first()
        .focus();
    }

    this.addErrorToField = function (field, error) {
      var $field = that.$feedbackFormContainer.find('[name="'+ field + '"]');
      var $group = $field.parents('.form-group');

      if (!$field.length || !$group.length) {
        return false;
      }

      var id = that.generateIdFromError(error)

      $group.addClass('error');
      $('label', $group).append(
        $('<span />', {
          'class': 'error-message',
          'text': error,
          'id': id
        })
      );
      $field.attr({
        'aria-describedby': id,
        'aria-invalid': 'true'
      });

      return true;
    }

    this.addGenericError = function (errorMessage) {
      var $errorNode = $('<div/>', {
        'class': 'error-summary',
        'role': 'group',
        'aria-labelledby': 'generic-error-message',
        'html': errorMessage,
        'tabindex': -1
      });

      $('.js-errors', that.$feedbackFormContainer).html($errorNode);
    }

    this.generateIdFromError = function (text) {
      return 'error-' + text.toString().toLowerCase().trim()
        .replace(/&/g, '-and-')    // Replace & with 'and'
        .replace(/[\s\W-]+/g, '-') // Replace spaces, non-word characters and
                                   // dashes with a single dash (-)
    }

    this.disableSubmitFeedbackButton = function () {
      that.$feedbackFormSubmitButton.prop('disabled', true);
    }

    this.enableSubmitFeedbackButton = function () {
      that.$feedbackFormSubmitButton.removeAttr('disabled');
    }

    function preventingDefault(callback) {
      return function (event) {
        event.preventDefault();
        callback();
      }
    }
  };

  function Controller (view) {
    var that = this;

    this.init = function () {
      that.bindPageIsUsefulButton();
      that.bindPageIsNotUsefulButton();
      that.bindSomethingIsWrongButton();
      that.bindSubmitFeedbackButton();
      this.bindCloseFeedbackFormButton();

      // Add initial ARIA attributes
      view.updateAriaAttributes(false);
    }

    this.bindPageIsUsefulButton = function () {
      var handler = function () {
        that.trackEvent(view.pageIsUsefulTrackEventParams());

        view.showSuccess();
      }

      view.onPageIsUsefulButtonClicked(handler);
    }

    this.bindPageIsNotUsefulButton = function () {
      var handler = function () {
        that.trackEvent(view.pageIsNotUsefulTrackEventParams());

        view.toggleFeedbackForm();
      }

      view.onPageIsNotUsefulButtonClicked(handler);
    }

    this.bindSomethingIsWrongButton = function () {
      var handler = function () {
        that.trackEvent(view.somethingIsWrongTrackEventParams());

        view.toggleFeedbackForm();
      }

      view.onSomethingIsWrongButtonClicked(handler);
    }

    this.bindCloseFeedbackFormButton = function () {
      var handler = function () {
        view.toggleFeedbackForm();
      }

      view.onFeedbackFormCloseButtonClicked(handler);
    }

    this.bindSubmitFeedbackButton = function () {
      view.onSubmitFeedbackForm(that.handleSubmitFeedback);
    }

    this.handleSubmitFeedback = function () {
      $.ajax({
        type: "POST",
        url: "/contact/govuk/page_improvements",
        data: view.feedbackFormContainerData(),
        beforeSend: view.disableSubmitFeedbackButton
      }).done(function () {
        that.trackEvent(view.feedbackFormContainerTrackEventParams());

        view.showSuccess();
      }).fail(function (xhr) {
        view.enableSubmitFeedbackButton();
        if (xhr.status == 422) {
          view.renderErrors(xhr.responseJSON.errors);
        } else {
          view.clearErrors();
          view.addGenericError(
            [
              '<h1 class="heading-medium error-summary-heading" id="generic-error-message">',
              '  Sorry, we’re unable to receive your message right now. ',
              '</h1>',
              '<p>If the problem persists, we have other ways for you to provide',
              ' feedback on the <a href="/contact/govuk">contact page</a>.</p>'
            ].join('')
          );
          view.focusFirstError();
        }
      });
    }

    this.trackEvent = function(trackEventParams) {
      if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
        GOVUK.analytics.trackEvent(trackEventParams.category, trackEventParams.action);
      }
    }
  };

  Modules.ImproveThisPage = ImproveThisPage;
})(window.GOVUK.Modules);
