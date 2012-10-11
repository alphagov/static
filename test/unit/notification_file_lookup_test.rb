require 'test_helper'

describe NotificationFileLookup do
	describe "banner_content" do
		before do
			NotificationFileLookup.banner_file = nil
		end

		it "returns nil if both banner content files are empty" do
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
				.returns('')
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
				.returns('')

			assert_nil NotificationFileLookup.banner_content
		end

		it "returns the red banner content if present" do
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
				.returns('<p>Keep calm and carry on.</p>')

			assert_equal "<p>Keep calm and carry on.</p>", NotificationFileLookup.banner_content
		end

		it "opens banner content file only once" do
			File.expects(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
				.returns('Test')
			File.expects(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
				.returns('')

			3.times do
				assert_equal "Test", NotificationFileLookup.banner_content
			end
		end

		it "returns nil if the banner content only contains whitespace" do
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
				.returns("\n\n\r\n\r\n\n\n")
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
				.returns('')

			assert_nil NotificationFileLookup.banner_content
		end

		it "falls back to green if the red file is empty" do
      File.expects(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
				.returns('<p>Nothing to see here.</p>')
      File.expects(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
				.returns('')

			assert_equal "<p>Nothing to see here.</p>", NotificationFileLookup.banner_content
		end
	end

  describe "banner colour" do
  	before do
  		NotificationFileLookup.banner_file = nil
  	end

    it "should return nil if both banner files are blank" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
				.returns('')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
				.returns('')

      assert_nil NotificationFileLookup.banner_colour
    end

    it "should return :green if the red file is empty and the green file is not empty" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
				.returns('<p>Green message</p>')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
				.returns('')

      assert_equal :green, NotificationFileLookup.banner_colour
    end

    it "should return :red if the red file is not empty and the green file is empty" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
			  .returns('')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
				.returns('<p>Red message</p>')

      assert_equal :red, NotificationFileLookup.banner_colour
    end

    it "should return :red if both red and green files are not empty" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
				.returns('<p>One</p>')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
				.returns('<p>Two</p>')

      assert_equal :red, NotificationFileLookup.banner_colour
    end
  end

  describe "campaign_content" do
    before do
			NotificationFileLookup.campaign_file = nil
		end

    it "returns nil if all three campaign content files are empty" do
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_green.erb")
				.returns('')
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_red.erb")
				.returns('')
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_black.erb")
				.returns('')

			assert_nil NotificationFileLookup.campaign_content
		end

    it "returns the black campaign content if present" do
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_black.erb")
				.returns('<p>Black message.</p>')

			assert_equal "<p>Black message.</p>", NotificationFileLookup.campaign_content
		end

		it "opens each campaign content file only once" do
			File.expects(:read).with("#{Rails.root}/app/views/notifications/campaign_green.erb")
				.returns('Test')
			File.expects(:read).with("#{Rails.root}/app/views/notifications/campaign_red.erb")
				.returns('')
      File.expects(:read).with("#{Rails.root}/app/views/notifications/campaign_black.erb")
				.returns('')

			3.times do
				assert_equal "Test", NotificationFileLookup.campaign_content
			end
		end

		it "returns nil if the campaign content only contains whitespace" do
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_green.erb")
				.returns("\n\n\r\n\r\n\n\n")
			File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_red.erb")
				.returns('')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_black.erb")
				.returns("\n\n\r\n\r\n\n\n")

			assert_nil NotificationFileLookup.campaign_content
		end

		it "falls back to green if the red and black files are empty" do
      File.expects(:read).with("#{Rails.root}/app/views/notifications/campaign_green.erb")
				.returns('<p>Nothing to see here.</p>')
      File.expects(:read).with("#{Rails.root}/app/views/notifications/campaign_red.erb")
				.returns('')
      File.expects(:read).with("#{Rails.root}/app/views/notifications/campaign_black.erb")
				.returns('')

			assert_equal "<p>Nothing to see here.</p>", NotificationFileLookup.campaign_content
		end
  end

  describe "campaign colour" do
  	before do
  		NotificationFileLookup.campaign_file = nil
  	end

    it "should return nil if all three campaign files are blank" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_green.erb")
				.returns('')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_red.erb")
				.returns('')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_black.erb")
				.returns('')

      assert_nil NotificationFileLookup.campaign_colour
    end

    it "should return :green if the red and black files are empty and the green file is not empty" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_green.erb")
				.returns('<p>Green message</p>')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_red.erb")
				.returns('')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_black.erb")
				.returns('')

      assert_equal :green, NotificationFileLookup.campaign_colour
    end

    it "should return :red if the red file is not empty and the green and black files are empty" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_green.erb")
			  .returns('')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_red.erb")
				.returns('<p>Red message</p>')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_black.erb")
				.returns('')

      assert_equal :red, NotificationFileLookup.campaign_colour
    end

    it "should return :black if the black file is not empty and the red and black files are empty" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_green.erb")
			  .returns('')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_red.erb")
				.returns('')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_black.erb")
				.returns('<p>Black message</p>')

      assert_equal :black, NotificationFileLookup.campaign_colour
    end

    it "should return :black if all black, red and green files are not empty" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_green.erb")
				.returns('<p>One</p>')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_red.erb")
				.returns('<p>Two</p>')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/campaign_black.erb")
				.returns('<p>Three</p>')

      assert_equal :black, NotificationFileLookup.campaign_colour
    end
  end
end
