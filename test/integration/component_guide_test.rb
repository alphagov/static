require 'integration_test_helper'
require 'webmock/minitest'
require 'slimmer/test_helpers/govuk_components'
require 'govuk_publishing_components/minitest/component_guide_test'

module GovukPublishingComponentsSkipSlimmer
  extend ActiveSupport::Concern

  included do
    before_action :skip_slimmer
  end

  def skip_slimmer
    response.headers[Slimmer::Headers::SKIP_HEADER] = "true" unless ENV['USE_SLIMMER'] == "true"
  end
end

GovukPublishingComponents::ApplicationController.include(GovukPublishingComponentsSkipSlimmer)

# Tests aren't going through Slimmer so we need to explicitly include styles
GovukPublishingComponents.configure do |c|
  c.application_print_stylesheet = "core-layout-print"
  c.application_stylesheet = "core-layout"
end

class ComponentGuideTest < ActionDispatch::IntegrationTest
  include GovukPublishingComponents::Minitest::ComponentGuideTest
  include Slimmer::TestHelpers::GovukComponents

  def setup
    WebMock.disable_net_connect!(allow_localhost: true)
    Capybara.current_driver = Capybara.javascript_driver
    stub_shared_component_locales
  end

  context "component guide" do
    should "render govuk_components locally" do
      visit "/component-guide"
      assert page.has_selector? '.pub-c-title', text: 'Static Component Guide'
    end
  end

  def teardown
    Capybara.use_default_driver
  end
end
