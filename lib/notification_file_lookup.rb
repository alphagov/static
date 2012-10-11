class NotificationFileLookup
	cattr_accessor :banner_file

  def self.banner_content
  	@@banner_file ||= self.identify_banner_file
  	@@banner_file[:file].blank? ? nil : @@banner_file[:file]
  end

  def self.banner_category
    @@banner_file ||= self.identify_banner_file
    @@banner_file[:category]
  end

  private

  def self.identify_banner_file
    category_2 = File.open("#{Rails.root}/app/views/notifications/banner_category_2.erb").to_s.strip
    unless category_2.blank?
      return { :file => category_2, :category => :category_2 }
    end

    category_1 = File.open("#{Rails.root}/app/views/notifications/banner_category_1.erb").to_s.strip
    unless category_1.blank?
      return { :file => category_1, :category => :category_1 }
    end

    { :file => nil, :category => nil }
  end
end
