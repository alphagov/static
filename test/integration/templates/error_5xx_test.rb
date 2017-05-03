require_relative "../../integration_test_helper"

class Error5XXTest < ActionDispatch::IntegrationTest
  should "render the 500 template" do
    visit "/templates/500.html.erb"

    assert page.has_selector?("body.mainstream.error")
    within "head", visible: :all do
      assert page.has_selector?("title", text: "Sorry, we're experiencing technical difficulties (500 error) - GOV.UK", visible: :all)

      assert page.has_selector?("link[href='/static/static.css']", visible: :all)
    end

    within "body.mainstream.error" do
      within "header#global-header" do
        assert page.has_selector?("form#search")
      end

      assert page.has_selector?("#global-cookie-message")
      assert page.has_selector?("#user-satisfaction-survey-container")

      within "#wrapper" do
        assert page.has_selector?("h1", text: "Sorry, we're experiencing technical difficulties")
      end

      within "footer" do
        assert page.has_selector?(".footer-categories")

        assert page.has_selector?(".footer-meta")
      end
    end

    assert page.has_selector?("script[src='/static/libs/jquery/jquery-1.11.3.js']", visible: :all)
    assert page.has_selector?("script[src='/static/application.js']", visible: :all)
  end
end
