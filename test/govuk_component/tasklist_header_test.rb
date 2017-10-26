require 'govuk_component_test_helper'

class TasklistHeaderTestCase < ComponentTestCase
  def component_name
    "tasklist_header"
  end

  test "renders nothing without passed content" do
    assert_empty render_component({})
  end

  test "renders default component" do
    render_component(title: "This is my title")

    assert_select ".pub-c-tasklist-header span.pub-c-tasklist-header__title", text: "This is my title"
  end

  test "renders with a link" do
    render_component(title: "This is my title", path: "/notalink")

    assert_select ".pub-c-tasklist-header a.pub-c-tasklist-header__title[href='/notalink']", text: "This is my title"
  end

  test "renders with a skip link" do
    render_component(title: "This is my title", skip_link: "#skiplink")

    assert_select ".pub-c-tasklist-header .pub-c-tasklist-header__skip-link[href='#skiplink']", text: "Skip content"
  end

  test "renders with a skip link with custom text" do
    render_component(title: "This is my title", skip_link: "#skiplink", skip_link_text: "It's hard to think of a good value")

    assert_select ".pub-c-tasklist-header .pub-c-tasklist-header__skip-link[href='#skiplink']", text: "It's hard to think of a good value"
  end
end
