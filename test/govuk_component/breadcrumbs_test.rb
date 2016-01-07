require 'govuk_component_test_helper'

class BreadcrumbsTestCase < ComponentTestCase
  def component_name
    "breadcrumbs"
  end

  test "no error if no parameters passed in" do
    assert_nothing_raised do
      render_component({})
      assert_select ".govuk-breadcrumbs"
    end
  end
end
