require "test_helper"
require_relative "../../../lib/emergency_banner/display"

# rubocop:disable Rails/RefuteMethods
describe "Emergency Banner::Display" do
  before do
    @banner = EmergencyBanner::Display.new
  end

  context ".client" do
    context "when the EMERGENCY_BANNER_REDIS_URL environment variable has been set" do
      should "use that value as the URL for the Redis client" do
        mock_env("EMERGENCY_BANNER_REDIS_URL" => "redis://emergency-banner") do
          EmergencyBanner::Display.instance_variable_set(:@client, nil)

          Redis.expects(:new).with(
            url: "redis://emergency-banner",
            reconnect_attempts: [
              15,
              30,
              45,
              60,
            ],
          )

          EmergencyBanner::Display.client
        end
      end
    end

    context "when the EMERGENCY_BANNER_REDIS_URL environment variable has not been set" do
      should "use the default REDIS_URL as the URL for the Redis client" do
        mock_env({
          "EMERGENCY_BANNER_REDIS_URL" => nil,
          "REDIS_URL" => "redis://my-redis-url",
        }) do
          EmergencyBanner::Display.instance_variable_set(:@client, nil)

          Redis.expects(:new).with(
            url: "redis://my-redis-url",
            reconnect_attempts: [
              15,
              30,
              45,
              60,
            ],
          )

          EmergencyBanner::Display.client
        end
      end
    end
  end

  context "#enabled?" do
    should "return enabled is false when redis connection times out and send an error notification" do
      err = Redis::CannotConnectError.new("Timed out connecting to Redis")
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").raises(err)

      GovukError.expects(:notify).with(err)
      refute @banner.enabled?
    end

    should "return enabled is true when all content for the emergency banner is set in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        heading: "Emergency!",
        campaign_class: "notable-death",
      )

      assert @banner.enabled?
    end

    should "return enabled is false when the heading is not present" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        campaign_class: "a colour",
        heading: "",
      )

      refute @banner.enabled?
    end

    should "return enabled is false when the campaign_class for the emergency_banner is missing in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        campaign_class: "",
        heading: "a heading",
      )

      refute @banner.enabled?
    end

    should "return enabled is false when the campaign_class and the heading are empty" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        campaign_class: "",
        heading: "",
      )

      refute @banner.enabled?
    end
    should "return enabled is false when the emergency_banner is empty in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({})

      refute @banner.enabled?
    end

    should "return enabled is false when the heading is present but campaign class is not" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        heading: "a heading",
      )

      refute @banner.enabled?
    end

    should "return enabled is false when the campaign_class is present but heading class is not" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        campaign_class: "a heading",
      )

      refute @banner.enabled?
    end

    should "return enabled is false when the emergency_banner does not exist in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(nil)

      refute @banner.enabled?
    end
  end

  context "content" do
    should "return the heading as An Emergency" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        heading: "An Emergency",
      )

      assert_equal "An Emergency", @banner.heading
    end

    should "return the campaign class as local-emergency" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        campaign_class: "local-emergency",
      )

      assert_equal "local-emergency", @banner.campaign_class
    end

    should "return the short description if it is present" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        short_description: "the short description",
      )

      assert_equal "the short description", @banner.short_description
    end

    should "return nil for the short description if it is empty" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        short_description: "",
      )

      assert_nil @banner.short_description
    end

    should "return the link if it is present" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        link: "https://gov.uk",
      )

      assert_equal "https://gov.uk", @banner.link
    end

    should "return nil for the link if it is empty" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        link: "",
      )

      assert_nil @banner.link
    end

    should "return the link_text if there is a link and the link_text it is present" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        link: "https://www.gov.uk",
        link_text: "More information link text",
      )

      assert_equal "More information link text", @banner.link_text
    end

    should "return nil for the link_text if there is no link, even if link_text is present" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(
        link: "",
        link_text: "More information link text",
      )

      assert_nil @banner.link_text
    end

    should "return nil for the short description, link and link_text if they are not present in redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({})

      assert_nil @banner.short_description
      assert_nil @banner.link
      assert_nil @banner.link_text
    end
  end

  def mock_env(partial_env_hash)
    old_env = ENV.to_hash
    ENV.update partial_env_hash
    begin
      yield
    ensure
      ENV.replace old_env
    end
  end
end
# rubocop:enable Rails/RefuteMethods
