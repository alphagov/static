require 'test_helper'

describe "Notification Helper" do
  include NotificationHelper

  describe "banner_notification" do
    it "should return an empty string if no banner is present" do
      NotificationFileLookup.stubs(:banner_content).returns(nil)
      assert_equal "", banner_notification
    end

    describe "when a banner is present" do
      it "should return a banner notification" do
        NotificationFileLookup.stubs(:banner_content).returns("<p>You've got notifications!</p>")
        assert_match "<p>You've got notifications!</p>", banner_notification
      end

      it "should have a section wrapper with the banner category" do
        NotificationFileLookup.stubs(:banner_content).returns("<p>You've got notifications!</p>")
        NotificationFileLookup.stubs(:banner_colour).returns(:green)

        assert_equal "<section class=\"green\" id=\"banner-notification\"><p>You've got notifications!</p></section>",
                     banner_notification
      end
    end
  end
end
