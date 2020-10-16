ENV["RAILS_ENV"] ||= "test"

require "simplecov"
SimpleCov.start "rails"

require File.expand_path("../config/environment", __dir__)
require "rails/test_help"
require "mocha/minitest"

class ActiveSupport::TestCase
  # Add more helper methods to be used by all tests here...
end
