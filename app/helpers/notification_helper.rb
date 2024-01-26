require "emergency_banner/display"

module NotificationHelper
  def emergency_banner_notification
    emergency_banner = EmergencyBanner::Display.new
    emergency_banner if emergency_banner.enabled?
  end
end
