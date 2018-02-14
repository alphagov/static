(function (Modules) {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  Modules.Feedback = function () {

    this.start = function ($element) {
      this.$prompt = $element.find('.js-prompt');
      this.$fields = $element.find('.pub-c-feedback__form-field');
      this.$forms = $element.find('.js-feedback-form');
      this.$toggleForms = $element.find('.js-toggle-form');
      this.$closeForms = $element.find('.js-close-form');
      this.$activeForm = false;
      this.$pageIsUsefulButton = $element.find('.js-page-is-useful');
      this.$pageIsNotUsefulButton = $element.find('.js-page-is-not-useful');
      this.$somethingIsWrongButton = $element.find('.js-something-is-wrong');
      this.$promptQuestions = $element.find('.js-prompt-questions');
      this.$promptSuccessMessage = $element.find('.js-prompt-success');

      var that = this;

      setInitialAriaAttributes();

      this.$toggleForms.on('click', function(e) {
        e.preventDefault();
        toggleForm($(e.target).attr('aria-controls'));
        trackEvent(getTrackEventParams($(this)));
        updateAriaAttributes($(this));
      });

      this.$closeForms.on('click', function(e) {
        e.preventDefault();
        toggleForm($(e.target).attr('aria-controls'));
        setInitialAriaAttributes();
      });

      this.$pageIsUsefulButton.on('click', function(e) {
        e.preventDefault();
        trackEvent(getTrackEventParams(that.$pageIsUsefulButton));
        showFormSuccess();
        revealInitialPrompt();
      });

      $element.find('form').on('submit', function(e) {
        e.preventDefault();
        var $form = $(this);
        $.ajax({
          type: "POST",
          url: $form.attr('action'),
          dataType: "json",
          data: $form.serialize(),
          beforeSend: disableSubmitFormButton($form)
        }).done(function (xhr) {
          trackEvent(getTrackEventParams($form));
          showFormSuccess(xhr.message);
          revealInitialPrompt();
          setInitialAriaAttributes();
          that.$activeForm.toggleClass('js-hidden');
        }).fail(function (xhr) {
          showError(xhr);
          enableSubmitFormButton($form);
        });
      });

      function disableSubmitFormButton ($form) {
        $form.find('input[type="submit"]').prop('disabled', true);
      }

      function enableSubmitFormButton ($form) {
        $form.find('input[type="submit"]').removeAttr('disabled');
      }

      function setInitialAriaAttributes () {
        that.$forms.attr('aria-hidden', true);
        that.$pageIsNotUsefulButton.attr('aria-expanded', false);
        that.$somethingIsWrongButton.attr('aria-expanded', false);
      }

      function updateAriaAttributes (linkClicked) {
        linkClicked.attr('aria-expanded', true);
        $('#' + linkClicked.attr('aria-controls')).attr('aria-hidden', false);
      }

      function toggleForm (formId) {
        that.$activeForm = $element.find('#' + formId);
        that.$activeForm.toggleClass('js-hidden');
        that.$prompt.toggleClass('js-hidden');

        var formIsVisible = !that.$activeForm.hasClass('js-hidden');

        if (formIsVisible) {
          that.$activeForm.find('.pub-c-feedback__form-field').first().focus();
        } else {
          that.$activeForm = false;
        }
      }

      function getTrackEventParams ($node) {
        return {
          category: $node.data('track-category'),
          action: $node.data('track-action')
        }
      }

      function trackEvent (trackEventParams) {
        if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
          GOVUK.analytics.trackEvent(trackEventParams.category, trackEventParams.action);
        }
      }

      function clearMessages () {
        $element.find('.js-errors').html('').addClass('js-hidden');
      }

      function showError (error) {
        var error = [
          '<h2 class="pub-c-feedback__heading">',
          '  Sorry, we’re unable to receive your message right now. ',
          '</h1>',
          '<p>If the problem persists, we have other ways for you to provide',
          ' feedback on the <a href="/contact/govuk">contact page</a>.</p>'
        ].join('');

        if (typeof(error.responseJSON) !== 'undefined') {
          error = typeof(error.responseJSON.message) == 'undefined' ? error : error.responseJSON.message;
        }
        var $errors = that.$activeForm.find('.js-errors');
        $errors.html(error).removeClass('js-hidden').focus();
      }

      function clearAllInputs () {
        that.$fields.val('');
      }

      function showFormSuccess () {
        that.$promptQuestions.addClass('js-hidden');
        that.$promptSuccessMessage.removeClass('js-hidden').focus();
      }

      function revealInitialPrompt () {
        that.$prompt.removeClass('js-hidden');
        that.$prompt.focus();
      }
    }

  };
})(window.GOVUK.Modules);
