require 'govuk_component_test_helper'

class FeedbackTestCase < ComponentTestCase
  def component_name
    "feedback"
  end

  test "asks the user if the page is useful without javascript enabled" do
    render_component({})

    assert_select ".pub-c-feedback .pub-c-feedback__prompt-link--useful[href='/contact/govuk']", text: 'Yes this page is useful'
    assert_select ".pub-c-feedback .pub-c-feedback__prompt-link.js-page-is-not-useful[href='/contact/govuk']", text: 'No this page is not useful'
  end

  test "asks the user if there is anything wrong with the page without javascript enabled" do
    render_component({})

    assert_select ".pub-c-feedback .pub-c-feedback__prompt-link--wrong[href='/contact/govuk']", text: 'Is there anything wrong with this page?'
  end
end
