require 'govuk_component_test_helper'

class TaxonomySidebarTestCase < ComponentTestCase
  def component_name
    "taxonomy_sidebar"
  end

  test "no error if no parameters passed in" do
    assert_nothing_raised do
      assert_empty render_component({})
    end
  end

  test "renders a taxonomy sidebar" do
    render_component(
      items: [
        {
          title: "Item 1 title",
          url: "/item-1",
          description: "item 1",
        },
        {
          title: "Item 2 title",
          url: "/item-2",
          description: "item 2",
        },
      ]
    )

    taxon_titles = css_select(".sidebar-taxon h2").map { |taxon_title| taxon_title.text.strip }
    taxon_titles = ["Item 1 title", "Item 2 title"]
  end

  test "renders all data attributes for tracking" do
    render_component(
      items: [
        {
          title: "Item title",
          url: "/item",
          description: "An item",
          related_content: [
            {
              title: "Related link 1a",
              link: "/related-link-1a",
            },
            {
              title: "Related link 1b",
              link: "/related-link-1b",
            },
            {
              title: "Related link 1c",
              link: "/related-link-1c",
            },
          ],
        },
        {
          title: "Second item title",
          url: "/item-2",
          description: "Another item",
          related_content: [
            {
              title: "Related link 2a",
              link: "/related-link-2a",
            },
          ],
        },
      ]
    )

    total_sections = 2
    total_links_in_section_1 = 3

    assert_select 'h2 a', "Item title"
    assert_select '.govuk-taxonomy-sidebar[data-module="track-click"]', 1
    assert_tracking_link("category", "relatedLinkClicked", 6)

    expected_title_tracking_options = {
      dimension28: total_sections,
      dimension29: "Item title"
    }
    assert_tracking_link(
      "options",
      { dimension28: total_sections, dimension29: "Item title" }.to_json)
    assert_tracking_link("action", "1")
    assert_tracking_link("label", "/item")

    assert_tracking_link(
      "options",
      { dimension28: total_links_in_section_1, dimension29: "Related link 1a" }.to_json)
    assert_tracking_link("action", "1.1")
    assert_tracking_link("label", "/related-link-1a")

    assert_tracking_link(
      "options",
      { dimension28: total_links_in_section_1, dimension29: "Related link 1a" }.to_json)
    assert_tracking_link("action", "1.2")
    assert_tracking_link("label", "/related-link-1b")
  end


  test "renders without url on the h2 heading" do
    render_component(
      items: [
        {
          title: "Without an url",
          description: "An item",
          related_content: [
            {
              title: "Related link 1",
              link: "/related-link-1",
            },
            {
              title: "Related link 2",
              link: "/related-link-2",
            },
          ],
        },
      ]
    )

    assert_select 'h2', "Without an url"
    assert_select 'h2 a', false
  end

  test "includes the rel attribute when given" do
    render_component(
      items: [
        {
          title: "Without an url",
          description: "An item",
          related_content: [
            {
              title: "External link",
              link: "/external-link-1",
              rel: 'external'
            }
          ],
        },
      ]
    )

    related_links = css_select(".sidebar-taxon .related-content li a")
    assert_equal(
      1,
      related_links.count,
      "Expecting only one external link"
    )

    link = related_links.first
    assert_equal(
      "external",
      link[:rel],
      "The external link is missing a :rel attribute"
    )
  end
end
