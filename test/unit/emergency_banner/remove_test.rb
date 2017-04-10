require 'test_helper'
require_relative '../../../lib/emergency_banner/remove'

describe "Emergency Banner::Deploy" do
  context "#run" do
    should "remove the emergency_banner hash from Redis" do
      Redis.any_instance.expects(:del).with(:emergency_banner)

      EmergencyBanner::Remove.new.run
    end
  end
end
