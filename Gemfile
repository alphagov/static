source 'https://rubygems.org'

gem 'rails', '4.2.5.2'

gem 'unicorn', '4.9.0'

gem 'logstasher', '0.4.8'
gem 'rack_strip_client_ip', '0.0.1'
gem 'actionpack-page_caching', '1.0.2'

gem 'uglifier', ">= 1.3.0"
gem 'sass-rails', "5.0.4"
gem 'airbrake', '~> 4.3.1'

gem 'nokogiri', "~> 1.6.6.4"
gem 'sprockets-rails', "2.3.3" #FIXME: This is temporary, will allow to upgrade rails to 4.2.5.1 to address security fixes without breaking tests http://weblog.rubyonrails.org/2016/1/25/Rails-5-0-0-beta1-1-4-2-5-1-4-1-14-1-3-2-22-1-and-rails-html-sanitizer-1-0-3-have-been-released/

group :development do
  gem 'image_optim', '0.17.1'
  gem 'better_errors'
  gem 'binding_of_caller'
end

group :test do
  gem 'capybara', '~> 2.5.0'
  gem 'govuk-content-schema-test-helpers', '~> 1.4'
  gem 'mocha', '~> 1.1.0', :require => false
  gem 'shoulda'
  gem 'webmock'
  gem 'test-unit'
  gem 'minitest'
  gem 'minitest-capybara', '~> 0.7.2'
end

group :development, :test do
  gem 'jasmine-rails', '~> 0.10.6'
  gem 'quiet_assets', '1.1.0'
  gem 'govuk-lint', '~> 0.6.0'
  gem 'pry'
end

gem 'plek', '1.11.0'
gem 'govuk_frontend_toolkit', '~> 4.10.0'

if ENV['GOVUK_TEMPLATE_DEV']
  gem 'govuk_template', :path => "../govuk_template"
else
  gem 'govuk_template', '0.17.0'
end
gem 'gds-api-adapters', '26.7.0'
