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
          title: "Item title",
          url: "/item",
          description: "An item",
        },
        {
          title: "Other item title",
          url: "/other-item",
          description: "Another item",
        },
      ]
    )

    assert_select ".govuk-taxonomy-sidebar > :nth-of-type(1) h2", text: "More about Item title"
    assert_link_with_text_in(".govuk-taxonomy-sidebar > :nth-of-type(1)", "/item", "See everything in Item title")
    assert_select(".govuk-taxonomy-sidebar > :nth-of-type(1) p", "An item")

    assert_select ".govuk-taxonomy-sidebar > :nth-of-type(2) h2", text: "More about Other item title"
    assert_link_with_text_in(".govuk-taxonomy-sidebar > :nth-of-type(2)", "/other-item", "See everything in Other item title")
    assert_select(".govuk-taxonomy-sidebar > :nth-of-type(2) p", "Another item")
  end

  test "renders related content for taxons" do
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
        {
          title: "Other item title",
          url: "/other-item",
          description: "Another item",
          related_content: [
            {
              title: "Related link 3",
              link: "/related-link-3",
            },
          ],
        },
      ],
    )

    assert_link_with_text_in(".related-content-item", "/related-link-1", "Related link 1")
    assert_link_with_text_in(".related-content-item", "/related-link-2", "Related link 2")
    assert_link_with_text_in(".related-content-item", "/related-link-3", "Related link 3")
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

    assert_select "a[data-track-dimension=\"Related link 1\"]", 1
    assert_select "a[data-track-action=\"1.1\"]", 1
    assert_select "a[data-track-label=\"/related-link-1\"]", 1

    assert_select "a[data-track-dimension=\"Related link 2\"]", 1
    assert_select "a[data-track-action=\"1.2\"]", 1
    assert_select "a[data-track-label=\"/related-link-2\"]", 1

    assert_select "a[data-track-dimension=\"Item title\"]", 1
    assert_select "a[data-track-action=\"1.3\"]", 1
    assert_select "a[data-track-label=\"/item\"]", 1
  end
end
