class CacheRoutesController < ApplicationController
  def cachable_routes
    render json: [
      # js
      ActionController::Base.helpers.asset_path('libs/jquery/jquery-1.12.4.js'),
      ActionController::Base.helpers.asset_path('surveys.js'),
      ActionController::Base.helpers.asset_path('application.js'),
      
      # css
      ActionController::Base.helpers.asset_path('static.css'),
      ActionController::Base.helpers.asset_path('static-print.css'),
      
      # image files
      ActionController::Base.helpers.asset_path('favicon.ico'),
      ActionController::Base.helpers.asset_path('apple-touch-icon.png'),
      ActionController::Base.helpers.asset_path('apple-touch-icon-180x180.png'),
      ActionController::Base.helpers.asset_path('apple-touch-icon-167x167.png'),
      ActionController::Base.helpers.asset_path('apple-touch-icon-152x152.png'),
      ActionController::Base.helpers.asset_path('apple-touch-icon-120x120.png'),
      ActionController::Base.helpers.asset_path('apple-touch-icon-152x152.png'),
      ActionController::Base.helpers.asset_path('apple-touch-icon-76x76.png'),
      ActionController::Base.helpers.asset_path('apple-touch-icon-60x60.png'),
      ActionController::Base.helpers.asset_path('apple-touch-icon-precomposed.png'),
    ]
  end
end
