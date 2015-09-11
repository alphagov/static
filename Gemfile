source 'https://rubygems.org'

gem 'rails', '4.0.13'
gem 'unicorn', '4.3.1'

gem 'aws-ses', :require => 'aws/ses' # Needed by exception_notification
gem 'exception_notification'
gem 'logstasher', '0.4.8'
gem 'rack_strip_client_ip', '0.0.1'
gem 'actionpack-page_caching', '1.0.2'

group :assets do
  gem "therubyracer", "0.12.0"
  gem 'uglifier'
  gem 'sass'
  gem 'sass-rails'
  gem 'yui-compressor', '~> 0.12.0'
end

group :development do
  gem 'image_optim', '0.17.1'
end

group :test do
  gem 'capybara', '2.1.0'
  gem 'mocha', '~> 1.1.0', :require => false
  gem 'shoulda'
  gem 'webmock'
  gem 'test-unit'
  gem 'minitest'
  gem 'minitest-capybara'
end

group :development, :test do
  gem 'jasmine-rails', '~> 0.10.6'
  gem 'quiet_assets', '1.1.0'
end

gem 'plek', '1.11.0'
gem 'govuk_frontend_toolkit', '~> 4.2.1'

if ENV['GOVUK_TEMPLATE_DEV']
  gem 'govuk_template', :path => "../govuk_template"
else
  gem 'govuk_template', '0.15.1'
end
gem 'gds-api-adapters', '23.2.2'
