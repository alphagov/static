ENV["RAILS_ENV"] = "test"

require File.expand_path('../../config/environment', __FILE__)

require 'minitest/autorun'
require 'mocha'
require 'rails/test_help'
require 'test/unit'

Mocha::Integration.monkey_patches.each do |patch|
  require patch
end
