require_relative "../integration_test_helper"

class TemplatesTest < ActionDispatch::IntegrationTest
  context "fetching templates" do
    should "be 200 for templates that exist" do
      %w[core_layout header_footer_only chromeless 404 406 500].each do |template|
        get "/templates/#{template}.html.erb"
        assert_equal 200, last_response.status
      end
    end

    should "return the rendered templates" do
      visit "/templates/core_layout.html.erb"
      assert_no_match(/<%/, page.source) # Should be no ERB tags
      assert page.has_selector?("#wrapper")
    end

    should "404 for non-existent templates" do
      get "/templates/fooey.html.erb"
      assert_equal 404, last_response.status

      get "/templates/related.html.erb"
      assert_equal 404, last_response.status
    end

    should "not allow direct access to partials" do
      get "/templates/_base.html.erb"
      assert_equal 404, last_response.status
    end
  end
end
