require_relative "../../integration_test_helper"

class WrapperTest < ActionDispatch::IntegrationTest
  should "render the template" do
    visit "/templates/wrapper.html.erb"

    within "head", visible: :all do
      assert page.has_selector?("title", text: "GOV.UK - The best place to find government services and information", visible: :all)

      assert page.has_selector?("link[href='/static/static.css']", visible: :all)
    end

    within "body" do
      within "header#global-header" do
        assert page.has_selector?("form#search")
      end

      assert page.has_selector?("#global-cookie-message")
      assert page.has_selector?("#user-satisfaction-survey-container")

      assert page.has_selector?("#wrapper")

      within "footer" do
        assert page.has_selector?(".footer-categories")

        assert page.has_selector?(".footer-meta")
      end
    end

    assert page.has_selector?("script[src='/static/libs/jquery/jquery-1.12.4.js']", visible: :all)
    assert page.has_selector?("script[src='/static/application.js']", visible: :all)
  end
end
