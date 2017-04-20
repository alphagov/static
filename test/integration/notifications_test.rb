require 'integration_test_helper'

class NotificationsTest < ActionDispatch::IntegrationTest
  setup do
    @original_banner = Static.banner
  end

  teardown do
    Static.banner = @original_banner
  end

  context "emergency banner file" do
    should "have an emergency banner file" do
      assert File.exist? "#{Rails.root}/app/views/notifications/_emergency_banner.html.erb"
    end
  end

  context "emergency banner notifications" do
    context "homepage" do
      should "not render a banner if one does not exist" do
        EmergencyBanner::Display.any_instance.stubs(:enabled?).returns(false)
        visit "/templates/homepage.html.erb"
        refute page.has_selector? "#campaign"
      end

      should "render a banner if one does exist" do
        EmergencyBanner::Display.any_instance.stubs(:enabled?).returns(true)
        visit "/templates/homepage.html.erb"
        assert page.has_selector? "#campaign"
      end

      should "only render the homepage emergency banner, not the general population emergency banner" do
        EmergencyBanner::Display.any_instance.stubs(:enabled?).returns(true)
        visit "/templates/homepage.html.erb"
        assert page.has_selector? "#campaign"
        refute page.has_selector? "#emergency-banner-notification"
      end

      should "render a homepage banner with a heading and campaign colour" do
        EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
        EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("black")
        visit "/templates/homepage.html.erb"
        assert page.has_selector? "#campaign.black"
        assert_match 'Alas poor Yorick', page.body
      end

      should "render the short description and more information link" do
        EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
        EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("black")
        EmergencyBanner::Display.any_instance.stubs(:link).returns("https://yoricks.gov")
        EmergencyBanner::Display.any_instance.stubs(:short_description).returns("I knew him well")

        visit "/templates/homepage.html.erb"
        assert_match "I knew him well", page.body
        assert_match "More information", page.body
        assert_match(/yoricks\.gov/, page.body)
      end
    end

    context "all other pages" do
      should "not render a banner if one does not exist" do
        EmergencyBanner::Display.any_instance.stubs(:enabled?).returns(false)
        visit "/templates/wrapper.html.erb"
        refute page.has_selector? "#emergency-banner-notification"
      end

      should "render a banner if one does exist" do
        EmergencyBanner::Display.any_instance.stubs(:enabled?).returns(true)
        visit "/templates/wrapper.html.erb"
        assert page.has_selector? "#emergency-banner-notification"
      end

      should "render a banner with a heading and campaign colour" do
        EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
        EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("black")

        visit "/templates/wrapper.html.erb"

        assert page.has_selector? "#emergency-banner-notification.black"
        assert_match 'Alas poor Yorick', page.body
      end

      should "render the more information link" do
        EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
        EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("black")
        EmergencyBanner::Display.any_instance.stubs(:link).returns("https://yoricks.gov")

        visit "/templates/wrapper.html.erb"

        assert page.has_selector? ".more-information"
        assert_match "More information", page.body
        assert_match(/yoricks\.gov/, page.body)
      end

      should "not render the more information link if it does not exist" do
        EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
        EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("black")
        EmergencyBanner::Display.any_instance.stubs(:link).returns(nil)

        visit "/templates/wrapper.html.erb"

        refute page.has_selector? ".more-information"
        refute_match(/yoricks\.gov/, page.body)
      end

      should "render the extra information" do
        EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
        EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("black")
        EmergencyBanner::Display.any_instance.stubs(:short_description).returns("I knew him well")

        visit "/templates/wrapper.html.erb"

        assert_match "I knew him well", page.body
      end

      should "does not render the extra information if it does not exist" do
        EmergencyBanner::Display.any_instance.stubs(:heading).returns("Alas poor Yorick")
        EmergencyBanner::Display.any_instance.stubs(:campaign_class).returns("black")
        EmergencyBanner::Display.any_instance.stubs(:short_description).returns(nil)

        visit "/templates/wrapper.html.erb"

        refute_match "I knew him well", page.body
      end
    end
  end

  context "promo banner" do
    should "not display if the Emergency Banner is enabled" do
      EmergencyBanner::Display.any_instance.stubs(:enabled?).returns(true)
      visit "/templates/wrapper.html.erb"

      refute page.has_selector? ".global-bar-message"
    end
  end

  context "banner files" do
    should "have a green file" do
      assert File.exist? "#{Rails.root}/app/views/notifications/banner_green.erb"
    end

    should "have a red file" do
      assert File.exist? "#{Rails.root}/app/views/notifications/banner_red.erb"
    end

    should "have a black file" do
      assert File.exist? "#{Rails.root}/app/views/notifications/banner_black.erb"
    end
  end

  context "banner notifications" do
    teardown do
      clean_up_test_files
    end

    context "given view files are empty" do
      setup do
        create_test_file(filename: "banner_green.erb", content: '')
        create_test_file(filename: "banner_red.erb", content: '')
        create_test_file(filename: "banner_black.erb", content: '')

        Static.banner = NotificationFileLookup.new(location_of_test_files).banner
      end

      should "not show a banner notification on the page" do
        visit "/templates/wrapper.html.erb"
        refute page.has_selector? "#banner-notification"
      end
    end

    context "given view files are present for a green notification" do
      setup do
        create_test_file(filename: "banner_green.erb", content: '<p>Everything is fine</p>')
        create_test_file(filename: "banner_red.erb", content: '')
        create_test_file(filename: "banner_black.erb", content: '')

        Static.banner = NotificationFileLookup.new(location_of_test_files).banner
      end

      should "show a banner notification on the page" do
        visit "/templates/wrapper.html.erb"
        assert page.has_selector? "#banner-notification.green"
        assert_match '<p>Everything is fine</p>', page.body
      end
    end

    context "given view files are present for a red notification" do
      setup do
        create_test_file(filename: "banner_green.erb", content: '')
        create_test_file(filename: "banner_red.erb", content: '<p>Everything is not fine</p>')
        create_test_file(filename: "banner_black.erb", content: '')

        Static.banner = NotificationFileLookup.new(location_of_test_files).banner
      end

      should "show a banner notification on the page" do
        visit "/templates/wrapper.html.erb"
        assert page.has_selector? "#banner-notification.red"
        assert_match '<p>Everything is not fine</p>', page.body
      end
    end

    context "given view files are present for a black notification" do
      setup do
        create_test_file(filename: "banner_green.erb", content: '')
        create_test_file(filename: "banner_red.erb", content: '')
        create_test_file(filename: "banner_black.erb", content: '<p>RIP John Doe</p>')

        Static.banner = NotificationFileLookup.new(location_of_test_files).banner
      end

      should "show a banner notification on the page" do
        visit "/templates/wrapper.html.erb"
        assert page.has_selector? "#banner-notification.black"
        assert_match '<p>RIP John Doe</p>', page.body
      end
    end
  end
end
