require 'govuk_component_test_helper'
require 'gds_api/response'

class AnalyticsMetaTagsTestCase < ComponentTestCase
  def component_name
    "analytics_meta_tags"
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
        organisations:            [{ analytics_identifier: "O1" }],
        lead_organisations:       [{ analytics_identifier: "L2" }],
        supporting_organisations: [{ analytics_identifier: "S3" }],
        worldwide_organisations:  [{ analytics_identifier: "W4" }],
      }
    }

    render_component(content_item: content_item)
    assert_meta_tag('govuk:analytics:organisations', '<O1><L2><S3><W4>')
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

  def assert_meta_tag(name, content)
    assert_select "meta[name='#{name}'][content='#{content}']"
  end
end
