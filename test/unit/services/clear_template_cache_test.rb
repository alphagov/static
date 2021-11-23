require "test_helper"

describe Services::ClearTemplateCache do
  context "#run!" do
    before do
      RootController::TEMPLATES.each do |template|
        ActionController::Base.stubs(:expire_page)
          .with("templates/#{template}.html.erb")
          .returns(nil)
      end
    end

    should "not raise an error" do
      Services::ClearTemplateCache.run!
    end
  end
end
