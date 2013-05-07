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
end
