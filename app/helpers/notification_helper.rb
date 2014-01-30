require "notification_file_lookup"

module NotificationHelper
  include ActionView::Helpers::TagHelper

  def banner_notification
    if node = NotificationFileLookup.instance.banner
      content_tag(:section, "<div>#{node[:file]}</div>",
        {:id => "banner-notification", :class => node[:colour]}, false)
    else
      ''
    end
  end
end
