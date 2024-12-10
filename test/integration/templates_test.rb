require_relative "../integration_test_helper"

class TemplatesTest < ActionDispatch::IntegrationTest
  context "fetching templates" do
    should "be 200 for templates that exist" do
      %w[gem_layout scheduled_maintenance].each do |template|
        get "/templates/#{template}.html.erb"
        assert_equal 200, last_response.status
      end
    end

    should "404 for non-existent templates" do
      get "/templates/fooey.html.erb"
      assert_equal 404, last_response.status

      get "/templates/related.html.erb"
      assert_equal 404, last_response.status
    end

    should "not allow direct access to partials" do
      get "/templates/_gem_base.html.erb"
      assert_equal 404, last_response.status
    end
  end
end
