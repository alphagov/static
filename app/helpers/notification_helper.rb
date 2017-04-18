require "notification_file_lookup"
require "emergency_banner/display"

module NotificationHelper
  include ActionView::Helpers::TagHelper

  def banner_notification
    if node = Static.banner
      content_tag(:section, "<div>#{node[:file]}</div>",
        { id: "banner-notification", class: node[:colour].to_s }, false)
    else
      ''
    end
  end

  def emergency_banner_notification
    emergency_banner = EmergencyBanner::Display.new
    return emergency_banner if emergency_banner.enabled?
  end
end
