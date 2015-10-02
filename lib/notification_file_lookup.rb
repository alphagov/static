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
    %i{red green black}.each do |banner_class|
      contents = File.read(File.join(@banner_file_location, "banner_#{banner_class}.erb")).strip
      return { file: contents, colour: banner_class } if contents.present?
    end

    nil
  end
end
