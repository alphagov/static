require_relative "../integration_test_helper"

class IconRedirectsTest < ActionDispatch::IntegrationTest

  [
    'favicon.ico',
    'apple-touch-icon.png',
    'apple-touch-icon-144x144.png',
    'apple-touch-icon-114x114.png',
    'apple-touch-icon-72x72.png',
    'apple-touch-icon-57x57.png',
    'apple-touch-icon-precomposed.png',
  ].each do |file|
    should "redirect #{file} to the asset path" do
      get "/#{file}"
      assert_equal 301, last_response.status
      # In development and test mode the asset pipeline doesn't add the hashes to the URLs
      assert_equal "http://example.org/static/#{file}", last_response.location
    end
  end
end
