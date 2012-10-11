require 'integration_test_helper'

class NotificationsTest < ActionDispatch::IntegrationTest
	setup do
    NotificationFileLookup.banner_file = nil
	end

  context "given view files are empty" do
  	setup do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
				.returns('')
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('')
  	end

  	should "should not show a banner notification on the page" do
	    visit "/templates/wrapper.html.erb"
	    refute page.has_selector? "#banner-notification"
	  end
	end

	context "given view files are present for a category one notification" do
		setup do
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
				.returns('<p>Everything is fine</p>')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('')
		end

    context "given view files are present for a category one notification" do
      setup do
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
          .returns('<p>Everything is fine</p>')
      end

      should "show a banner notification on the page" do
        visit "/templates/wrapper.html.erb"
        assert page.has_selector? "#banner-notification.category-1"
        assert_match '<p>Everything is fine</p>', page.body
      end
    end

    context "given view files are present for a category two notification" do
      setup do
        File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
          .returns('<p>Everything is fine</p>')
      end

      should "show a banner notification on the page" do
        visit "/templates/wrapper.html.erb"
        assert page.has_selector? "#banner-notification.category-2"
        assert_match '<p>Everything is fine</p>', page.body
      end
    end
  end
end
