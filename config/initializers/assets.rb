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
  application.js
  error-page.js
  global-bar-init.js
  header-footer-only.js
  libs/jquery/jquery-1.12.4.js
  modules/base-target.js
  surveys.js
  application*.css
  core-layout*.css
  error-page-print.css
  error-page.css
  fonts*.css
  guides-print.css
  header-footer-only*.css
  print.css
  static-print.css
]
