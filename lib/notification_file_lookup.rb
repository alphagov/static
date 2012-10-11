class NotificationFileLookup
	cattr_accessor :banner_file

  def self.banner_content
  	@@banner_file ||= self.identify_banner_file
  	@@banner_file.blank? ? nil : @@banner_file
  end

  private

  def self.identify_banner_file
    category_2 = File.open("#{Rails.root}/app/views/notifications/banner_category_2.erb").to_s.strip
    return category_2 unless category_2.blank?
    File.open("#{Rails.root}/app/views/notifications/banner_category_1.erb").to_s.strip
  end
end
