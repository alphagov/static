source "https://rubygems.org"

ruby "~> 3.2.0"

gem "rails", "7.0.8"

gem "actionpack-page_caching"
gem "bootsnap", require: false
gem "gds-api-adapters"
gem "govuk_app_config"
gem "govuk_personalisation"
gem "govuk_publishing_components", git: 'https://github.com/alphagov/govuk_publishing_components.git', ref: '8019a968b6417815fb1cb2d007839eac8778bf89'
gem "nokogiri"
gem "plek"
gem "redis"
gem "sassc-rails"
gem "sprockets-rails"
gem "uglifier"

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
  gem "webmock"
end
