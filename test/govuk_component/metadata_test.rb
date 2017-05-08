require 'govuk_component_test_helper'

class MetadataTestCase < ComponentTestCase
  def component_name
    "metadata"
  end

  test "renders metadata in a definition list" do
    render_component({})
    assert_select ".govuk-metadata dl"

    assert_select "dd", false
    assert_select "dt", false
  end

  test "renders from metadata" do
    render_component(from: "<a href='/link'>Department</a>")

    assert_definition('From:', 'Department')
    assert_link_with_text_in('dd', '/link', 'Department')
  end

  test "renders part of metadata" do
    render_component(part_of: "<a href='/link'>Department</a>")

    assert_definition('Part of:', 'Department')
    assert_link_with_text_in('dd', '/link', 'Department')
  end

  test "renders history metadata" do
    render_component(history: "Updated 2 weeks ago")

    assert_definition('History:', 'Updated 2 weeks ago')
  end

  test "renders custom metadata" do
    render_component(other: {
        "Related topics": [
          "<a href='/government/topics/arts-and-culture'>Arts and culture</a>",
          "<a href='/government/topics/sports-and-leisure'>Sports and leisure</a>"
        ],
        "Applies to": "England"
      })

    assert_definition('Related topics:', 'Arts and culture and Sports and leisure')
    assert_definition('Applies to:', 'England')
    assert_link_with_text_in('dd', '/government/topics/arts-and-culture', 'Arts and culture')
    assert_link_with_text_in('dd', '/government/topics/sports-and-leisure', 'Sports and leisure')
  end

  test "renders multiples as a single sentence (except history)" do
    render_component(from: %w( one another ),
      part_of: %w( this that ),
      other: {
        "Related topics": %w( a b c )
      })

    assert_definition('From:', 'one and another')
    assert_definition('Part of:', 'this and that')
    assert_definition('Related topics:', 'a, b, and c')
  end
end
