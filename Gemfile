source 'https://rubygems.org'

gem 'rails', '3.2.18'
gem 'unicorn', '4.3.1'

gem 'aws-ses', :require => 'aws/ses' # Needed by exception_notification
gem 'exception_notification'
gem 'logstasher', '0.4.8'

group :assets do
  gem "therubyracer", "0.12.0"
  gem 'uglifier'
  gem 'sass', '3.4.2'
  gem 'sass-rails', '3.2.5'
end

group :test do
  gem 'capybara', '2.1.0'
  gem 'mocha', '0.13.3', :require => false
  gem 'shoulda', '2.11.3'
end

group :development, :test do
  gem 'jasmine', '2.0.2'
  gem 'jasmine-jquery-rails'
end

gem 'plek', '1.7.0'

gem 'govuk_frontend_toolkit', '1.6.2'
if ENV['GOVUK_TEMPLATE_DEV']
  gem 'govuk_template', :path => "../govuk_template"
else
  gem 'govuk_template', '0.9.0'
end
gem 'gds-api-adapters', '7.18.0'
