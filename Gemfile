source "https://rubygems.org"

ruby File.read(".ruby-version").chomp

gem "rails", "6.1.4.6"

gem "actionpack-page_caching"
gem "gds-api-adapters"
gem "govuk_app_config"
gem "govuk_personalisation"
gem "govuk_publishing_components"
gem "nokogiri"
gem "plek"
gem "rack_strip_client_ip"
gem "redis"
gem "sassc-rails"
gem "uglifier"

group :development do
  gem "better_errors"
  gem "binding_of_caller"
  gem "image_optim"
  gem "listen"
end

group :development, :test do
  gem "govuk_test"
  gem "jasmine"
  gem "jasmine_selenium_runner"
  gem "pry"
  gem "rubocop-govuk"
end

group :test do
  gem "climate_control"
  gem "govuk-content-schema-test-helpers"
  gem "jasmine-core"
  gem "minitest"
  gem "minitest-capybara"
  gem "mocha", require: false
  gem "shoulda-context"
  gem "simplecov"
  gem "webmock"
end
