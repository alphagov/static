require_relative 'test_helper'
require 'rack/test'
require 'capybara/rails'

GovukTest.configure

class ActionDispatch::IntegrationTest < ActiveSupport::TestCase
  include Rack::Test::Methods
  include Capybara::DSL
end
