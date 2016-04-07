require 'govuk_component_test_helper'

class DescriptionTestCase < ComponentTestCase
  def component_name
    "description"
  end

  test "no error if no parameters passed in" do
    assert_nothing_raised do
      render_component({})
      assert_select ".govuk-description"
    end
  end
end
