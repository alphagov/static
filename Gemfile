source "https://rubygems.org"

ruby File.read(".ruby-version").chomp

gem "rails", "5.2.4.3"

gem "actionpack-page_caching"
gem "asset_bom_removal-rails"
gem "gds-api-adapters"
gem "govuk_app_config"
gem "govuk_frontend_toolkit"
gem "govuk_publishing_components"
gem "govuk_template"
gem "nokogiri"
gem "plek"
gem "rack_strip_client_ip"
gem "redis"
gem "sass-rails"
gem "uglifier"

group :development do
  gem "better_errors"
  gem "binding_of_caller"
  gem "image_optim"
end

group :development, :test do
  gem "jasmine"
  gem "jasmine_selenium_runner", require: false
  gem "pry"
  gem "rubocop-govuk"
end

group :test do
  gem "govuk-content-schema-test-helpers"
  gem "govuk_test"
  gem "jasmine-core"
  gem "minitest"
  gem "minitest-capybara"
  gem "mocha", require: false
  gem "shoulda-context"
  gem "webdrivers"
  gem "webmock"
end
