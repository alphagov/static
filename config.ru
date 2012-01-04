root = File.join(File.dirname(__FILE__), "public")
puts ">>> Serving: #{root}"

ENV["RACK_ENV"] ||= "development"

require "bundler/setup"
Bundler.require(:default, ENV['RACK_ENV'])

use Rack::Geo
run Rack::Directory.new("#{root}")