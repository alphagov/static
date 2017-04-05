require 'test_helper'
require_relative '../../lib/emergency_banner'

describe "Emergency Banner" do
  should "return enabled is true when enabled key is true in Redis" do
    banner = EmergencyBanner.new
    Redis.any_instance.stubs(:get).with("emergency_banner:enabled").returns(true)

    assert banner.enabled?
  end

  should "return enabled is false when enabled key is false in Redis" do
    banner = EmergencyBanner.new
    Redis.any_instance.stubs(:get).with("emergency_banner:enabled").returns(false)

    refute banner.enabled?
  end

  should "return enabled is false when enabled key does not exist in Redis" do
    banner = EmergencyBanner.new
    Redis.any_instance.stubs(:get).with("emergency_banner:enabled").returns(nil)

    refute banner.enabled?
  end
end
