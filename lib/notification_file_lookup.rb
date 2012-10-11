class NotificationFileLookup
	cattr_accessor :banner_file

  def self.banner_content
  	@@banner_file ||= self.identify_banner_file
  	@@banner_file[:file].blank? ? nil : @@banner_file[:file]
  end

  def self.banner_colour
    @@banner_file ||= self.identify_banner_file
    @@banner_file[:colour]
  end

  private

  def self.identify_banner_file
    red = File.read("#{Rails.root}/app/views/notifications/banner_red.erb").strip
    unless red.blank?
      return { :file => red, :colour => :red }
    end

    green = File.read("#{Rails.root}/app/views/notifications/banner_green.erb").strip
    unless green.blank?
      return { :file => green, :colour => :green }
    end

    { :file => nil, :colour => nil }
  end
end
