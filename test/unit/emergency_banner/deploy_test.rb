require "test_helper"
require_relative "../../../lib/emergency_banner/deploy"

describe "Emergency Banner::Deploy" do
  context "#run" do
    should "create an emergency_banner hash in Redis with a campaign_class and a heading" do
      Redis.any_instance.expects(:hmset).with(
        :emergency_banner,
        :campaign_class,
        "notable-death",
        :heading,
        "A title",
        :short_description,
        "",
        :link,
        "",
        :link_text,
        "",
      )

      EmergencyBanner::Deploy.new.run("notable-death", "A title")
    end

    should "create an emergency_banner with a campaign_class, heading and short_description" do
      Redis.any_instance.expects(:hmset).with(
        :emergency_banner,
        :campaign_class,
        "notable-death",
        :heading,
        "A title",
        :short_description,
        "A short description of the event",
        :link,
        "",
        :link_text,
        "",
      )

      EmergencyBanner::Deploy.new.run("notable-death", "A title", "A short description of the event")
    end

    should "create an emergency_banner with a campaign_class, heading and link" do
      Redis.any_instance.expects(:hmset).with(
        :emergency_banner,
        :campaign_class,
        "notable-death",
        :heading,
        "A title",
        :short_description,
        "",
        :link,
        "https://www.gov.uk",
        :link_text,
        "",
      )

      EmergencyBanner::Deploy.new.run("notable-death", "A title", "", "https://www.gov.uk")
    end

    should "create an emergency_banner with a campaign_class, heading, short_description and link" do
      Redis.any_instance.expects(:hmset).with(
        :emergency_banner,
        :campaign_class,
        "notable-death",
        :heading,
        "A title",
        :short_description,
        "A short description of the event",
        :link,
        "https://www.gov.uk",
        :link_text,
        "",
      )

      EmergencyBanner::Deploy.new.run("notable-death", "A title", "A short description of the event", "https://www.gov.uk")
    end

    should "create an emergency_banner with a campaign_class, heading, short_description, link and link_text" do
      Redis.any_instance.expects(:hmset).with(
        :emergency_banner,
        :campaign_class,
        "notable-death",
        :heading,
        "A title",
        :short_description,
        "A short description of the event",
        :link,
        "https://www.gov.uk",
        :link_text,
        "Text for hyperlink",
      )

      EmergencyBanner::Deploy.new.run("notable-death", "A title", "A short description of the event", "https://www.gov.uk", "Text for hyperlink")
    end

    should "raise an exception if the input for the link doesn't pass validation" do
      exception = assert_raises ArgumentError do
        EmergencyBanner::Deploy.new.run(
          "notable-death",
          "A title",
          "A short description of the event",
          "https:/www.gov.uk", # spot the deliberate error!
          "Text for hyperlink",
        )
      end
      assert_equal("Invalid URL provided: https:/www.gov.uk", exception.message)
    end
  end
end
