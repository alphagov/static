require_relative "../../integration_test_helper"

class NonLayoutTemplatesTest < ActionDispatch::IntegrationTest
  def template_file(name)
    Rails.root.join("app", "views", "root", "#{name}.html.erb")
  end

  %w(
    campaign
    proposition_menu
  ).each do |template|
    should "not add a layout to the #{template} snippet" do
      get "/templates/#{template}.html.erb"

      refute_match '<html', last_response.body
    end
  end
end
