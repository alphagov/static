require "test_helper"

class TimedUpdateHelperTest < ActiveSupport::TestCase
  include TimedUpdateHelper

  test "#before_update_time? returns true if we haven't reached the requested time yet" do
    Timecop.freeze(2024, 6, 17, 23, 59)
    assert before_update_time?(year: 2024, month: 6, day: 18, hour: 0, minute: 0)
  end

  test "#before_update_time? returns false if we've reached the requested time" do
    Timecop.freeze(2024, 6, 18, 0, 0)
    assert_not before_update_time?(year: 2024, month: 6, day: 18, hour: 0, minute: 0)
  end

  test "#before_update_time? returns false if we've passed the requested time" do
    Timecop.freeze(2024, 6, 20, 10, 10)
    assert_not before_update_time?(year: 2024, month: 6, day: 18, hour: 0, minute: 0)
  end
end
