require 'govuk_component_test_helper'

class AlphaLabelTestCase < ComponentTestCase
  def component_name
    "alpha_label"
  end

  test "no error if no message" do
    assert_nothing_raised do
      render_component({})
      assert_select ".govuk-alpha-label"
    end
  end

  test "custom message appears" do
    render_component(message: "custom message")
    assert_select ".govuk-alpha-label span", text: "custom message"
  end

  test "custom message HTML works" do
    render_component(message: "custom <strong>message</strong>")
    assert_select ".govuk-alpha-label strong", text: "message"
  end
end
