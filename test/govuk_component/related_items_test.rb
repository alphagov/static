require 'govuk_component_test_helper'

class RelatedItemsTestCase < ComponentTestCase
  def component_name
    "related_items"
  end

  test "no error if no parameters passed in" do
    assert_nothing_raised do
      render_component({})
      assert_select ".govuk-related-items"
    end
  end
end
