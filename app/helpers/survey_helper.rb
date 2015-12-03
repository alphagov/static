module SurveyHelper
  def during_test_period?
    Time.zone.today >= Time.zone.parse("2015-12-09") &&
      Time.zone.today <= Time.zone.parse("2015-12-11")
  end
end
