ENV["RAILS_ENV"] = "test"

require File.expand_path('../../config/environment', __FILE__)

require 'minitest/autorun'
require 'test/unit'
require 'rails/test_help'
require 'mocha/mini_test'

class ActiveSupport::TestCase
  def create_test_file(filename:, content:)
    FileUtils.mkdir_p location_of_test_files
    full_path = File.join(location_of_test_files, filename)
    File.open(full_path, "w") {|f| f << content }
  end

  def location_of_test_files
    Rails.root.join("tmp", "test")
  end

  def clean_up_test_files
    FileUtils.rm_r location_of_test_files
  end
end
