# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = "1.0"

# Compile assets to a location that doesn't conflict with upstream requests
Rails.application.config.assets.prefix = "/assets/static"

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
Rails.application.config.assets.precompile += %w[
  favicon.ico
  libs/jquery/jquery-1.12.4.js
  modules/base-target.js
  application.js
  header-footer-only.js
  global-bar-init.js
  error-page.js
  surveys.js
  application*.css
  print.css
  fonts*.css
  guides-print.css
  header-footer-only*.css
  core-layout*.css
  static-print.css
  error-page.css
  error-page-print.css
]
