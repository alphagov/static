require 'integration_test_helper'
require 'webmock/minitest'
require 'slimmer/test_helpers/govuk_components'

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

class ComponentGuideTest < ActionDispatch::IntegrationTest
  include Slimmer::TestHelpers::GovukComponents

  def setup
    stub_shared_component_locales
  end

  context "component guide" do
    should "render an index" do
      visit "/component-guide"
      assert page.has_selector? "title", text: 'Static Component Guide', visible: false
      assert page.has_selector? '.pub-c-title', text: 'Static Component Guide'
    end

    should "render all component previews without erroring" do
      visit '/component-guide'
      all(:css, '.component-list a').map { |el| "#{el[:href]}/preview" }.each { |component| visit component }
    end
  end
end
