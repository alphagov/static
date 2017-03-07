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

  test "renders related content for the first two taxons" do
    render_component(
      items: [
        {
          title: "Item 1 title",
          url: "/item-1",
          description: "item 1",
          related_content: [
            {
              title: "Related link B",
              link: "/related-link-b",
            },
            {
              title: "Related link A",
              link: "/related-link-a",
            },
          ],
        },
        {
          title: "Item 2 title",
          url: "/item-2",
          description: "item 2",
          related_content: [
            {
              title: "Related link C",
              link: "/related-link-c",
            },
          ],
        },
        {
          title: "Item 3 title",
          url: "/item-3",
          description: "item 3",
          related_content: [
            {
              title: "Related link D",
              link: "/related-link-d",
            },
          ],
        }
      ],
    )

    related_links = css_select(".related-content a").map { |link| link.text }
    assert_equal ["Related link B", "Related link A", "Related link C"], related_links
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

    assert_select '.govuk-taxonomy-sidebar[data-module="track-click"]', 1
    assert_select "a[data-track-category=\"relatedLinkClicked\"]", 3
    assert_select "a[data-track-dimension-index=\"29\"]", 3

    assert_select "a[data-track-dimension=\"Item title\"]", 1
    assert_select "a[data-track-action=\"1\"]", 1
    assert_select "a[data-track-label=\"/item\"]", 1

    assert_select "a[data-track-dimension=\"Related link 1\"]", 1
    assert_select "a[data-track-action=\"1.1\"]", 1
    assert_select "a[data-track-label=\"/related-link-1\"]", 1

    assert_select "a[data-track-dimension=\"Related link 2\"]", 1
    assert_select "a[data-track-action=\"1.2\"]", 1
    assert_select "a[data-track-label=\"/related-link-2\"]", 1
  end
end
