require_relative "../../integration_test_helper"

class HeaderFooterOnlyTest < ActionDispatch::IntegrationTest
  should "render the template" do
    visit "/templates/header_footer_only.html.erb"

    within "head", visible: :all do
      assert page.has_selector?("title", text: "GOV.UK - The best place to find government services and information", visible: :all)

      assert page.has_selector?("link[href$='header-footer-only.css']", visible: :all)
    end

    within "body" do
      within "header#global-header" do
        # assert page.has_selector?("form#search")
      end

      assert page.has_selector?("#global-cookie-message")
      assert page.has_selector?("#user-satisfaction-survey-container")

      assert page.has_selector?("#wrapper")

      within "footer" do
        assert page.has_selector?(".footer-categories")

        assert page.has_selector?(".footer-meta")
      end

      assert page.has_selector?("script[src$='header-footer-only.js']", visible: :all)
    end
  end
end
