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
end
