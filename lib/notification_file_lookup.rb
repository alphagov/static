class NotificationFileLookup
	cattr_accessor :banner_file

  def self.banner_content
  	@@banner_file ||= File.open("#{Rails.root}/app/views/notifications/banner_category_1.erb").to_s.strip
  	@@banner_file.blank? ? nil : @@banner_file
  end
end
