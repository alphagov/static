require 'integration_test_helper'

class NotificationsTest < ActionDispatch::IntegrationTest
	setup do
		NotificationFileLookup.banner_file = nil
	end

  context "given view files are empty" do
  	setup do
  		File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
				.returns('')
			File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('')
  	end

  	should "should not show a banner notification on the page" do
	    visit "/templates/wrapper.html.erb"
	    refute page.has_selector? "#banner-notification"
	  end
	end

	context "given view files are present for a category one notification" do
		setup do
			File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
				.returns('<p>Everything is fine</p>')
		end

		should "show a banner notification on the page" do
			visit "/templates/wrapper.html.erb"
	    assert page.has_selector? "#banner-notification"
		end
	end
end
