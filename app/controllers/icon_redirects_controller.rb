class IconRedirectsController < ApplicationController
  before_action { expires_in(1.day, public: true) }

  def show
    redirect_to(view_context.asset_path("govuk-#{request.path.to_s[1..]}"),
                status: :moved_permanently,
                allow_other_host: true)
  end

  def show_favicon
    redirect_to(view_context.asset_path("favicon.ico"),
                status: :moved_permanently,
                allow_other_host: true)
  end

  def apple_old_size_icon
    redirect_to(view_context.asset_path("govuk-apple-touch-icon.png"),
                status: :moved_permanently,
                allow_other_host: true)
  end
end
