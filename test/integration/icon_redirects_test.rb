require_relative "../integration_test_helper"

class IconRedirectsTest < ActionDispatch::IntegrationTest
  [
    "favicon.ico",
    "apple-touch-icon.png",
    "apple-touch-icon-180x180.png",
    "apple-touch-icon-167x167.png",
    "apple-touch-icon-152x152.png",
  ].each do |file|
    should "redirect #{file} to the asset path" do
      get "/#{file}"
      assert_equal 301, last_response.status
      assert_equal last_response.headers["Cache-Control"], "max-age=86400, public"
      # In development and test mode the asset pipeline doesn't add the hashes to the URLs
      assert_equal "http://example.org/assets/static/#{file}", last_response.location
    end

    should "redirect #{file} to a location that exists" do
      get "/assets/static/#{file}"
      assert_equal 200, last_response.status
      assert last_response.body.size > 100
    end

    should "ignore query string when redirecting #{file}" do
      get "/#{file}?foo=bar"
      assert_equal 301, last_response.status
      assert_equal "http://example.org/assets/static/#{file}", last_response.location
    end
  end

  [
    "apple-touch-icon-120x120.png",
    "apple-touch-icon-76x76.png",
    "apple-touch-icon-60x60.png",
    "apple-touch-icon-precomposed.png",
  ].each do |file|
    should "redirect old icon size #{file} to the default apple-touch-icon.png icon" do
      get "/#{file}"
      assert_equal 301, last_response.status
      assert_equal last_response.headers["Cache-Control"], "max-age=86400, public"
      # In development and test mode the asset pipeline doesn't add the hashes to the URLs
      assert_equal "http://example.org/assets/static/apple-touch-icon.png", last_response.location
    end
  end
end
