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
    render_component(breadcrumbs: [{ title: 'Section', url: '/section' }])

    assert_link_with_text_in('ol li:first-child', '/section', 'Section')
  end

  test "renders all data attributes for tracking" do
    render_component(breadcrumbs: [{ title: 'Section', url: '/section' }])

    expected_tracking_options = {
      dimension28: "1",
      dimension29: "Section"
    }

    assert_select '.govuk-breadcrumbs[data-module="track-click"]', 1
    assert_select 'ol li:first-child a[data-track-action="1"]', 1
    assert_select 'ol li:first-child a[data-track-label="/section"]', 1
    assert_select 'ol li:first-child a[data-track-category="breadcrumbClicked"]', 1
    assert_select "ol li:first-child a[data-track-options='#{expected_tracking_options.to_json}']", 1
  end

  test "tracks the total breadcrumb count on each breadcrumb" do
    breadcrumbs = [
      { title: 'Section 1', url: '/section-1' },
      { title: 'Section 2', url: '/section-2' },
      { title: 'Section 3', url: '/section-3' },
    ]
    render_component(breadcrumbs: breadcrumbs)

    expected_tracking_options = [
      { dimension28: "3", dimension29: "Section 1" },
      { dimension28: "3", dimension29: "Section 2" },
      { dimension28: "3", dimension29: "Section 3" },
    ]

    assert_select "ol li:nth-child(1) a[data-track-options='#{expected_tracking_options[0].to_json}']", 1
    assert_select "ol li:nth-child(2) a[data-track-options='#{expected_tracking_options[1].to_json}']", 1
    assert_select "ol li:nth-child(3) a[data-track-options='#{expected_tracking_options[2].to_json}']", 1
  end

  test "renders a list of breadcrumbs" do
    render_component(breadcrumbs: [
        { title: 'Home', url: '/' },
        { title: 'Section', url: '/section' },
        { title: 'Sub-section', url: '/sub-section' },
      ])

    assert_link_with_text_in('ol li:first-child', '/', 'Home')
    assert_link_with_text_in('ol li:first-child + li', '/section', 'Section')
    assert_link_with_text_in('ol li:last-child', '/sub-section', 'Sub-section')
  end

  test "renders inverted breadcrumbs when passed a flag" do
    render_component(breadcrumbs: [
        { title: 'Home', url: '/' },
        { title: 'Section', url: '/section' },
        inverse: true
      ])

    assert_select "div.govuk-breadcrumbs--inverse"
  end

  test "allows the last breadcrumb to be text only" do
    render_component(
      breadcrumbs: [
        { title: 'Topic', url: '/topic' },
        { title: 'Current Page' },
      ]
    )
    assert_select('ol li:last-child', 'Current Page')
  end
end
