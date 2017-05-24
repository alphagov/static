require 'integration_test_helper'

class NotificationsTest < ActionDispatch::IntegrationTest
  context "emergency banner file" do
    should "have an emergency banner file" do
      assert File.exist? "#{Rails.root}/app/views/notifications/_emergency_banner.html.erb"
    end
  end

  context "emergency banner notifications" do
    should "not render a banner if one does not exist" do
      EmergencyBanner::Display.any_instance.stubs(:enabled?).returns(false)
      visit "/templates/wrapper.html.erb"
      refute page.has_selector? ".govuk-emergency-banner"
    end

    should "render a banner if one does exist" do
      EmergencyBanner::Display.any_instance.stubs(:enabled?).returns(true)
      visit "/templates/wrapper.html.erb"
      assert page.has_selector? ".govuk-emergency-banner"
    end

    should "render a banner with a heading and campaign colour" do
      EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
      EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("notable-death")

      visit "/templates/wrapper.html.erb"

      assert page.has_selector? ".govuk-emergency-banner.notable-death"
      assert_match 'Alas poor Yorick', page.body
    end

    should "render the more information link" do
      EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
      EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("notable-death")
      EmergencyBanner::Display.any_instance.stubs(:link).returns("https://yoricks.gov")

      visit "/templates/wrapper.html.erb"

      assert_match "More information", page.body
      assert_match(/yoricks\.gov/, page.body)
    end

    should "not render the more information link if it does not exist" do
      EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
      EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("notable-death")
      EmergencyBanner::Display.any_instance.stubs(:link).returns(nil)

      visit "/templates/wrapper.html.erb"

      refute page.has_selector? ".more-information"
      refute_match(/yoricks\.gov/, page.body)
    end

    should "render the extra information" do
      EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
      EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("notable-death")
      EmergencyBanner::Display.any_instance.stubs(:short_description).returns("I knew him well")

      visit "/templates/wrapper.html.erb"

      assert_match "I knew him well", page.body
    end

    should "does not render the extra information if it does not exist" do
      EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
      EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("notable-death")
      EmergencyBanner::Display.any_instance.stubs(:short_description).returns(nil)

      visit "/templates/wrapper.html.erb"

      refute_match "I knew him well", page.body
    end
  end

  context "promo banner" do
    should "not display if the Emergency Banner is enabled" do
      EmergencyBanner::Display.any_instance.stubs(:enabled?).returns(true)
      visit "/templates/wrapper.html.erb"

      refute page.has_selector? ".global-bar-message"
    end
  end
end
