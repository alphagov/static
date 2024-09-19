require_relative "../integration_test_helper"

class IconRedirectsTest < ActionDispatch::IntegrationTest
  should "redirect `favicon.ico` to the asset path" do
    get "/favicon.ico"
    assert_equal 301, last_response.status
    assert_equal last_response.headers["Cache-Control"], "max-age=86400, public"
    # In development and test mode the asset pipeline doesn't add the hashes to the URLs
    assert_equal "http://example.org/assets/static/favicon.ico", last_response.location
  end

  should "redirect `favicon.ico` to a location that exists" do
    get "/assets/static/favicon.ico"
    assert_equal 200, last_response.status
    assert last_response.body.size > 100
  end

  should "ignore query string when redirecting `favicon.ico`" do
    get "/favicon.ico?foo=bar"
    assert_equal 301, last_response.status
    assert_equal "http://example.org/assets/static/favicon.ico", last_response.location
  end
end
