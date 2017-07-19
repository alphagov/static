require 'govuk_component_test_helper'

class SearchTestCase < ComponentTestCase
  def component_name
    "search"
  end

  test "renders a search box with default options" do
    render_component({})
    assert_select ".govuk-search.on-light-background"
  end

  test "renders a search box for a dark background" do
    render_component(on_dark_background: true)
    assert_select ".govuk-search.on-dark-background"
  end

  test "renders a search box with a custom label text" do
    render_component(label_text: "This is my new label")
    assert_select ".govuk-search .search-label", text: "This is my new label"
  end

  test "renders a search box with a custom label content" do
    render_component(inline_label: false, label_text: "<h1>This is a heading 1</h1>")
    assert_select ".govuk-search .search-label h1", text: "This is a heading 1"
    assert_select ".govuk-search.search-separate-label"
  end

  test "renders a search box with a value" do
    render_component(value: "I searched for this")
    assert_select ".govuk-search .search-input" do
      assert_select "[value=?]", "I searched for this"
    end
  end

  test "renders a search box with a custom id" do
    render_component(id: "my-unique-id")
    assert_select ".govuk-search #my-unique-id.search-input"
  end

  test "renders a large search box" do
    render_component(size: "large")
    assert_select ".govuk-search.search-large"
  end
end
