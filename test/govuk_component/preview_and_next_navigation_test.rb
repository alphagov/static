require 'govuk_component_test_helper'

class PreviousAndNextNavigationTestCase < ComponentTestCase
  def component_name
    "previous_and_next_navigation"
  end

  test "nothing renders if no parameters" do
    assert_empty render_component({})
  end

  test "previous pagination appears" do
    render_component(previous_page: {
      url: "previous-page",
      title: "Previous page",
      label: "1 of 3"
    })

    assert_select ".pagination-part-title", text: "Previous page"
    assert_select ".pagination-label", text: "1 of 3"
    assert_link("previous-page")
  end

  test "next pagination appears" do
    render_component(next_page: {
      url: "next-page",
      title: "Next page",
      label: "2 of 3"
    })

    assert_select ".pagination-part-title", text: "Next page"
    assert_select ".pagination-label", text: "2 of 3"
    assert_link("next-page")
  end
end
