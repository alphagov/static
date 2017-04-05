class EmergencyBanner
  def enabled?
    redis = Redis.new
    redis.get("emergency_banner:enabled")
  end
end
