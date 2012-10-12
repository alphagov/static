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
        campaign = {:file => "<p>You've got notifications!</p>", :colour => :green}
        NotificationFileLookup.any_instance.stubs(:banner).returns(campaign)
        assert_match "<p>You've got notifications!</p>", banner_notification
      end

      it "should have a section wrapper with the banner colour for a green notification" do
        campaign = {:file => "<p>You've got notifications!</p>", :colour => :green}
        NotificationFileLookup.any_instance.stubs(:banner).returns(campaign)

        assert_equal "<section class=\"green\" id=\"banner-notification\"><div><p>You've got notifications!</p></div></section>",
                     banner_notification
      end

      it "should have a section wrapper with the banner colour for a red notification" do
        campaign = {:file => "<p>You've got notifications!</p>", :colour => :red}
        NotificationFileLookup.any_instance.stubs(:banner).returns(campaign)

        assert_equal "<section class=\"red\" id=\"banner-notification\"><div><p>You've got notifications!</p></div></section>",
                     banner_notification
      end
    end
  end

  describe "campaign_notification" do
    it "should return an empty string if no campaign is present" do
      NotificationFileLookup.any_instance.stubs(:campaign).returns(nil)
      assert_equal "", campaign_notification
    end

    describe "when a campaign is present" do
      it "should return a campaign notification" do
        campaign = {:file => "<p>You've got notifications!</p>", :colour => :green}
        NotificationFileLookup.any_instance.stubs(:campaign).returns(campaign)
        assert_match "<p>You've got notifications!</p>", campaign_notification
      end

      it "should have a section wrapper with the campaign colour for a green notification" do
        campaign = {:file => "<p>You've got notifications!</p>", :colour => :green}
        NotificationFileLookup.any_instance.stubs(:campaign).returns(campaign)

        assert_equal "<section class=\"green\" id=\"campaign-notification\"><div><p>You've got notifications!</p></div></section>",
                     campaign_notification
      end

      it "should have a section wrapper with the campaign colour for a red notification" do
        campaign = {:file => "<p>You've got notifications!</p>", :colour => :red}
        NotificationFileLookup.any_instance.stubs(:campaign).returns(campaign)

        assert_equal "<section class=\"red\" id=\"campaign-notification\"><div><p>You've got notifications!</p></div></section>",
                     campaign_notification
      end

      it "should have a section wrapper with the campaign colour for a black notification" do
        campaign = {:file => "<p>You've got notifications!</p>", :colour => :black}
        NotificationFileLookup.any_instance.stubs(:campaign).returns(campaign)

        assert_equal "<section class=\"black\" id=\"campaign-notification\"><div><p>You've got notifications!</p></div></section>",
                     campaign_notification
      end
    end
  end
end
