require_relative 'test_helper'
require 'rack/test'
require 'capybara/rails'
require 'capybara/poltergeist'

# TODO: Remove when PhantomJS updated on Puppet
# Include via phantomjs to use modern PhantomJS version
require 'phantomjs/poltergeist'

Capybara.javascript_driver = :poltergeist

class ActionDispatch::IntegrationTest < ActiveSupport::TestCase
  include Rack::Test::Methods
  include Capybara::DSL
end
