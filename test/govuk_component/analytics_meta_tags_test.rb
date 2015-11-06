require 'govuk_component_test_helper'
require 'gds_api/response'

class AnalyticsMetaTagsTestCase < ComponentTestCase
  def component_name
    "analytics_meta_tags"
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

    assert_select "meta[name='govuk:analytics:organisations'][content='<O1><L2><S3><W4>']"
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

    assert_select "meta[name='govuk:analytics:world-locations'][content='<WL3><WL123>']"
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

    assert_select "meta[name='govuk:analytics:world-locations'][content='<WL3>']"
  end
end
