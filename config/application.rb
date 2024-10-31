require_relative "boot"

require "rails"
# Pick the frameworks you want:
# require "active_model/railtie"
# require "active_job/railtie"
# require "active_record/railtie"
# require "active_storage/engine"
require "action_controller/railtie"
# require "action_mailer/railtie"
# require "action_mailbox/engine"
# require "action_text/engine"
require "action_view/railtie"
require "active_support/time"
# require "action_cable/engine"
require "rails/test_unit/railtie"
require_relative "../lib/sanitiser/strategy"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Static
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.2

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks sanitiser])

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # Using a sass css compressor causes a scss file to be processed twice
    # (once to build, once to compress) which breaks the usage of "unquote"
    # to use CSS that has same function names as SCSS such as max.
    # https://github.com/alphagov/govuk-frontend/issues/1350
    config.assets.css_compressor = nil

    config.paths["log"] = ENV["LOG_PATH"] if ENV["LOG_PATH"]

    # Use temporary directory for page cache if filesystem is read-only
    config.action_controller.page_cache_directory = File.join(ENV["TMPDIR"], "page_cache") if ENV.fetch("USE_TMPDIR_PAGE_CACHE", "false") == "true"

    # Protect from "invalid byte sequence in UTF-8" errors,
    # when a query or a cookie is a string with incorrect UTF-8 encoding.
    config.middleware.insert_before(
      0,
      Rack::UTF8Sanitizer,
      sanitizable_content_types: [],
      only: %w[QUERY_STRING],
      strategy: Sanitiser::Strategy,
    )
  end
end
