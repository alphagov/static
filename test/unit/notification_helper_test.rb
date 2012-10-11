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

      it "should have a section wrapper with the banner colour for a green notification" do
        NotificationFileLookup.stubs(:banner_content).returns("<p>You've got notifications!</p>")
        NotificationFileLookup.stubs(:banner_colour).returns(:green)

        assert_equal "<section class=\"green\" id=\"banner-notification\"><p>You've got notifications!</p></section>",
                     banner_notification
      end

      it "should have a section wrapper with the banner colour for a red notification" do
        NotificationFileLookup.stubs(:banner_content).returns("<p>You've got notifications!</p>")
        NotificationFileLookup.stubs(:banner_colour).returns(:red)

        assert_equal "<section class=\"red\" id=\"banner-notification\"><p>You've got notifications!</p></section>",
                     banner_notification
      end
    end
  end

  describe "campaign_notification" do
    it "should return an empty string if no campaign is present" do
      NotificationFileLookup.stubs(:campaign_content).returns(nil)
      assert_equal "", campaign_notification
    end

    describe "when a campaign is present" do
      it "should return a campaign notification" do
        NotificationFileLookup.stubs(:campaign_content).returns("<p>You've got notifications!</p>")
        assert_match "<p>You've got notifications!</p>", campaign_notification
      end

      it "should have a section wrapper with the campaign colour for a green notification" do
        NotificationFileLookup.stubs(:campaign_content).returns("<p>You've got notifications!</p>")
        NotificationFileLookup.stubs(:campaign_colour).returns(:green)

        assert_equal "<section class=\"green\" id=\"campaign-notification\"><p>You've got notifications!</p></section>",
                     campaign_notification
      end

      it "should have a section wrapper with the campaign colour for a red notification" do
        NotificationFileLookup.stubs(:campaign_content).returns("<p>You've got notifications!</p>")
        NotificationFileLookup.stubs(:campaign_colour).returns(:red)

        assert_equal "<section class=\"red\" id=\"campaign-notification\"><p>You've got notifications!</p></section>",
                     campaign_notification
      end

      it "should have a section wrapper with the campaign colour for a black notification" do
        NotificationFileLookup.stubs(:campaign_content).returns("<p>You've got notifications!</p>")
        NotificationFileLookup.stubs(:campaign_colour).returns(:black)

        assert_equal "<section class=\"black\" id=\"campaign-notification\"><p>You've got notifications!</p></section>",
                     campaign_notification
      end
    end
  end
end
