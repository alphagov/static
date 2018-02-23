Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Set GOVUK_ASSET_ROOT & PLEK_SERVICE_STATIC_URI for heroku - for review
  # apps we have the hostname set at the time of the app being built so can't
  # be set up in the app.json
  if ENV["HEROKU_APP_NAME"]
    ENV["GOVUK_ASSET_ROOT"] = "https://#{ENV['HEROKU_APP_NAME']}.herokuapp.com" unless ENV.include?("GOVUK_ASSET_ROOT")
    ENV["PLEK_SERVICE_STATIC_URI"] = "#{ENV['HEROKU_APP_NAME']}.herokuapp.com" unless ENV.include?("PLEK_SERVICE_STATIC_URI")
  end

  # Code is not reloaded between requests
  config.cache_classes = true

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Disable Rails's static asset server (Apache or nginx will already do this)
  config.serve_static_files = ENV["RAILS_SERVE_STATIC_FILES"].present?

  # Compress JavaScripts and CSS
  config.assets.js_compressor = :uglifier

  # Don't fallback to assets pipeline if a precompiled asset is missed
  config.assets.compile = false

  # Generate digests for assets URLs
  config.assets.digest = true

  # Defaults to Rails.root.join("public/assets")
  # config.assets.manifest = YOUR_PATH

  # Specifies the header that your server uses for sending files
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for nginx

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  # config.force_ssl = true

  # See everything in the log
  config.log_level = :info

  # Use a different logger for distributed setups
  # config.logger = SyslogLogger.new

  # Use a different cache store in production
  # config.cache_store = :mem_cache_store

  # Precompile additional assets (application.js, application.css, and all non-JS/CSS are already added)
  # config.assets.precompile += %w( ie.js libs/jquery/jquery-1.12.4.min.js high-contrast.css dyslexic.css admin.css libs/jquery/jquery-ui-1.8.16.custom.min.js libs/jquery/plugins/jquery.mustache.js )

  # Disable delivery errors, bad email addresses will be ignored
  # config.action_mailer.raise_delivery_errors = false
  # config.action_mailer.delivery_method = :ses

  # Enable threaded mode
  # config.threadsafe!

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation can not be found)
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners
  config.active_support.deprecation = :notify

  config.action_controller.asset_host = ENV['GOVUK_ASSET_HOST']

  config.eager_load = true
end
