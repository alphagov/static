require 'govuk_component_test_helper'

class AnalyticsMetaTagsNavigationTestCase < ComponentTestCase
  def component_name
    "analytics_meta_tags_navigation"
  end

  test "no error if no parameters passed in" do
    assert_nothing_raised do
      render_component({})
    end
  end
end
