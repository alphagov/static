require 'integration_test_helper'

class AssetRedirectionTest < ActionDispatch::IntegrationTest
  should "redirect /static/overseas-passport/OS_Payment_Instruction.pdf to the relevant publication" do
    get "/static/overseas-passport/OS_Payment_Instruction.pdf"
    assert_redirected_to "http://www.dev.gov.uk/government/publications/overseas-passport-creditdebit-card-payment-authorisation"
  end
end
