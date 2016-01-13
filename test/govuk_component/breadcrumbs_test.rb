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

  test "renders a single breadcrumb" do
    render_component({ breadcrumbs: [{title: 'Section', url: '/section'}] })

    assert_link_with_text_in('ol li:first-child', '/', 'Home')
    assert_link_with_text_in('ol li:last-child', '/section', 'Section')
  end

  test "renders a list of breadcrumbs" do
    render_component({
      breadcrumbs: [
        {title: 'Section', url: '/section'},
        {title: 'Sub-section', url: '/sub-section'},
      ]
    })

    assert_link_with_text_in('ol li:first-child', '/', 'Home')
    assert_link_with_text_in('ol li:first-child + li', '/section', 'Section')
    assert_link_with_text_in('ol li:last-child', '/sub-section', 'Sub-section')
  end
end
