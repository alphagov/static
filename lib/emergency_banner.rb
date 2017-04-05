class EmergencyBanner
  def initialize
    @redis = Redis.new
  end

  def enabled?
    content && has_campaign_class?
  end

  def has_campaign_class?
    content.has_key?(:campaign_class) && content.fetch(:campaign_class).present?
  end

  def content
    @redis.hgetall("emergency_banner")
  end
end
