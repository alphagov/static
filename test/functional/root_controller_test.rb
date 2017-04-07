require "integration_test_helper"

class RootControllerTest < ActionController::TestCase
  context "a template using the base partial" do
    setup do
      stub_template "root/dummy.html.erb" => "<%= render partial: 'base' %>"
      EmergencyBanner.any_instance.stubs(:enabled?).returns(false)
    end

    context "with a blank promo banner partial" do
      should "not render the promo banner" do
        stub_template "root/_promo_banner.html.erb" => "<%# foo %>"

        get :template, template: 'dummy'

        assert_template "root/_promo_banner"
        refute @response.body.include?('id="global-bar"')
      end
    end

    context "with a promo banner partial" do
      should "render promo banner" do
        stub_template "root/_promo_banner.html.erb" => <<-EOF
          <!--[if gt IE 7]><!-->
          <div id="global-bar" data-module="global-bar" class="dont-print">
            <div class="global-bar-message-container">
              <p class="global-bar-message"><strong>Some Title</strong></p>
              <p class="global-bar-message">On some date something has happened. <a href="https://something.gov.uk/" rel="external noreferrer">More&nbsp;information<span class="visuallyhidden"> about things</span></a></p>
              <a href="#hide-message"
                 class="dismiss"
                 role="button"
                 aria-controls="global-bar">Hide&nbsp;message</a>
            </div>
          </div>
          <!--<![endif]-->
        EOF

        get :template, template: 'dummy'

        assert @response.body.include?('id="global-bar"')
        assert @response.body.include?("Some Title")
      end
    end
  end

  def stub_template(hash)
    require 'action_view/testing/resolvers'
    @controller.view_paths.unshift(ActionView::FixtureResolver.new(hash))
  end
end
