require "test_helper"

class SanitiserTest < ActiveSupport::TestCase
  include Rack::Test::Methods

  def app
    Rails.application
  end

  test "with query being correct percent-encoded UTF-8 string does not raise exception" do
    get "/templates/print.html.erb?%41"
    assert last_response.successful?
  end

  test "with query being incorrect percent-encoded UTF-8 string raises SanitisingError" do
    assert_raises(Sanitiser::Strategy::SanitisingError) do
      get "/templates/print.html.erb?%AD"
    end
  end

  test "with cookie key being correct UTF-8 does not raise exception" do
    header("Cookie", "\x41=value")
    get "/templates/print.html.erb"
    assert last_response.successful?
  end

  test "with cookie key being incorrect UTF-8 raises exception" do
    header("Cookie", "\xAD=value")
    assert_raises(ArgumentError, match: "invalid byte sequence in UTF-8") do
      get "/templates/print.html.erb"
    end
  end

  test "with cookie value being correct UTF-8 does not raise exception" do
    header("Cookie", "key=\x41")
    get "/templates/print.html.erb"
    assert last_response.successful?
  end

  test "with cookie value being incorrect UTF-8 raises exception" do
    header("Cookie", "key=\xAD")
    assert_raises(ArgumentError, match: "invalid byte sequence in UTF-8") do
      get "/templates/print.html.erb"
    end
  end

  test "with cookie path being correct UTF-8 does not raise exception" do
    header("Cookie", "key=value; Path=/\x41")
    get "/templates/print.html.erb"
    assert last_response.successful?
  end

  test "with cookie path being incorrect UTF-8 raises exception" do
    header("Cookie", "key=value; Path=/\xAD")
    assert_raises(ArgumentError, match: "invalid byte sequence in UTF-8") do
      get "/templates/print.html.erb"
    end
  end

  test "with cookie path being correct percent-encoded UTF-8 does not raise exception" do
    header("Cookie", "key=value; Path=/%41")
    get "/templates/print.html.erb"
    assert last_response.successful?
  end

  test "with cookie path being incorrect percent-encoded UTF-8 raises SanitisingError" do
    header("Cookie", "key=value; Path=/%AD")
    assert_raises(Sanitiser::Strategy::SanitisingError) do
      get "/templates/print.html.erb"
    end
  end

  test "with referrer headerbeing correct percent-encoded UTF-8 does not raise exception" do
    header("Referer", "http://example.com/?%41")
    get "/templates/print.html.erb"
    assert last_response.successful?
  end

  test "with referrer header being incorrect percent-encoded UTF-8 does not raise exception" do
    header("Referer", "http://example.com/?%AD")
    get "/templates/print.html.erb"
    assert last_response.successful?
  end
end
