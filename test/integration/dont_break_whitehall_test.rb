require "test_helper"

class DontBreakWhitehallTest < ActionController::IntegrationTest
  test "serve the wrapper template with the @prefix erb unmolested so it can set the search prefix" do
    get "/templates/wrapper.html.erb"
    assert_match Regexp.new(Regexp.escape("<%= @prefix %>")), @response.body
  end
end