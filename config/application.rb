require_relative "boot"

require "rails"

require "action_controller/railtie"
require "action_view/railtie"
require "active_support/time"
require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Static
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    config.eager_load_paths += %W[#{config.root}/lib]

    # Using a sass css compressor causes a scss file to be processed twice
    # (once to build, once to compress) which breaks the usage of "unquote"
    # to use CSS that has same function names as SCSS such as max.
    # https://github.com/alphagov/govuk-frontend/issues/1350
    config.assets.css_compressor = nil

    config.paths["log"] = ENV["LOG_PATH"] if ENV["LOG_PATH"]

    # Google Analytics ID
    config.ga_universal_id = ENV.fetch("GA_UNIVERSAL_ID", "UA-UNSET")
    config.ga_secondary_id = ENV.fetch("GA_SECONDARY_ID", "UA-UNSET")
  end
end
