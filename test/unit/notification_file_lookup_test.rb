require 'test_helper'

describe NotificationFileLookup do
	describe "banner content" do
		before do
			NotificationFileLookup.banner_file = nil
		end

		it "returns nil if the banner content file is empty" do
			File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner.erb")
				.returns('')
			assert_nil NotificationFileLookup.banner_content
		end

		it "returns the banner content if present" do
			File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner.erb")
				.returns('<p>Keep calm and carry on.</p>')
			assert_equal "<p>Keep calm and carry on.</p>", NotificationFileLookup.banner_content
		end

		it "opens banner content file only once" do
			File.expects(:open).with("#{Rails.root}/app/views/notifications/banner.erb")
				.returns('Test')

			3.times do
				assert_equal "Test", NotificationFileLookup.banner_content
			end
		end

		it "returns nil if the banner content only contains whitespace" do
			File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner.erb")
				.returns("\n\n\r\n\r\n\n\n")
			assert_nil NotificationFileLookup.banner_content
		end
	end
end
