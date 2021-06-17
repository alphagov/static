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

    should "contain real user metrics loader script" do
      visit "/templates/core_layout.html.erb"
      assert page.has_selector?("html > head > script[src*='govuk_publishing_components/rum-loader']", visible: :all)
    end

    should "not contain real user metrics scripts before cookie banner interacted with" do
      Capybara.current_driver = Capybara.javascript_driver

      visit "/templates/core_layout.html.erb"

      assert page.has_selector?("html > head > script[src*='govuk_publishing_components/rum-loader']", visible: :all)
      assert page.has_no_selector?("html > head > script[src*='govuk_publishing_components/vendor/lux/lux']", visible: :all)
      assert page.has_no_selector?("html > head > script[src*='govuk_publishing_components/vendor/lux/lux-polyfill']", visible: :all)
    end

    should "not contain real user metrics scripts on the page where cookies are accepted" do
      Capybara.current_driver = Capybara.javascript_driver

      visit "/templates/core_layout.html.erb"

      click_button "Accept additional cookies"

      assert page.has_selector?("html > head > script[src*='govuk_publishing_components/rum-loader']", visible: :all)
      assert page.has_no_selector?("html > head > script[src*='govuk_publishing_components/vendor/lux/lux']", visible: :all)
      assert page.has_no_selector?("html > head > script[src*='govuk_publishing_components/vendor/lux/lux-polyfill']", visible: :all)
    end

    should "contain real user metrics scripts on page after cookies opted in" do
      Capybara.current_driver = Capybara.javascript_driver

      visit "/templates/core_layout.html.erb"

      click_button "Accept additional cookies"

      visit "/templates/core_layout.html.erb"

      assert page.has_selector?("html > head > script[src*='govuk_publishing_components/rum-loader']", visible: :all)
      assert page.has_selector?("html > head > script[src*='govuk_publishing_components/vendor/lux/lux']", visible: :all)
      assert page.has_selector?("html > head > script[src*='govuk_publishing_components/vendor/lux/lux-polyfill']", visible: :all)
    end

    should "not contain real user metrics scripts on page after cookies opted out" do
      Capybara.current_driver = Capybara.javascript_driver

      visit "/templates/core_layout.html.erb"

      click_button "Reject additional cookies"

      visit "/templates/core_layout.html.erb"

      assert page.has_selector?("html > head > script[src*='govuk_publishing_components/rum-loader']", visible: :all)
      assert page.has_no_selector?("html > head > script[src*='govuk_publishing_components/vendor/lux/lux']", visible: :all)
      assert page.has_no_selector?("html > head > script[src*='govuk_publishing_components/vendor/lux/lux-polyfill']", visible: :all)
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
