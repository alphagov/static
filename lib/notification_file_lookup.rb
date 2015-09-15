class NotificationFileLookup
  def banner
    @banner_file ||= identify_banner_file
  end

  def banner=(file)
    @banner_file = file
  end

  private

  def identify_banner_file
    red = File.read("#{Rails.root}/app/views/notifications/banner_red.erb").strip
    green = File.read("#{Rails.root}/app/views/notifications/banner_green.erb").strip

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
