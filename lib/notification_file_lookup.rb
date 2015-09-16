class NotificationFileLookup
  def initialize(banner_file_location = "#{Rails.root}/app/views/notifications")
    @banner_file_location = banner_file_location
  end

  def banner
    @banner_file ||= identify_banner_file
  end

  def banner=(file)
    @banner_file = file
  end

  private

  def identify_banner_file
    red = File.read(File.join(@banner_file_location, "banner_red.erb")).strip
    green = File.read(File.join(@banner_file_location, "banner_green.erb")).strip

    case
    when red.present?
      { file: red, colour: :red }
    when green.present?
      { file: green, colour: :green }
    else
      nil
    end
  end
end
