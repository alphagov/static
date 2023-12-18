require "integration_test_helper"

class GemLayoutTest < ActionDispatch::IntegrationTest
  setup do
    Capybara.current_driver = Capybara.javascript_driver
    visit "/templates/gem_layout.html.erb"
  end

  should "allow user to report a problem with the page" do
    click_on "Report a problem with this page"
    assert page.has_content?("Help us improve GOV.UK")
    assert page.has_field?("What went wrong?")

    # Regression test for scenario where wrong URL is set
    url_input = page.find("form[action='http://www.dev.gov.uk/contact/govuk/problem_reports'] input[name=url]", visible: false)
    assert_equal page.current_url, url_input.value
  end

  should "allow user to report that the page is not useful" do
    click_on "No" # No, this page is not useful
    assert page.has_content?("Help us improve GOV.UK")
    assert page.has_field?("Email address")
    puts page.html
    # Regression test for scenario where wrong URL is set
    url_input = page.find("form[action='http://www.dev.gov.uk/contact/govuk/email-survey-signup'] input[name='email_survey_signup[survey_source]']", visible: false)
    full_path = URI(page.current_url).request_uri
    assert_equal full_path, url_input.value
  end

  should "allow user to report that the page is useful" do
    click_on "Yes" # Yes, this page is useful
    assert page.has_content?("Thank you for your feedback")
  end
end
