require "test_helper"

describe "templates_cache:clear" do
  before do
    Rake::Task["templates_cache:clear"].reenable
  end

  should "run the process to purge the template cache" do
    Services::ClearTemplateCache.expects(:run!)
    Rake::Task["templates_cache:clear"].invoke
  end
end
