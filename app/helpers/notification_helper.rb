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

  # This is only used to replace homepage campaigns for urgent matters.
  def campaign_replacement_notification
		campaign = NotificationFileLookup.instance.campaign
		if campaign
			content_tag(:section, "<div>#{campaign[:file]}</div>", {:id => "campaign-notification", :class => campaign[:colour]}, false)
		else
			''
		end
	end
end
