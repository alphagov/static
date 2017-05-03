class IconRedirectsController < ApplicationController
  def show
    redirect_to view_context.asset_path(request.path.to_s[1..-1]), status: 301
  end

  def apple_60_60
    redirect_to view_context.asset_path('apple-touch-icon-60x60.png'), status: 301
  end
end
