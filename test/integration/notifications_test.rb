require "integration_test_helper"

class NotificationsTest < ActionDispatch::IntegrationTest
  def stub_redis_response(hash)
    Redis.any_instance.stubs(:hgetall).with("emergency_banner").returns(hash)
  end

  context "emergency banner file" do
    should "have an emergency banner file" do
      assert File.exist? Rails.root.join("app/views/components/_emergency_banner.html.erb")
    end
  end

  context "emergency banner notifications" do
    should "not render a banner if one does not exist" do
      visit "/templates/gem_layout.html.erb"
      assert_not page.has_selector? ".emergency-banner"
    end

    should "render a banner if one does exist" do
      stub_redis_response(campaign_class: "foo", heading: "bar")

      visit "/templates/gem_layout.html.erb"
      assert page.has_selector? ".emergency-banner"
    end

    should "render a banner with a heading and campaign colour" do
      stub_redis_response(campaign_class: "notable-death", heading: "Alas poor Yorick")

      visit "/templates/gem_layout.html.erb"

      assert page.has_selector? ".emergency-banner--notable-death"
      assert_match "Alas poor Yorick", page.body
    end

    should "render the more information link" do
      stub_redis_response(
        campaign_class: "notable-death",
        heading: "Alas poor Yorick",
        link: "https://yoricks.gov",
      )

      visit "/templates/gem_layout.html.erb"

      assert_match "More information", page.body
      assert_match(/yoricks\.gov/, page.body)
    end

    should "render the more information link with specified text" do
      stub_redis_response(
        campaign_class: "notable-death",
        heading: "Alas poor Yorick",
        link: "https://yoricks.gov",
        link_text: "Some specified text for more information",
      )

      visit "/templates/gem_layout.html.erb"

      assert_match "Some specified text for more information", page.body
    end

    should "not render the more information link if it does not exist" do
      stub_redis_response(
        campaign_class: "notable-death",
        heading: "Alas poor Yorick",
      )

      visit "/templates/gem_layout.html.erb"

      assert_not page.has_selector? ".emergency-banner__description"
      assert_no_match(/yoricks\.gov/, page.body)
    end

    should "render the extra information" do
      stub_redis_response(
        campaign_class: "notable-death",
        heading: "Alas poor Yorick",
        short_description: "I knew him well",
      )

      visit "/templates/gem_layout.html.erb"

      assert_match "I knew him well", page.body
    end

    should "does not render the extra information if it does not exist" do
      stub_redis_response(
        campaign_class: "notable-death",
        heading: "Alas poor Yorick",
      )

      visit "/templates/gem_layout.html.erb"

      assert_no_match "I knew him well", page.body
    end
  end
end
