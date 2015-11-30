require 'govuk_component_test_helper'

class BetaLabelTestCase < ComponentTestCase
  def component_name
    "beta_label"
  end

  test "no error if no message" do
    assert_nothing_raised do
      render_component({})
      assert_select ".govuk-beta-label"
    end
  end

  test "custom message appears" do
    render_component(message: "custom message")
    assert_select ".govuk-beta-label span", text: "custom message"
  end

  test "custom message HTML works" do
    render_component(message: "custom <strong>message</strong>")
    assert_select ".govuk-beta-label strong", text: "message"
  end
end
