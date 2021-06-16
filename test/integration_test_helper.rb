require_relative "test_helper"
require "rack/test"
require "capybara/rails"

GovukTest.configure

class ActionDispatch::IntegrationTest < ActiveSupport::TestCase
  include Rack::Test::Methods
  include Capybara::DSL

  def teardown
    page.driver.browser.manage.delete_all_cookies if Capybara.current_driver == Capybara.javascript_driver
    Capybara.current_driver = Capybara.default_driver
  end
end
