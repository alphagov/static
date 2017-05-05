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
    assert_meta_tag('govuk:analytics:organisations', '<L2><W4>')
    assert_meta_tag('govuk:analytics:world-locations', '<WL3>')
  end

  test "no meta tags are rendered when there's no trackable data" do
    assert_empty render_component(content_item: {})
  end

  test "renders format in a meta tag" do
    render_component(content_item: example_document_for('publication', 'statistics_publication'))
    assert_meta_tag('govuk:format', 'national_statistics')
  end

  test "renders schema-name in a meta tag" do
    render_component(content_item: example_document_for('publication', 'statistics_publication'))
    assert_meta_tag('govuk:schema-name', 'publication')
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

  test "renders user journey stage when user journey supertype is included" do
    render_component(content_item: { user_journey_document_supertype: 'some-stage-of-journey' })
    assert_meta_tag('govuk:user-journey-stage', 'some-stage-of-journey')
  end

  test "renders navigation document type when content item has navigation document supertype" do
    render_component(content_item: { navigation_document_supertype: 'guidance' })
    assert_meta_tag('govuk:navigation-document-type', 'guidance')
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

  test "renders themes metatag for root taxon" do
    taxon = {
      title: 'Root taxon',
      base_path: '/root-taxon',
      links: {
        parent_taxons: [],
      },
    }
    render_component(content_item: example_document_for('taxon', 'taxon').merge(taxon))
    assert_meta_tag('govuk:themes', 'root-taxon')
  end

  test "renders themes metatag for child taxon" do
    taxon = {
      title: 'Child taxon',
      links: {
        parent_taxons: [
          {
            title: 'Root taxon',
            base_path: '/root-taxon',
            document_type: 'taxon',
          },
        ],
      },
    }
    render_component(content_item: example_document_for('taxon', 'taxon').merge(taxon))
    assert_meta_tag('govuk:themes', 'root-taxon')
  end

  test "renders themes metatag for content item" do
    content_item = {
      links: {
        taxons: [
          {
            title: 'Child taxon',
            document_type: 'taxon',
            links: {
              parent_taxons: [
                {
                  title: 'Root taxon',
                  base_path: '/root-taxon',
                  document_type: 'taxon',
                },
              ],
            },
          },
        ],
      },
    }
    render_component(content_item: example_document_for('case_study', 'case_study').merge(content_item))
    assert_meta_tag('govuk:themes', 'root-taxon')
  end

  test "renders themes metatag for content item with multiple roots" do
    content_item = {
      links: {
        taxons: [
          {
            title: 'Education child taxon',
            document_type: 'taxon',
            links: {
              parent_taxons: [
                {
                  title: 'Education root taxon',
                  base_path: '/education-root-taxon',
                  document_type: 'taxon',
                },
              ],
            },
          },
          {
            title: 'Parenting grandchild taxon',
            document_type: 'taxon',
            links: {
              parent_taxons: [
                title: 'Parenting child taxon',
                document_type: 'taxon',
                links: {
                  parent_taxons: [
                    {
                      title: 'Parenting root taxon',
                      base_path: '/parenting-root-taxon',
                      document_type: 'taxon',
                    }
                  ],
                },
              ],
            },
          },
        ],
      },
    }
    render_component(content_item: example_document_for('case_study', 'case_study').merge(content_item))
    assert_meta_tag('govuk:themes', 'education-root-taxon, parenting-root-taxon')
  end

  test "does not render themes metatag for content item with no taxon" do
    content_item = {
      links: {},
    }
    render_component(content_item: example_document_for('case_study', 'case_study').merge(content_item))
    assert_select "meta[name='govuk:themes']", 0
  end

  test "renders taxon metatags for root taxon" do
    taxon = {
      title: 'Root taxon',
      content_id: 'root-taxon-id',
      base_path: '/root-taxon',
      links: {
        parent_taxons: [],
      },
    }
    render_component(content_item: example_document_for('taxon', 'taxon').merge(taxon))
    assert_meta_tag('govuk:taxon-ids', 'root-taxon-id')
    assert_meta_tag('govuk:taxon-id', 'root-taxon-id')
    assert_meta_tag('govuk:taxon-slugs', 'root-taxon')
    assert_meta_tag('govuk:taxon-slug', 'root-taxon')
  end

  test "renders taxon metatags for child taxon" do
    taxon = {
      title: 'Child taxon',
      content_id: 'child-taxon-id',
      base_path: '/root-taxon/child-taxon',
      links: {
        parent_taxons: [
          {
            title: 'Root taxon',
            base_path: '/root-taxon',
            document_type: 'taxon',
          },
        ],
      },
    }
    render_component(content_item: example_document_for('taxon', 'taxon').merge(taxon))
    assert_meta_tag('govuk:taxon-ids', 'child-taxon-id')
    assert_meta_tag('govuk:taxon-id', 'child-taxon-id')
    assert_meta_tag('govuk:taxon-slugs', 'child-taxon')
    assert_meta_tag('govuk:taxon-slug', 'child-taxon')
  end

  test "renders taxon metatags for content item" do
    content_item = {
      links: {
        taxons: [
          {
            title: 'Child taxon',
            content_id: 'child-taxon-id',
            base_path: '/root-taxon/child-taxon',
            document_type: 'taxon',
            links: {
              parent_taxons: [
                {
                  title: 'Root taxon',
                  content_id: 'root-taxon-id',
                  base_path: '/root-taxon',
                  document_type: 'taxon',
                },
              ],
            },
          },
        ],
      },
    }
    render_component(content_item: example_document_for('case_study', 'case_study').merge(content_item))
    assert_meta_tag('govuk:taxon-ids', 'child-taxon-id')
    assert_meta_tag('govuk:taxon-id', 'child-taxon-id')
    assert_meta_tag('govuk:taxon-slugs', 'child-taxon')
    assert_meta_tag('govuk:taxon-slug', 'child-taxon')
  end

  test "renders taxon metatags for content item with multiple taxons" do
    content_item = {
      links: {
        taxons: [
          {
            title: 'Education child taxon',
            base_path: '/education/education-child-taxon',
            content_id: 'education-child-taxon-id',
            document_type: 'taxon',
            links: {
              parent_taxons: [
                {
                  title: 'Education root taxon',
                  base_path: '/education-root-taxon',
                  document_type: 'taxon',
                },
              ],
            },
          },
          {
            title: 'Parenting grandchild taxon',
            content_id: 'parenting-grandchild-taxon-id',
            base_path: '/parenting/parenting-grandchild-taxon',
            document_type: 'taxon',
            links: {
              parent_taxons: [
                title: 'Parenting child taxon',
                document_type: 'taxon',
                links: {
                  parent_taxons: [
                    {
                      title: 'Parenting root taxon',
                      base_path: '/parenting-root-taxon',
                      document_type: 'taxon',
                    }
                  ],
                },
              ],
            },
          },
        ],
      },
    }
    render_component(content_item: example_document_for('case_study', 'case_study').merge(content_item))
    assert_meta_tag('govuk:taxon-ids', 'education-child-taxon-id,parenting-grandchild-taxon-id')
    assert_meta_tag('govuk:taxon-id', 'education-child-taxon-id') # Expecting first alphabetical taxon
    assert_meta_tag('govuk:taxon-slugs', 'education-child-taxon,parenting-grandchild-taxon')
    assert_meta_tag('govuk:taxon-slug', 'education-child-taxon') # Expecting first alphabetical taxon
  end

  test "does not render taxon ID metatag for content item with no taxon" do
    content_item = {
      links: {},
    }
    render_component(content_item: example_document_for('case_study', 'case_study').merge(content_item))
    assert_select "meta[name='govuk:taxon-ids']", 0
  end

  def assert_political_status_for(political, current, expected_political_status)
    render_component(content_item: { details: { political: political, government: { current: current, slug: 'government' } } })
    assert_meta_tag('govuk:political-status', expected_political_status)
  end

  def assert_meta_tag(name, content)
    assert_select "meta[name='#{name}'][content='#{content}']"
  end
end
