class IconRedirectsController < ApplicationController
  before_action { expires_in(1.day, public: true) }

  def show_favicon
    redirect_to(view_context.asset_path("favicon.ico"),
                status: :moved_permanently,
                allow_other_host: true)
  end
end
