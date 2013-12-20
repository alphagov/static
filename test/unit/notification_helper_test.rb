require 'test_helper'

describe "Notification Helper" do
  include NotificationHelper

  describe "banner_notification" do
    it "should return an empty string if no banner is present" do
      NotificationFileLookup.any_instance.stubs(:banner).returns(nil)
      assert_equal "", banner_notification
    end

    describe "when a banner is present" do
      it "should return a banner notification" do
        banner = {:file => "<p>You've got notifications!</p>", :colour => :green}
        NotificationFileLookup.any_instance.stubs(:banner).returns(banner)
        assert_match "<p>You've got notifications!</p>", banner_notification
      end

      it "should have a section wrapper with the banner colour for a green notification" do
        banner = {:file => "<p>You've got notifications!</p>", :colour => :green}
        NotificationFileLookup.any_instance.stubs(:banner).returns(banner)

        assert_equal "<section class=\"green\" id=\"banner-notification\"><div><p>You've got notifications!</p></div></section>",
                     banner_notification
      end

      it "should have a section wrapper with the banner colour for a red notification" do
        banner = {:file => "<p>You've got notifications!</p>", :colour => :red}
        NotificationFileLookup.any_instance.stubs(:banner).returns(banner)

        assert_equal "<section class=\"red\" id=\"banner-notification\"><div><p>You've got notifications!</p></div></section>",
                     banner_notification
      end
    end
  end
end
