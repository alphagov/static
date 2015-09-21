require 'test_helper'

describe "Notification Helper" do
  include NotificationHelper

  describe "banner_notification" do
    before do
      @original_banner = Static.banner
    end

    after do
      Static.banner = @original_banner
    end

    it "should return an empty string if no banner is present" do
      Static.banner = nil
      assert_equal "", banner_notification
    end

    describe "when a banner is present" do
      it "should return a banner notification" do
        Static.banner = {:file => "<p>You've got notifications!</p>", :colour => :green}
        assert_match "<p>You've got notifications!</p>", banner_notification
      end

      it "should have a section wrapper with the banner colour for a green notification" do
        Static.banner = {:file => "<p>You've got notifications!</p>", :colour => :green}
        banner_section = Nokogiri::HTML(banner_notification).css("section").first

        assert_equal "green", banner_section["class"]
        assert_equal "banner-notification", banner_section["id"]
        assert_equal "You've got notifications!", banner_section.text
      end

      it "should have a section wrapper with the banner colour for a red notification" do
        Static.banner = {:file => "<p>You've got notifications!</p>", :colour => :red}
        banner_section = Nokogiri::HTML(banner_notification).css("section").first

        assert_equal "red", banner_section["class"]
        assert_equal "banner-notification", banner_section["id"]
        assert_equal "You've got notifications!", banner_section.text
      end
    end
  end
end
