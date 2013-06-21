class IconRedirectsController < ApplicationController
  def show
    redirect_to view_context.asset_path(request.fullpath.to_s[1..-1]), :status => 301
  end
end
