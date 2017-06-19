class IconRedirectsController < ApplicationController
  def show
    redirect_to view_context.asset_path(request.path.to_s[1..-1]), status: 301
  end

  def apple_old_size_icon
    redirect_to view_context.asset_path('apple-touch-icon.png'), status: 301
  end
end
