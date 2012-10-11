require 'integration_test_helper'

class NotificationsTest < ActionDispatch::IntegrationTest
	setup do
    NotificationFileLookup.banner_file = nil
	end

  context "banner notifications" do
    context "given view files are empty" do
      setup do
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
          .returns('')
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
          .returns('')
      end

      should "should not show a banner notification on the page" do
        visit "/templates/wrapper.html.erb"
        refute page.has_selector? "#banner-notification"
      end
    end

    context "given view files are present for a green notification" do
      setup do
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
          .returns('<p>Everything is fine</p>')
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
          .returns('')
      end

      context "given view files are present for a green notification" do
        setup do
          File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
            .returns('<p>Everything is fine</p>')
        end

        should "show a banner notification on the page" do
          visit "/templates/wrapper.html.erb"
          assert page.has_selector? "#banner-notification.green"
          assert_match '<p>Everything is fine</p>', page.body
        end
      end

      context "given view files are present for a red notification" do
        setup do
          File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
            .returns('<p>Everything is fine</p>')
        end

        should "show a banner notification on the page" do
          visit "/templates/wrapper.html.erb"
          assert page.has_selector? "#banner-notification.red"
          assert_match '<p>Everything is fine</p>', page.body
        end
      end
    end
  end

  context "campaign notifications" do
    context "given view files are empty" do
      setup do
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_green.erb")
          .returns('')
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_red.erb")
          .returns('')
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_black.erb")
          .returns('')
      end

      should "should not show a campaign notification on the page" do
        visit "/templates/campaign.html.erb"
        refute page.has_selector? "#campaign-notification"
      end
    end
  end
end
