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

    assert_link_with_text_in('ol li:first-child', '/section', 'Section')
  end

  test "renders all data attributes for tracking" do
    render_component(breadcrumbs: [{ title: 'Section', url: '/section' }])

    assert_select 'ol li:first-child a[data-track-action="1"]', 1
    assert_select 'ol li:first-child a[data-track-label="/section"]', 1
    assert_select 'ol li:first-child a[data-track-dimension="Section"]', 1
    assert_select 'ol li:first-child a[data-track-category="breadcrumbClicked"]', 1
    assert_select 'ol li:first-child a[data-track-custom-dimension="29"]', 1
    assert_select 'ol li:first-child a[data-module="track-click"]', 1
  end

  test "renders a list of breadcrumbs" do
    render_component({
      breadcrumbs: [
        {title: 'Home', url: '/'},
        {title: 'Section', url: '/section'},
        {title: 'Sub-section', url: '/sub-section'},
      ]
    })

    assert_link_with_text_in('ol li:first-child', '/', 'Home')
    assert_link_with_text_in('ol li:first-child + li', '/section', 'Section')
    assert_link_with_text_in('ol li:last-child', '/sub-section', 'Sub-section')
  end

  test "allows the last breadcrumb to be text only" do
    render_component(
      breadcrumbs: [
        {title: 'Topic', url: '/topic'},
        {title: 'Current Page'},
      ]
    )
    assert_select('ol li:last-child', 'Current Page')
  end
end
