module EmergencyBanner
  class Display
    class << self
      def client
        @client ||= Redis.new(
          url: ENV["EMERGENCY_BANNER_REDIS_URL"],
          reconnect_attempts: [
            15,
            30,
            45,
            60,
          ],
        )
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

      content[:link_text].presence
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
