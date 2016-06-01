require 'govuk_component_test_helper'
require 'gds_api/response'

class AnalyticsMetaTagsTestCase < ComponentTestCase
  def component_name
    "analytics_meta_tags"
  end

  def example_document_for(format, example_name)
    JSON.parse(GovukContentSchemaTestHelpers::Examples.new.get(format, example_name))
  end

  test "renders with an example case study" do
    render_component(content_item: example_document_for('case_study', 'case_study'))

    assert_meta_tag('govuk:format', 'case_study')
    assert_meta_tag('govuk:need-ids', '100001,100002')
    assert_meta_tag('govuk:analytics:organisations', '<L2><W4>')
    assert_meta_tag('govuk:analytics:world-locations', '<WL3>')
  end

  test "no meta tags are rendered when there's no trackable data" do
    assert_empty render_component(content_item: {})
  end

  test "renders format in a meta tag" do
    render_component(content_item: { format: "case_study" })
    assert_meta_tag('govuk:format', 'case_study')
  end

  test "renders need IDs as a comma separated list" do
    render_component(content_item: { need_ids: [100001, 100002] })
    assert_meta_tag('govuk:need-ids', '100001,100002')
  end

  test "renders organisations in a meta tag with angle brackets" do
    content_item = {
      links: {
        organisations:            [{ analytics_identifier: "O1" }, { analytics_identifier: "O1" }],
        worldwide_organisations:  [{ analytics_identifier: "W4" }],
      }
    }

    render_component(content_item: content_item)
    assert_meta_tag('govuk:analytics:organisations', '<O1><W4>')
  end

  test "renders world locations in a meta tag with angle brackets" do
    content_item = {
      links: {
        world_locations: [
          {
            analytics_identifier: "WL3"
          },
          {
            analytics_identifier: "WL123"
          }
        ]
      }
    }

    render_component(content_item: content_item)
    assert_meta_tag('govuk:analytics:world-locations', '<WL3><WL123>')
  end

  test "handling of string keys and/or GdsApi::Response objects" do
    content_item = {
      links: {
        world_locations: [
          {
            analytics_identifier: "WL3"
          }
        ]
      }
    }
    net_http_response = stub(body: content_item.to_json)
    api_response = GdsApi::Response.new(net_http_response)

    render_component(content_item: api_response)
    assert_meta_tag('govuk:analytics:world-locations', '<WL3>')
  end

  test "renders publishing government slug when government and political keys included" do
    render_component(content_item: { details: { political: false, government: { current: true, slug: 'government' } } })
    assert_meta_tag('govuk:publishing-government', 'government')
  end

  test "does not render publishing government or political status when political or government is missing" do
    assert_empty render_component(content_item: { details: { government: { current: true, slug: 'government' } } })
    assert_empty render_component(content_item: { details: { political: true } })
  end

  test "renders 'political' political status when political content and government is current" do
    current = true
    political = true
    assert_political_status_for(political, current, 'political')
  end

  test "renders 'historic' political status when political content and government is historic" do
    current = false
    political = true
    assert_political_status_for(political, current, 'historic')
  end

  test "renders 'non-political' political status when non-political content and government is current" do
    current = true
    political = false
    assert_political_status_for(political, current, 'non-political')
  end

  test "renders 'non-political' political status when non-political content and government is historic" do
    current = false
    political = false
    assert_political_status_for(political, current, 'non-political')
  end

  def assert_political_status_for(political, current, expected_political_status)
    render_component(content_item: { details: { political: political, government: { current: current, slug: 'government' } } })
    assert_meta_tag('govuk:political-status', expected_political_status)
  end

  def assert_meta_tag(name, content)
    assert_select "meta[name='#{name}'][content='#{content}']"
  end
end
