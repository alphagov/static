require 'govuk_component_test_helper'

class DescriptionTestCase < ComponentTestCase
  def component_name
    "description"
  end

  test "renders a description" do
    render_component(description: 'description')
    assert_select ".govuk-description", text: 'description'
  end

  test "renders html in a description" do
    render_component(description: 'description <a href="http://www.gov.uk">link</a>')
    assert_select ".govuk-description a", text: 'link'
  end

  test "renders right to left content correctly" do
    render_component(
      direction: "rtl",
      description: "right to left")

    assert_select ".direction-rtl", text: 'right to left'
  end
end
