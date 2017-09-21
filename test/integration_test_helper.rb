require_relative 'test_helper'
require 'rack/test'
require 'capybara/rails'
require 'capybara/poltergeist'
require 'phantomjs'

# TODO: Remove when PhantomJS updated on Puppet
# Use modern PhantomJS version via gem
# Based on: https://github.com/colszowka/phantomjs-gem/blob/master/lib/phantomjs/poltergeist.rb
Phantomjs.path
Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new(app, phantomjs: Phantomjs.path, timeout: 2.minutes)
end

Capybara.javascript_driver = :poltergeist

class ActionDispatch::IntegrationTest < ActiveSupport::TestCase
  include Rack::Test::Methods
  include Capybara::DSL
end
