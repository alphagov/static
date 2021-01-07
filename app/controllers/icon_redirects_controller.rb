class IconRedirectsController < ApplicationController
  before_action { expires_in(1.day, public: true) }

  def show
    redirect_to view_context.asset_path(request.path.to_s[1..-1]), status: :moved_permanently
  end

  def apple_old_size_icon
    redirect_to view_context.asset_path("apple-touch-icon.png"), status: :moved_permanently
  end
end
