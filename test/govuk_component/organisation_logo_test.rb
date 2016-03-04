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
end
