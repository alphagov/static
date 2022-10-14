source "https://rubygems.org"

ruby File.read(".ruby-version").chomp

gem "rails", "7.0.4"

gem "actionpack-page_caching"
gem "gds-api-adapters"
gem "govuk_app_config"
gem "govuk_personalisation"
#gem 'govuk_publishing_components', path: '../govuk_publishing_components'
gem "govuk_publishing_components", git: "https://github.com/alphagov/govuk_publishing_components.git", branch: "test-feedback-on-integration"
gem "nokogiri"
gem "plek"
gem "rack_strip_client_ip"
gem "redis"
gem "sassc-rails"
gem "sprockets-rails"
gem "uglifier"

group :development do
  gem "better_errors"
  gem "binding_of_caller"
  gem "image_optim"
  gem "listen"
end

group :development, :test do
  gem "govuk_test"
  gem "pry"
  gem "rubocop-govuk"
end

group :test do
  gem "climate_control"
  gem "govuk-content-schema-test-helpers"
  gem "minitest"
  gem "minitest-capybara"
  gem "mocha", require: false
  gem "shoulda-context"
  gem "simplecov"
  gem "webmock"
end
