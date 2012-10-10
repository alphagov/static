require_relative 'test_helper'
require 'capybara/rails'

class ActionDispatch::IntegrationTest
  include Capybara::DSL
end