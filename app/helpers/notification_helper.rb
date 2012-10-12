require_relative "../../lib/notification_file_lookup"

module NotificationHelper
  include ActionView::Helpers::TagHelper

	def banner_notification
		banner = NotificationFileLookup.instance.banner
		if banner
			content_tag(:section, "<div>#{banner[:file]}</div>", {:id => "banner-notification", :class => banner[:colour]}, false)
		else
			''
		end
	end

  def campaign_notification
		campaign = NotificationFileLookup.instance.campaign
		if campaign
			content_tag(:section, campaign[:file], {:id => "campaign-notification", :class => campaign[:colour]}, false)
		else
			''
		end
	end
end
