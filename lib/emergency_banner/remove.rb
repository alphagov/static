module EmergencyBanner
  class Remove
    def run
      redis = Redis.new
      redis.del(:emergency_banner)
    end
  end
end
