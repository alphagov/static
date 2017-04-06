require 'test_helper'
require_relative '../../lib/emergency_banner'

describe "Emergency Banner" do
  before do
    @banner = EmergencyBanner.new
  end

  context "#enabled?" do
    should "return enabled is true when all content for the emergency banner is set in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({
        heading: "Emergency!",
        campaign_class: "black",
        })

      assert @banner.enabled?
    end

    should "return enabled is false when the heading is not present" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({
        campaign_class: "a colour",
        heading: "",
        })

      refute @banner.enabled?
    end

    should "return enabled is false when the campaign_class for the emergency_banner is missing in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({
        campaign_class: "",
        heading: "a heading",
        })

      refute @banner.enabled?
    end

    should "return enabled is false when the campaign_class and the heading are empty" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({
        campaign_class: "",
        heading: "",
        })

      refute @banner.enabled?
    end
    should "return enabled is false when the emergency_banner is empty in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({})

      refute @banner.enabled?
    end

    should "return enabled is false when the heading is present but campaign class is not" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({
        heading: "a heading",
      })

      refute @banner.enabled?
    end

    should "return enabled is false when the campaign_class is present but heading class is not" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({
        campaign_class: "a heading",
      })

      refute @banner.enabled?
    end

    should "return enabled is false when the emergency_banner does not exist in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(nil)

      refute @banner.enabled?
    end
  end
end
