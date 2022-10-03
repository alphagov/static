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
      content[:campaign_class].presence
    end

    def heading
      content[:heading].presence
    end

    def short_description
      content[:short_description].presence
    end

    def link
      content[:link].presence
    end

    def link_text
      return nil if link.blank?
      return content[:link_text] if content[:link_text].present?
    end

  private

    def content
      return @content if defined? @content

      @content = begin
        client.hgetall("emergency_banner").try(:symbolize_keys)
      rescue StandardError => e
        GovukError.notify(e)
        nil
      end
    end
  end
end
