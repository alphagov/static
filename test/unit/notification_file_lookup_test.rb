require 'test_helper'
require_relative '../../lib/notification_file_lookup'

describe NotificationFileLookup do
  describe "banner" do
    before do
      NotificationFileLookup.instance.banner = nil
    end

    it "returns nil if both banner content files are empty" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
        .returns('')
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
        .returns('')

      assert_nil NotificationFileLookup.instance.banner
    end

    it "returns the red banner content if present" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
        .returns('<p>Keep calm and carry on.</p>')

      expected = {:file => "<p>Keep calm and carry on.</p>", :colour => :red}
      assert_equal expected, NotificationFileLookup.instance.banner
    end

    it "opens banner content file only once" do
      File.expects(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
        .returns('Test')
      File.expects(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
        .returns('')

      expected = {:file => "Test", :colour => :green}
      3.times do
        assert_equal expected, NotificationFileLookup.instance.banner
      end
    end

    it "returns nil if the banner content only contains whitespace" do
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
        .returns("\n\n\r\n\r\n\n\n")
      File.stubs(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
        .returns('')

      assert_nil NotificationFileLookup.instance.banner
    end

    it "falls back to green if the red file is empty" do
      File.expects(:read).with("#{Rails.root}/app/views/notifications/banner_green.erb")
        .returns('<p>Nothing to see here.</p>')
      File.expects(:read).with("#{Rails.root}/app/views/notifications/banner_red.erb")
        .returns('')

      expected = {:file => "<p>Nothing to see here.</p>", :colour => :green}
      assert_equal expected, NotificationFileLookup.instance.banner
    end
  end
end
