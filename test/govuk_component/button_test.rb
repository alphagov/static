require 'govuk_component_test_helper'

class ButtonTestCase < ComponentTestCase
  def component_name
    "button"
  end

  test "no error if no parameters passed in" do
    assert_nothing_raised do
      render_component({})
      assert_select ".pub-c-button"
    end
  end

  test "renders the correct defaults" do
    render_component(text: "Submit")
    assert_select ".pub-c-button", text: "Submit"
    assert_select ".pub-c-button--start", false
    assert_select ".pub-c-button__info-text", false
  end

  test "renders text correctly" do
    render_component(text: "Submit")
    assert_select ".pub-c-button", text: "Submit"
  end

  test "renders start now button" do
    render_component(text: "Start now", href: "#", start: true)
    assert_select ".pub-c-button", text: "Start now", href: "#"
    assert_select ".pub-c-button--start"
  end

  test "renders an anchor if href set" do
    render_component(text: "Start now", href: "#")
    assert_select "a.pub-c-button"
    assert_select "button.pub-c-button", false
  end

  test "renders a button if href not set" do
    render_component(text: "Start now")
    assert_select "button.pub-c-button"
    assert_select "a.pub-c-button", false
  end

  test "renders info text" do
    render_component(text: "Start now", info_text: "Information text")
    assert_select ".pub-c-button", text: "Start now"
    assert_select ".pub-c-button__info-text", text: "Information text"
  end

  test "renders rel attribute correctly" do
    render_component(text: "Start now", rel: "nofollow")
    assert_select ".pub-c-button[rel='nofollow']", text: "Start now"

    render_component(text: "Start now", rel: "nofollow preload")
    assert_select ".pub-c-button[rel='nofollow preload']", text: "Start now"
  end

  test "renders margin bottom class correctly" do
    render_component(text: "Submit")
    assert_select ".pub-c-button", text: "Submit"
    assert_select ".pub-c-button--bottom-margin", count: 0

    render_component(text: "Submit", margin_bottom: true)
    assert_select ".pub-c-button.pub-c-button--bottom-margin", text: "Submit"
  end
end
