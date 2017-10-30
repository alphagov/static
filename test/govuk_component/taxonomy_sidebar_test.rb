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

  test "renders a taxonomy sidebar with no children as an 'Elsewhere on' related links block" do
    render_component(
      items: [
        {
          title: "Item 1 title",
          url: "/item-1",
        },
        {
          title: "Item 2 title",
          url: "/item-2",
        },
      ]
    )

    assert_select "h2", "Elsewhere on GOV.UK"
    taxon_links = css_select("a").map { |taxon_title| taxon_title.text.strip }
    assert_equal ["Item 1 title", "Item 2 title"], taxon_links
  end

  test "renders without More link for taxons without URLs" do
    render_component(
      items: [
        {
          title: "Without a url",
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

    assert_select 'h2', "Without a url"
    assert_select '.related-items-more', false
  end
end
