source 'https://rubygems.org'

gem 'rails', '4.2.4'
gem 'unicorn', '4.9.0'

gem 'logstasher', '0.4.8'
gem 'rack_strip_client_ip', '0.0.1'
gem 'actionpack-page_caching', '1.0.2'

gem 'uglifier', ">= 1.3.0"
gem 'sass-rails', "5.0.4"
gem 'airbrake', '~> 4.3.1'

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
  gem 'govuk-lint', '~> 0.3.0'
end

gem 'plek', '1.11.0'
gem 'govuk_frontend_toolkit', '~> 4.2.1'

if ENV['GOVUK_TEMPLATE_DEV']
  gem 'govuk_template', :path => "../govuk_template"
else
  gem 'govuk_template', '0.15.1'
end
gem 'gds-api-adapters', '23.2.2'
