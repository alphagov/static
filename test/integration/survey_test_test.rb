require_relative "../integration_test_helper"

class SurveyTestTest < ActionDispatch::IntegrationTest
  context "during the survey test period" do
    %w(2015-12-09 2015-12-10 2015-12-11).each do |date|
      should "present the correct survey URL on #{date}" do
        render_homepage_on date

        assert_equal @survey_url, "https://www.surveymonkey.co.uk/r/3Y3SF53"
      end
    end
  end

  context "outside of the survey test period" do
    %w(2015-12-08 2015-12-12).each do |date|
      should "present the correct survey URL on #{date}" do
        render_homepage_on date

        assert_equal @survey_url, "https://www.surveymonkey.com/s/6HZFSVC"
      end
    end
  end

  def render_homepage_on(date)
    travel_to Time.zone.parse(date) do
      visit "/templates/homepage.html.erb"

      @survey_url = page.find("#user-satisfaction-survey-container")["data-survey-url"]
    end
  end
end
