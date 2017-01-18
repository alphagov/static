require 'govuk_component_test_helper'

class AccordionWithDescriptionsTestCase < ComponentTestCase
  def component_name
    "accordion_with_descriptions"
  end

  test "no error if no parameters passed in" do
    assert_nothing_raised do
      render_component({})
      assert_select ".govuk-accordion-with-descriptions"
    end
  end
end
