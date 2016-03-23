require 'govuk_component_test_helper'
require 'govuk_component/govspeak_test'

class GovspeakHtmlPublicationTestCase < GovspeakTestCase
  def component_name
    "govspeak_html_publication"
  end

  test "renders a govuk-sticky-element" do
    assert_nothing_raised do
      render_component(
        content: '<span>Govspeak content</span>',
        sticky_footer_html: '<div id="my-content">Content</div>'
      )
      assert_select "[data-sticky-element] #my-content"
    end
  end

  test "respects direction if passed in" do
    assert_nothing_raised do
      render_component(
        content: '<span>Govspeak content</span>',
        direction: 'rtl'
      )
      assert_select ".govuk-govspeak-html-publication.direction-rtl"
    end
  end
end
