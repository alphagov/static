require "uri"

module EmergencyBanner
  class Deploy
    def run(campaign_class, heading, short_description = "", link = "", link_text = "")
      if link != ""
        uri = URI.parse(link)
        raise ArgumentError, "Invalid URL provided: #{link}" unless uri.is_a?(URI::HTTP) && !uri.host.nil?
      end

      redis = Redis.new
      redis.hmset(
        :emergency_banner,
        :campaign_class,
        campaign_class,
        :heading,
        heading,
        :short_description,
        short_description,
        :link,
        link,
        :link_text,
        link_text,
      )
    end
  end
end
