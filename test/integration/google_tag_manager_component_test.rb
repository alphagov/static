require "integration_test_helper"

class GoogleTagManagerComponentTest < ActionDispatch::IntegrationTest
  context "GTM environment variables are present" do
    should "render the GTM component on the gem_base template" do
      ClimateControl.modify GOOGLE_TAG_MANAGER_ID: "a-nice-id" do
        visit "/templates/gem_layout.html.erb"
        assert_match "https://www.googletagmanager.com/gtm.js", page.body
      end
    end
  end

  context "GTM environment variables are absent" do
    should "not render the GTM component on the gem_base template" do
      visit "/templates/gem_layout.html.erb"
      assert_no_match "https://www.googletagmanager.com/gtm.js", page.body
    end
  end
end
