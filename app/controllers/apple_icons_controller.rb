class AppleIconsController < ApplicationController
  def show
    redirect_to view_context.asset_path(request.fullpath.to_s[1..-1])
  end
end
