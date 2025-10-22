source "https://rubygems.org"

ruby "~> 3.4.5"

gem "rails", "8.1.0"

gem "actionpack-page_caching"
gem "bootsnap", require: false
gem "dartsass-rails"
gem "gds-api-adapters"
gem "govuk_app_config"
gem "govuk_personalisation"
gem "govuk_publishing_components"
gem "govuk_web_banners"
gem "nokogiri"
gem "plek"
gem "rack-utf8_sanitizer"
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
  gem "webmock"
end
