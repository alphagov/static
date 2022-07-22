require "test_helper"
require_relative "../../lib/emergency_banner/deploy"
require_relative "../../lib/emergency_banner/remove"
Rails.application.load_tasks

describe "emergency_banner:deploy" do
  before do
    Rake::Task["emergency_banner:deploy"].reenable
  end

  should "run the process to deploy the emergency banner" do
    EmergencyBanner::Deploy.any_instance.expects(:run)

    Rake::Task["emergency_banner:deploy"].invoke("campaign class", "heading")
  end

  should "raise an error if a campaign class parameter is not present" do
    assert_raises ArgumentError do
      Rake::Task["emergency_banner:deploy"].invoke
    end
  end

  should "raise an error if a campaign class parameter is present but a heading is not" do
    assert_raises ArgumentError do
      Rake::Task["emergency_banner:deploy"].invoke("campaign class")
    end
  end

  should "allow the short description and link to be passed to the rake task" do
    EmergencyBanner::Deploy.any_instance.expects(:run)

    Rake::Task["emergency_banner:deploy"].invoke("campaign class", "heading", "short description", "link")
  end

  should "pass all supplied parameters to the deploy job" do
    EmergencyBanner::Deploy.any_instance.expects(:run).with("campaign class", "heading", "short description", "link", "link_text")

    Rake::Task["emergency_banner:deploy"].invoke("campaign class", "heading", "short description", "link", "link_text")
  end
end

describe "emergency_banner:remove" do
  should "run the process to remove the emergency banner" do
    EmergencyBanner::Remove.any_instance.expects(:run)

    Rake::Task["emergency_banner:remove"].invoke
  end
end
