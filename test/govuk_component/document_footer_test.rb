require 'govuk_component_test_helper'

class DocumentFooterTestCase < ComponentTestCase
  def component_name
    "document_footer"
  end

  test "renders document metadata in a footer based on data provided" do
    render_component({})
    assert_select ".govuk-document-footer h2", text: "Document information"

    assert_select ".published", false
    assert_select ".updated", false
    assert_select ".other-date", false
    assert_select ".change-notes", false
    assert_select ".from", false
    assert_select ".part-of", false
    assert_select ".other", false
  end

  test "renders the deparments a document is from" do
    render_component({
      from: [
        "<a href='/space-travel'>Department for Space Travel</a>",
        "<a href='/extra-solar-exploration'>Extra Solar Exploration Office</a>"
      ]
    })

    assert_link_with_text_in(".from .definition", "/space-travel", "Department for Space Travel")
    assert_link_with_text_in(".from .definition", "/extra-solar-exploration", "Extra Solar Exploration Office")
  end

  test "renders things the document is part of" do
    render_component({
      part_of: [
        "<a href='/space'>Space</a>",
        "<a href='/astro-engineering'>Astro Engineering</a>"
      ]
    })

    assert_link_with_text_in(".part-of .definition", "/space", "Space")
    assert_link_with_text_in(".part-of .definition", "/astro-engineering", "Astro Engineering")
  end

  test "renders custom metadata" do
    render_component({
      other: {
        "Space travel type": "<a href='/faster-than-light'>Faster than light</a>"
      }
    })

    assert_select 'p', text: /Space travel type/
    assert_link_with_text_in(".other .definition", "/faster-than-light", "Faster than light")
  end

  test "renders custom document dates" do
    render_component({
      published: "20 January 2092",
      updated: "22 January 2092",
      other_dates: {
        "Date opened": "1 February 2092",
        "Date closed": "1 March 2093"
      }
    })

    assert_select 'p', text: /Published:\s+20 January 2092/
    assert_select 'p', text: /Updated:\s+22 January 2092/
    assert_select 'p', text: 'Date opened: 1 February 2092'
    assert_select 'p', text: 'Date closed: 1 March 2093'
  end

  test "renders document history" do
    render_component({
      history: [
        {
          display_time: "22 January 2012",
          timestamp: "22-01-2012Z14:19:00T",
          note: "We updated the document"
        },
        {
          display_time: "24 January 2012",
          timestamp: "24-01-2012Z14:19:00T",
          note: "We updated the document again"
        }
      ]
    })

    assert_timestamp_in('.change-notes', '22-01-2012Z14:19:00T', '22 January 2012')
    assert_select 'li', text: /We updated the document$/

    assert_timestamp_in('.change-notes', '24-01-2012Z14:19:00T', '24 January 2012')
    assert_select 'li', text: /We updated the document again/

    assert_select '.change-notes li', count: 2
  end

  test "supports right to left content" do
    render_component({direction: "rtl"})
    assert_select '.govuk-document-footer.direction-rtl'
  end
end
