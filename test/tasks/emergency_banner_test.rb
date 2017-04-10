require 'test_helper'
require_relative '../../lib/emergency_banner/deploy'

describe 'emergency_banner' do
  before do
    Rake::Task['emergency_banner:deploy'].reenable
  end

  should 'run the process to deploy the emergency banner' do
    EmergencyBanner::Deploy.any_instance.expects(:run)

    Rake::Task['emergency_banner:deploy'].invoke('campaign class', 'heading')
  end

  should 'raise an error if a campaign class parameter is not present' do
    assert_raises ArgumentError do
      Rake::Task['emergency_banner:deploy'].invoke
    end
  end

  should 'raise an error if a campaign class parameter is present but a heading is not' do
    assert_raises ArgumentError do
      Rake::Task['emergency_banner:deploy'].invoke('campaign class')
    end
  end
end
