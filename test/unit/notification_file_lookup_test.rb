require 'test_helper'

describe NotificationFileLookup do
	describe "banner content" do
		before do
			NotificationFileLookup.banner_file = nil
		end

		it "returns nil if both banner content files are empty" do
			File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
				.returns('')
			File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('')

			assert_nil NotificationFileLookup.banner_content
		end

		it "returns the category 2 banner content if present" do
			File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('<p>Keep calm and carry on.</p>')

			assert_equal "<p>Keep calm and carry on.</p>", NotificationFileLookup.banner_content
		end

		it "opens banner content file only once" do
			File.expects(:open).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
				.returns('Test')
			File.expects(:open).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('')

			3.times do
				assert_equal "Test", NotificationFileLookup.banner_content
			end
		end

		it "returns nil if the banner content only contains whitespace" do
			File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
				.returns("\n\n\r\n\r\n\n\n")
			File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('')

			assert_nil NotificationFileLookup.banner_content
		end

		it "falls back to banner category 1 if the category 2 file is empty" do
      File.expects(:open).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
				.returns('<p>Nothing to see here.</p>')
      File.expects(:open).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('')

			assert_equal "<p>Nothing to see here.</p>", NotificationFileLookup.banner_content
		end
	end

  describe "banner category" do
  	before do
  		NotificationFileLookup.banner_file = nil
  	end

    it "should return nil if both banner files are blank" do
      File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
				.returns('')
      File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('')

      assert_nil NotificationFileLookup.banner_category
    end

    it "should return :category_1 if the category two file is empty and the category one file is not empty" do
      File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
				.returns('<p>Category one message</p>')
      File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('')

      assert_equal :category_1, NotificationFileLookup.banner_category
    end

    it "should return :category_2 if a category two file is not empty and the category one file is empty" do
      File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
			  .returns('')
      File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('<p>Meh</p>')

      assert_equal :category_2, NotificationFileLookup.banner_category
    end

    it "should return :category_2 if both category two and category one files are not empty" do
      File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_1.erb")
				.returns('<p>One</p>')
      File.stubs(:open).with("#{Rails.root}/app/views/notifications/banner_category_2.erb")
				.returns('<p>Two</p>')

      assert_equal :category_2, NotificationFileLookup.banner_category
    end
  end
end
