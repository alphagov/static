module NotificationHelper
  include ActionView::Helpers::TagHelper

	def banner_notification
		banner_content = NotificationFileLookup.banner_content
    banner_colour = NotificationFileLookup.banner_colour
		if banner_content
			content_tag(:section, banner_content, {:id => "banner-notification", :class => banner_colour}, false)
		else
			''
		end
	end

  def campaign_notification
		campaign_content = NotificationFileLookup.campaign_content
    campaign_colour = NotificationFileLookup.campaign_colour
		if campaign_content
			content_tag(:section, campaign_content, {:id => "campaign-notification", :class => campaign_colour}, false)
		else
			''
		end
	end
end
