require 'govuk_component_test_helper'

class OrganisationLogoTestCase < ComponentTestCase
  def component_name
    "organisation_logo"
  end

  test "no error if no parameters passed in" do
    assert_nothing_raised do
      render_component({})
      assert_select ".govuk-organisation-logo"
    end
  end

  test "organisation name appears" do
    render_component(organisation: { name: "Oranisation name" })
    assert_select ".govuk-organisation-logo .logo-container", text: "Oranisation name"
  end

  test "branding is added to the wrapping container" do
    render_component(organisation: { name: "Branded", brand: "brand" })
    assert_select ".govuk-organisation-logo.brand", text: "Branded"
  end

  test "a link is included when a URL is provided" do
    render_component(organisation: { name: "Linked", url: "/somewhere" })
    assert_select ".govuk-organisation-logo a.logo-container.logo-link[href='/somewhere']", text: "Linked"
  end

  test "a crest class is added when specified" do
    render_component(organisation: { name: "Crested", crest: "single-identity" })
    assert_select ".logo-container.logo-with-crest.crest-single-identity"
  end

  test "an image is rendered when specified" do
    render_component(organisation: { name: "Custom image", image: { url: "url", "alt_text": "alt" } })
    assert_select ".logo-container img[src='url'][alt='alt']"
  end

  test "data tracking attributes are added to the link when specified" do
    data_attributes = {
      track_category: "someLinkClicked",
      track_action: 1,
      track_label: "/some-link",
      track_options: {
        dimension28: 2,
        dimension29: "Organisation link"
      }
    }

    render_component(organisation: { url: "/some-link", data_attributes: data_attributes })

    assert_select ".govuk-organisation-logo[data-module='track-click']"
    assert_select ".govuk-organisation-logo a.logo-container.logo-link[data-track-category='someLinkClicked']"
    assert_select ".govuk-organisation-logo a.logo-container.logo-link[data-track-action='1']"
    assert_select ".govuk-organisation-logo a.logo-container.logo-link[data-track-label='/some-link']"
    assert_select ".govuk-organisation-logo a.logo-container.logo-link[data-track-options='{\"dimension28\":2,\"dimension29\":\"Organisation link\"}']"
  end

  test "data tracking attributes are not added when no link is specified" do
    data_attributes = {
      track_category: "someLinkClicked"
    }

    render_component(organisation: { data_attributes: data_attributes })
    assert_select ".govuk-organisation-logo a.logo-container.logo-link[data-track-category='someLinkClicked']", false
  end
end
