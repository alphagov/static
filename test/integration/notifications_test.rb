require 'integration_test_helper'

class NotificationsTest < ActionDispatch::IntegrationTest
  setup do
    @original_banner = Static.banner
  end

  teardown do
    Static.banner = @original_banner
  end

  context "banner files" do
    should "have a green file" do
      assert File.exist? "#{Rails.root}/app/views/notifications/banner_green.erb"
    end

    should "have a red file" do
      assert File.exist? "#{Rails.root}/app/views/notifications/banner_red.erb"
    end
  end

  context "banner notifications" do
    context "given view files are empty" do
      setup do
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
          .returns('')
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
          .returns('')

        Static.banner = NotificationFileLookup.new.banner
      end

      should "not show a banner notification on the page" do
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

        Static.banner = NotificationFileLookup.new.banner
      end

      should "show a banner notification on the page" do
        visit "/templates/wrapper.html.erb"
        assert page.has_selector? "#banner-notification.green"
        assert_match '<p>Everything is fine</p>', page.body
      end
    end

    context "given view files are present for a red notification" do
      setup do
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
          .returns('')
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
          .returns('<p>Everything is not fine</p>')

        Static.banner = NotificationFileLookup.new.banner
      end

      should "show a banner notification on the page" do
        visit "/templates/wrapper.html.erb"
        assert page.has_selector? "#banner-notification.red"
        assert_match '<p>Everything is not fine</p>', page.body
      end
    end
  end
end
