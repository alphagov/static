source 'https://rubygems.org'

gem 'rails', '~> 5.1'
gem 'unicorn', '4.9.0'
gem 'logstasher', '0.4.8'
gem 'rack_strip_client_ip', '0.0.2'
gem 'actionpack-page_caching', '1.1.0'
gem 'uglifier', ">= 1.3.0"
gem 'sass-rails', "5.0.6"
gem 'airbrake', github: 'alphagov/airbrake', branch: 'silence-dep-warnings-for-rails-5'
gem 'nokogiri', "~> 1.7"
gem 'redis', "~> 3.3.3"
gem 'govuk_publishing_components', '~> 1.1.0', require: ENV['RAILS_ENV'] != "production" || ENV['HEROKU_APP_NAME'].to_s.length.positive?

group :development do
  gem 'image_optim', '0.17.1'
  gem 'better_errors'
  gem 'binding_of_caller'
end

group :test do
  gem 'capybara', '~> 2.5.0'
  gem 'govuk-content-schema-test-helpers', '~> 1.4'
  gem 'mocha', '~> 1.1.0', require: false
  gem 'shoulda'
  gem 'webmock'
  gem 'test-unit'
  gem 'minitest'
  gem 'minitest-capybara', '~> 0.7.2'
end

group :development, :test do
  gem 'jasmine-rails', '~> 0.14.1'
  gem 'govuk-lint', '~> 0.6.0'
  gem 'pry'
end

gem 'plek', '1.11.0'
gem 'govuk_frontend_toolkit', '~> 7.0.1'
gem 'govuk_template', '0.22.2'
gem 'gds-api-adapters', '41.2.0'
