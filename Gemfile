source "https://rubygems.org"

ruby File.read(".ruby-version").chomp

gem "actionpack-page_caching", "1.2.0"
gem "asset_bom_removal-rails", "~> 1.0.0"
gem "govuk_app_config", "~> 2.0.1"
gem "govuk_publishing_components", "~> 21.20.0"
gem "nokogiri", "~> 1.10"
gem "rack_strip_client_ip", "0.0.2"
gem "rails", "~> 5.2"
gem "redis", "~> 4.1.3"
gem "sass-rails", "5.0.7"
gem "uglifier", ">= 1.3.0"

group :development do
  gem "better_errors"
  gem "binding_of_caller"
  gem "image_optim", "0.26.5"
end

group :test do
  gem "govuk-content-schema-test-helpers", "~> 1.6"
  gem "govuk_test"
  gem "jasmine-core", [">= 2.99", "< 3"]
  gem "minitest"
  gem "minitest-capybara", "~> 0.9.0"
  gem "mocha", "~> 1.11.1", require: false
  gem "shoulda"
  gem "test-unit"
  gem "webmock"
end

group :development, :test do
  gem "jasmine-rails", "~> 0.15.0"
  gem "pry"
  gem "rubocop-govuk"
end

gem "gds-api-adapters", "~> 63.2"
gem "govuk_frontend_toolkit", "~> 9.0.0"
gem "govuk_template", "0.26.0"
gem "plek", "3.0.0"
