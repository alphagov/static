require_relative "../integration_test_helper"

class TemplatesTest < ActionDispatch::IntegrationTest
  context "fetching templates" do
    should "be 200 for templates that exist" do
      %w(wrapper header_footer_only chromeless 404 406 500).each do |template|
        get "/templates/#{template}.html.erb"
        assert_equal 200, last_response.status
      end
    end

    should "return the rendered templates" do
      visit "/templates/wrapper.html.erb"
      refute_match(/<%/, page.source) # Should be no ERB tags
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

  context "fetching raw templates" do
    should "be 200 for templates that exist" do
      %w(report_a_problem).each do |template|
        get "/templates/#{template}.raw.html.erb"
        assert_equal 200, last_response.status
      end
    end

    should "404 for non-existent templates" do
      get "/templates/foo.raw.html.erb"
      assert_equal 404, last_response.status

      get "/templates/wrapper.raw.html.erb"
      assert_equal 404, last_response.status
    end

    should "return the raw component files" do
      get "/templates/govuk_component/beta_label.raw.html.erb"
      expected = File.read(Rails.root.join("app", "views", "govuk_component", "beta_label.raw.html.erb"))
      assert_equal expected, last_response.body
    end

    should "404 for non-existent component templates" do
      get "/templates/govuk_component/foo.raw.html.erb"
      assert_equal 404, last_response.status

      get "/templates/govuk_component/wrapper.raw.html.erb"
      assert_equal 404, last_response.status
    end

    should "404 for invalid template names without looking at the filesystem" do
      File.expects(:exists?).never
      [
        "foo-bar",
        "foo&bar",
        "foo+bar",
      ].each do |template|
        get "/templates/#{template}.raw.html.erb"
        assert_equal 404, last_response.status
      end
    end
  end

  context "fetching template docs" do
    should "return 200 when requested" do
      get "/templates/govuk_component/docs"
      assert_equal 200, last_response.status
    end
  end

  context "fetching locales" do
    should "return 200 when requesting locale list" do
      get "/templates/locales"
      assert_equal 200, last_response.status
    end

    should "return array of options when requesting locale list" do
      get "/templates/locales"
      assert JSON.parse(last_response.body).is_a? Array
      assert JSON.parse(last_response.body).include? "en"
    end

    should "return 200 when requesting en locale file" do
      get "/templates/locales/en"
      assert_equal 200, last_response.status
    end

    should "return locale object for en locale" do
      get "/templates/locales/en"
      json = JSON.parse(last_response.body)
      assert json["en"]
    end
  end
end
