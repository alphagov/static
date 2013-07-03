require_relative "../integration_test_helper"

class ReportAProblemTemplateTest < ActionDispatch::IntegrationTest
  include ERB::Util

  def get_template
    get "/templates/report_a_problem.raw.html.erb"
    last_response.body
  end

  should "sanitise the return URL in the template" do
    # The template is rendered in Rack middleware, and therefore doesn't benefit from Rails' auto escaping
    template = get_template

    request_url = "<foo&bar>"
    result = ERB.new(template).result(binding)

    assert result =~ /&lt;foo&amp;bar&gt;/
  end

  should "include inputs for source and page_owner if supplied" do
    template = get_template
    request_url = "<foo&bar>"
    source = 'government'
    page_owner = 'hmrc'

    result = ERB.new(template).result(binding)
    doc = Nokogiri::HTML.parse(result)

    assert doc.at_css("form input[type=hidden][name=source][value='government']"), 'expected form input for source not found'
    assert doc.at_css("form input[type=hidden][name=page_owner][value='hmrc']"), 'expected form input for page owner not found'
  end
end
