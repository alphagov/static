require 'test_helper'
require_relative '../../lib/emergency_banner/deploy'

describe 'emergency_banner' do
  should 'run the process to deploy the emergency banner' do
    EmergencyBanner::Deploy.any_instance.expects(:run)

    Rake::Task['emergency_banner:deploy'].invoke
  end
end
