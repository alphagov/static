source 'https://rubygems.org'

ruby File.read('.ruby-version').chomp

gem 'rails', '~> 5.1'
gem 'unicorn', '5.3.1'
gem 'logstasher', '1.2.2'
gem 'rack_strip_client_ip', '0.0.2'
gem 'actionpack-page_caching', '1.1.0'
gem 'uglifier', ">= 1.3.0"
gem 'sass-rails', "5.0.7"
gem 'asset_bom_removal-rails', '~> 1.0.0'
gem 'nokogiri', "~> 1.7"
gem 'redis', "~> 4.0.1"
gem 'govuk_publishing_components', '~> 3.1.0', require: false
gem 'govuk_app_config', '~> 1.1.0'

group :development do
  gem 'image_optim', '0.26.1'
  gem 'better_errors'
  gem 'binding_of_caller'
end

group :test do
  gem 'poltergeist', require: false
  gem 'capybara', '~> 2.16.1'
  gem 'govuk-content-schema-test-helpers', '~> 1.5'
  gem 'mocha', '~> 1.3.0', require: false
  gem 'shoulda'
  gem 'webmock'
  gem 'test-unit'
  gem 'minitest'
  gem 'minitest-capybara', '~> 0.8.2'
end

group :development, :test do
  gem 'jasmine-rails', '~> 0.14.1'
  gem 'govuk-lint', '~> 3.4.0'
  gem 'pry'
end

gem 'plek', '2.0.0'
gem 'govuk_frontend_toolkit', '~> 7.2.0'
gem 'govuk_template', '0.23.0'
gem 'gds-api-adapters', '~> 50.8'
