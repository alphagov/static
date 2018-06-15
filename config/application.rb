require_relative 'boot'

require "action_controller/railtie"
require "rails/test_unit/railtie"
require "sprockets/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

if !Rails.env.production? || ENV['HEROKU_APP_NAME'].present?
  require 'govuk_publishing_components'
end

module Static
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/lib)

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running.
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Enable the asset pipeline
    config.assets.enabled = true

    config.assets.prefix = "/static"

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    # Disable Rack::Cache
    config.action_dispatch.rack_cache = nil

    config.paths["log"] = ENV["LOG_PATH"] if ENV["LOG_PATH"]

    # Google Analytics ID
    config.ga_universal_id = ENV.fetch("GA_UNIVERSAL_ID", "UA-UNSET")

    # Slimmer is used by the govuk_publishing_components gem, however it inserts itself
    # automatically as middleware in the host Rails application
    # Disable Slimmer middleware for Static and enable for use in gem only
    if defined?(GovukPublishingComponents)
      config.middleware.delete Slimmer::App
    end
  end
end
