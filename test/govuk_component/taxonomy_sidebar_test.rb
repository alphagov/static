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

  test "renders a related items block" do
    render_component(
      sections: [
        {
          title: "Section title",
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
            }
          ]
        }
      ],
    )

    assert_select "h2", text: "Section title"
    assert_link_with_text_in("ul li:first-child", "/item", "Item title")
    assert_select("ul li:first-child p", "An item")
    assert_link_with_text_in("ul li:first-child + li", "/other-item", "Other item title")
    assert_select("ul li:first-child + li p", "Another item")
  end

  test "renders all data attributes for tracking" do
    render_component(
      sections: [
        {
          title: "Section title",
          items: [
            {
              title: "Item title",
              url: "/item",
              description: "An item",
            },
          ]
        }
      ],
    )

    assert_select '.govuk-taxonomy-sidebar[data-module="track-click"]', 1
    assert_select "a[data-track-category=\"relatedLinkClicked\"]", 1
    assert_select "a[data-track-dimension=\"Item title\"]", 1
    assert_select "a[data-track-dimension-index=\"29\"]", 1
    assert_select "a[data-track-action=\"1.1\"]", 1
    assert_select "a[data-track-label=\"/item\"]", 1
  end
end
