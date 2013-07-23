class IconRedirectsController < ApplicationController
  def show
    redirect_to view_context.asset_path(request.fullpath.to_s[1..-1]), :status => 301
  end

  def apple_57_57
    redirect_to view_context.asset_path('apple-touch-icon-57x57.png'), :status => 301
  end
end
