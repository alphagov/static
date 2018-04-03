require 'govuk_component_test_helper'

class SearchTestCase < ComponentTestCase
  def component_name
    "search"
  end

  test "renders a search box with default options" do
    render_component({})
    assert_select ".pub-c-search.pub-c-search--on-white"
  end

  test "renders a search box for a dark background" do
    render_component(on_govuk_blue: true)
    assert_select ".pub-c-search.pub-c-search--on-govuk-blue"
  end

  test "renders a search box with a custom label text" do
    render_component(label_text: "This is my new label")
    assert_select ".pub-c-search .pub-c-search__label", text: "This is my new label"
  end

  test "renders a search box with a custom label content" do
    render_component(inline_label: false, label_text: "<h1>This is a heading 1</h1>")
    assert_select ".pub-c-search .pub-c-search__label h1", text: "This is a heading 1"
    assert_select ".pub-c-search.pub-c-search--separate-label"
  end

  test "renders a search box with a value" do
    render_component(value: "I searched for this")
    assert_select ".pub-c-search .pub-c-search__input" do
      assert_select "[value=?]", "I searched for this"
    end
  end

  test "renders a search box with a custom id" do
    render_component(id: "my-unique-id")
    assert_select ".pub-c-search #my-unique-id.pub-c-search__input"
  end

  test "renders a large search box" do
    render_component(size: "large")
    assert_select ".pub-c-search.pub-c-search--large"
  end
end
