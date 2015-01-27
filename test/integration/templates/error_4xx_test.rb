require_relative "../../integration_test_helper"

class Error4XXTest < ActionDispatch::IntegrationTest

  should "render the 404 template" do
    visit "/templates/404.html.erb"

    assert page.has_selector?("body.mainstream.error")
    within "head", :visible => :all do
      assert page.has_selector?("title", :text => "Page not found - 404 - GOV.UK", :visible => :all)

      assert page.has_selector?("link[href='/static/static.css']", :visible => :all)
    end

    within "body.mainstream.error" do
      within "header#global-header" do
        assert page.has_selector?("form#search")
      end

      assert page.has_selector?("#global-cookie-message")
      assert page.has_selector?("#user-satisfaction-survey-container")
      assert page.has_selector?("#global-breadcrumb")

      within "#wrapper" do
        assert page.has_selector?("h1", :text => "Page not found")
      end

      within "footer" do
        assert page.has_selector?(".footer-categories")

        assert page.has_selector?(".footer-meta")
      end

    end

    assert page.has_selector?("script[src='/static/libs/jquery/jquery-1.7.2.js']", :visible => :all)
    assert page.has_selector?("script[src='/static/application.js']", :visible => :all)
  end
end
