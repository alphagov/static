require_relative "../../integration_test_helper"

class Error4XXTest < ActionDispatch::IntegrationTest
  should "render the 404 template" do
    visit "/templates/404.html.erb"

    within "head", visible: :all do
      assert page.has_selector?("title", text: "Page not found - GOV.UK", visible: :all)
      assert page.has_selector?("link[href$='application.css']", visible: :all)
    end

    within "body" do
      assert page.has_selector?("#global-cookie-message")
      assert page.has_selector?("#user-satisfaction-survey-container")

      within "#content" do
        assert page.has_selector?("h1", text: "Page not found")
        assert page.has_selector?("pre", text: "Status code: 404", visible: :all)
      end

      within "footer" do
        assert page.has_selector?(".govuk-footer__navigation")
        assert page.has_selector?(".govuk-footer__meta")
      end
    end

    assert page.has_selector?("script[src$='application.js']", visible: :all)
  end
end
