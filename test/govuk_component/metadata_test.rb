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

  test "rendering of long metadata into wrapping for Javascript interaction" do
    render_component(other:{
        "Industry": [
          "<a href=\"/business-finance-support?industries%5B%5D=agriculture-and-food\">Agriculture and food</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=business-and-finance\">Business and finance</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=construction\">Construction</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=education\">Education</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=health\">Health</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=hospitality-and-catering\">Hospitality and catering</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=information-technology-digital-and-creative\">IT, digital and creative</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=manufacturing\">Manufacturing</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=mining\">Mining</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=real-estate-and-property\">Real estate and property</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=science-and-technology\">Science and technology</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=service-industries\">Service industries</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=transport-and-distribution\">Transport and distribution</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=travel-and-leisure\">Travel and leisure</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=utilities-providers\">Utilities providers</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=wholesale-and-retail\">Wholesale and retail</a>"
        ]
    })
    result = "<a href=\"/business-finance-support?industries%5B%5D=agriculture-and-food\">Agriculture and food</a>, <a href=\"/business-finance-support?industries%5B%5D=business-and-finance\">Business and finance</a>, <a href=\"/business-finance-support?industries%5B%5D=construction\">Construction</a>, <a href=\"/business-finance-support?industries%5B%5D=education\">Education</a>, <a href=\"/business-finance-support?industries%5B%5D=health\">Health</a><span class=\"js-truncated truncated\">, <a href=\"/business-finance-support?industries%5B%5D=hospitality-and-catering\">Hospitality and catering</a>, <a href=\"/business-finance-support?industries%5B%5D=information-technology-digital-and-creative\">IT, digital and creative</a>, <a href=\"/business-finance-support?industries%5B%5D=manufacturing\">Manufacturing</a>, <a href=\"/business-finance-support?industries%5B%5D=mining\">Mining</a>, <a href=\"/business-finance-support?industries%5B%5D=real-estate-and-property\">Real estate and property</a>, <a href=\"/business-finance-support?industries%5B%5D=science-and-technology\">Science and technology</a>, <a href=\"/business-finance-support?industries%5B%5D=service-industries\">Service industries</a>, <a href=\"/business-finance-support?industries%5B%5D=transport-and-distribution\">Transport and distribution</a>, <a href=\"/business-finance-support?industries%5B%5D=travel-and-leisure\">Travel and leisure</a>, <a href=\"/business-finance-support?industries%5B%5D=utilities-providers\">Utilities providers</a>, and <a href=\"/business-finance-support?industries%5B%5D=wholesale-and-retail\">Wholesale and retail</a></span><a href=\"#\" class=\"js-truncatedtoggle truncatedtoggle\" data-text=\"+ 11 more\" aria-expanded=\"false\">+ 11 more</a>"
    assert_long_list_truncation(result)
  end

  test "rendering of metadata not too long to trigger wrapping for Javascript interaction" do
    render_component(other:{
        "Industry": [
          "<a href=\"/business-finance-support?industries%5B%5D=agriculture-and-food\">Agriculture and food</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=business-and-finance\">Business and finance</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=construction\">Construction</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=education\">Education</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=health\">Health</a>",
          "<a href=\"/business-finance-support?industries%5B%5D=hospitality-and-catering\">Hospitality and catering</a>",
        ]
    })
    result = "<a href=\"/business-finance-support?industries%5B%5D=agriculture-and-food\">Agriculture and food</a>, <a href=\"/business-finance-support?industries%5B%5D=business-and-finance\">Business and finance</a>, <a href=\"/business-finance-support?industries%5B%5D=construction\">Construction</a>, <a href=\"/business-finance-support?industries%5B%5D=education\">Education</a>, <a href=\"/business-finance-support?industries%5B%5D=health\">Health</a>, and <a href=\"/business-finance-support?industries%5B%5D=hospitality-and-catering\">Hospitality and catering</a>"
    assert_long_list_without_truncation(result)
  end
end
