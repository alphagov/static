class NotificationFileLookup
  include Singleton

  cattr_accessor :banner_file, :campaign_file

  def banner
    @banner_file ||= identify_banner_file
    @banner_file[:file].blank? ? nil : @banner_file
  end

  def banner=(file)
    @banner_file = file
  end

  def campaign
    @campaign_file ||= identify_campaign_file
    @campaign_file[:file].blank? ? nil : @campaign_file
  end

  def campaign=(file)
    @campaign_file = file
  end

  private

  def identify_banner_file
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

  def identify_campaign_file
    black = File.read("#{Rails.root}/app/views/notifications/campaign_black.erb").strip
    unless black.blank?
      return { :file => black, :colour => :black }
    end

    red = File.read("#{Rails.root}/app/views/notifications/campaign_red.erb").strip
    unless red.blank?
      return { :file => red, :colour => :red }
    end

    green = File.read("#{Rails.root}/app/views/notifications/campaign_green.erb").strip
    unless green.blank?
      return { :file => green, :colour => :green }
    end

    { :file => nil, :colour => nil }
  end
end
