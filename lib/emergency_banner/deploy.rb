module EmergencyBanner
  class Deploy
    def run(campaign_class, heading, short_description = "", link = "")
      redis = Redis.new
      redis.hmset(:emergency_banner,
                  :campaign_class, campaign_class,
                  :heading, heading,
                  :short_description, short_description,
                  :link, link,
                 )
    end
  end
end
