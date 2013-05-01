require_relative 'test_helper'
require 'rack/test'
require 'capybara/rails'

class ActionDispatch::IntegrationTest
  include Rack::Test::Methods
  include Capybara::DSL
end
