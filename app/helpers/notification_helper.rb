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
end
