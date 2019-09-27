source 'https://rubygems.org'

ruby File.read('.ruby-version').chomp

gem 'rails', '~> 5.2'
gem 'rack_strip_client_ip', '0.0.2'
gem 'actionpack-page_caching', '1.1.1'
gem 'uglifier', ">= 1.3.0"
gem 'sass-rails', "5.0.7"
gem 'asset_bom_removal-rails', '~> 1.0.0'
gem 'nokogiri', "~> 1.10"
gem 'redis', "~> 4.1.3"
gem 'govuk_publishing_components', '~> 21.3.0'
gem 'govuk_app_config', '~> 2.0.0'

group :development do
  gem 'image_optim', '0.26.5'
  gem 'better_errors'
  gem 'binding_of_caller'
end

group :test do
  gem 'govuk-content-schema-test-helpers', '~> 1.6'
  gem 'govuk_test'
  gem 'mocha', '~> 1.9.0', require: false
  gem 'shoulda'
  gem 'webmock'
  gem 'test-unit'
  gem 'minitest'
  gem 'minitest-capybara', '~> 0.9.0'
  gem 'jasmine-core', ['>= 2.99', '< 3']
end

group :development, :test do
  gem 'jasmine-rails', '~> 0.15.0'
  gem 'govuk-lint', '~> 4.0'
  gem 'pry'
end

gem 'plek', '3.0.0'
gem 'govuk_frontend_toolkit', '~> 9.0.0'
gem 'govuk_template', '0.26.0'
gem 'gds-api-adapters', '~> 60.1'
