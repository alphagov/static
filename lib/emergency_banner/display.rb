module EmergencyBanner
  class Display
    class << self
      def client
        @client ||= Redis.new(timeout: 0.1)
      end
    end

    def client
      self.class.client
    end

    def enabled?
      content && campaign_class && heading
    end

    def campaign_class
      content[:campaign_class] if content[:campaign_class].present?
    end

    def heading
      content[:heading] if content[:heading].present?
    end

    def short_description
      content[:short_description] if content[:short_description].present?
    end

    def link
      content[:link] if content[:link].present?
    end

    def link_text
      return nil if link.blank?
      return content[:link_text] if content[:link_text].present?
      MORE_INFORMATION
    end

  private

    MORE_INFORMATION = "More information"

    def content
      return @content if defined? @content
      @content = begin
        client.hgetall("emergency_banner").try(:symbolize_keys)
      rescue => e
        GovukError.notify(e)
        nil
      end
    end
  end
end
