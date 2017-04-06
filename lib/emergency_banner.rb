class EmergencyBanner
  def initialize
    @redis = Redis.new
  end

  def enabled?
    content && campaign_class && heading
  end

private

  def content
    @data ||= @redis.hgetall("emergency_banner")
    @data.symbolize_keys if @data
  end

  def campaign_class
    content[:campaign_class] if content[:campaign_class].present?
  end

  def heading
    content[:heading] if content[:heading].present?
  end
end
