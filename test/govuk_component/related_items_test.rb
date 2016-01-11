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

  test "renders a related items block" do
    render_component({
      sections: [
        {
          title: "Section title",
          url: "/more-link",
          items: [
            {
              title: "Item title",
              url: "/item"
            },
            {
              title: "Other item title",
              url: "/other-item"
            }
          ]
        }
      ],
    })

    assert_select "h2", text: "Section title"
    assert_link_with_text_in("ul li:last-child", "/more-link", "More in Section title")
    assert_link_with_text_in("ul li:first-child", "/item", "Item title")
    assert_link_with_text_in("ul li:first-child + li", "/other-item", "Other item title")
  end

  test "renders a multiple related items block" do
    render_component({
      sections: [
        {
          title: "Section title",
          url: "/more-link",
          items: [
            {
              title: "Item title",
              url: "/item"
            }
          ]
        },
        {
          title: "Other section title",
          url: "/other-more-link",
          items: [
            {
              title: "Other item title",
              url: "/other-item"
            }
          ]
        }
      ],
    })

    assert_select "h2", text: "Section title"
    assert_link_with_text_in("ul li:last-child", "/more-link", "More in Section title")
    assert_link_with_text_in("ul li:first-child", "/item", "Item title")

    assert_select "h2", text: "Other section title"
    assert_link_with_text_in("ul li:last-child", "/other-more-link", "More in Other section title")
    assert_link_with_text_in("ul li:first-child", "/other-item", "Other item title")
  end

  test "has a default section title" do
    render_component({
      sections: [
        {
          url: "/more-link",
          items: [
            {
              title: "Item title",
              url: "/item"
            }
          ]
        },
      ],
    })

    assert_select "h2", text: "Elsewhere on GOV.UK"
  end

  test "renders external links with a rel attribute" do
    render_component({
      sections: [
        {
          title: "Elsewhere on the web",
          url: "/more-link",
          items: [
            {
              title: "Wikivorce",
              url: "http://www.wikivorce.com",
              rel: "external"
            }
          ]
        },
      ],
    })
    assert_select "a[rel=external]", text: "Wikivorce"
  end

  test "includes an id and aria-labelledby when a section id is provided" do
    render_component({
      sections: [
        {
          title: "Elsewhere on the web",
          url: "/more-link",
          id: "related-elsewhere-on-the-web",
          items: [
            {
              title: "Wikivorce",
              url: "http://www.wikivorce.com",
              rel: "external"
            }
          ]
        },
      ],
    })
    assert_select "#related-elsewhere-on-the-web", text: "Elsewhere on the web"
    assert_select "nav[aria-labelledby=related-elsewhere-on-the-web]"
  end
end
