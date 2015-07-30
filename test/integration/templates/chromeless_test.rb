require_relative "../../integration_test_helper"

class ChromelessTest < ActionDispatch::IntegrationTest

  should "render the template" do
    visit "/templates/chromeless.html.erb"

    within "head", :visible => :all do
      assert page.has_selector?("title", :text => "GOV.UK - The best place to find government services and information", :visible => :all)

      assert page.has_selector?("link[href='/static/header-footer-only.css']", :visible => :all)
    end

    within "body" do
      refute page.has_selector?("#global-header")

      assert page.has_selector?("#global-cookie-message")

      assert page.has_selector?("#wrapper")

      within "footer" do
        refute page.has_selector?(".footer-categories")

        assert page.has_selector?(".footer-meta")
      end

      assert page.has_selector?("script[src='/static/libs/jquery/jquery-1.11.3.js']", :visible => :all)
      assert page.has_selector?("script[src='/static/header-footer-only.js']", :visible => :all)
    end
  end
end
