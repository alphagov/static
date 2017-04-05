require 'test_helper'
require_relative '../../lib/emergency_banner'

describe "Emergency Banner" do
  before do
    @banner = EmergencyBanner.new
  end

  context "#enabled?" do
    should "return enabled is true when all content for the emergency banner is set in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({
          campaign_class: "black",
        })

      assert @banner.enabled?
    end

    should "return enabled is false when the content for the emergency_banner is missing in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({
        campaign_class: ""
        })

      refute @banner.enabled?
    end

    should "return enabled is false when the emergency_banner is empty in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns({})

      refute @banner.enabled?
    end

    should "return enabled is false when the emergency_banner does not exist in Redis" do
      Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(nil)

      refute @banner.enabled?
    end
  end
end
