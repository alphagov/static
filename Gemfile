source "https://rubygems.org"

ruby "~> 3.2.0"

gem "rails", "7.2.1"

gem "actionpack-page_caching"
gem "bootsnap", require: false
gem "dartsass-rails"
gem "gds-api-adapters"
gem "govuk_app_config"
gem "govuk_personalisation"
gem "govuk_publishing_components", git: 'https://github.com/alphagov/govuk_publishing_components.git', branch: '5.7.0-test'
gem "nokogiri"
gem "plek"
gem "redis"
gem "sprockets-rails"
gem "terser"

group :development do
  gem "better_errors"
  gem "binding_of_caller"
  gem "listen"
end

group :development, :test do
  gem "govuk_test"
  gem "pry"
  gem "rubocop-govuk"
end

group :test do
  gem "climate_control"
  gem "minitest"
  gem "minitest-capybara"
  gem "mocha", require: false
  gem "shoulda-context"
  gem "simplecov"
  gem "timecop"
  gem "webmock"
end
