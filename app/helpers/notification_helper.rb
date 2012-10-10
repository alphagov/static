module NotificationHelper
  include ActionView::Helpers::TagHelper

	def banner_notification
		banner_content = NotificationFileLookup.banner_content
		if banner_content
			content_tag(:section, banner_content, {:id => "banner-notification"}, false)
		else
			''
		end
	end
end
