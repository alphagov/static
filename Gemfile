source 'https://rubygems.org'
source 'https://BnrJb6FZyzspBboNJzYZ@gem.fury.io/govuk/'

gem 'rails', '3.2.16'
gem 'unicorn', '4.3.1'

gem 'aws-ses', :require => 'aws/ses' # Needed by exception_notification
gem 'exception_notification'
gem 'logstasher', '0.4.1'

group :assets do
  gem "therubyracer", "0.12.0"
  gem 'uglifier'
  gem 'sass', '3.2.1'
  gem 'sass-rails', '3.2.5'
end

group :test do
  gem 'capybara', '2.1.0'
  gem 'mocha', '0.13.3', :require => false
  gem 'shoulda', '2.11.3'
end

gem 'plek', '1.5.0'
gem 'jasmine', '1.1.2'

gem 'govuk_frontend_toolkit', '0.39.0'
if ENV['GOVUK_TEMPLATE_DEV']
  gem 'govuk_template', :path => "../govuk_template"
else
  gem 'govuk_template', '0.4.0'
end
gem 'gds-api-adapters', '7.18.0'
