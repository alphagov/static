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

private

  def content
    @data ||= @redis.hgetall("emergency_banner")
    @data.symbolize_keys if @data
  end
end
