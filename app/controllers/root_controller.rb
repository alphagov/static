class RootController < ApplicationController
  layout false

  before_action :validate_template_param, only: %i[template]

  rescue_from ActionView::MissingTemplate, with: :error_404

  caches_page :template

  TEMPLATES = %w[
    400
    401
    403
    404
    405
    406
    410
    422
    429
    500
    501
    502
    503
    504
    campaign
    gem_layout
    gem_layout_account_manager
    gem_layout_explore_header
    gem_layout_full_width
    gem_layout_full_width_explore_header
    gem_layout_no_feedback_form
    gem_layout_no_footer_navigation
    scheduled_maintenance
    print
    proposition_menu
  ].freeze

  def template
    if TEMPLATES.include?(params[:template])
      render action: params[:template]
    else
      render action: params[:template], layout: "govuk_template"
    end
  end

private

  def validate_template_param
    # Allow alphanumeric and _ in template filenames.
    # Prevent any attempts to traverse directories etc...
    unless params[:template].match?(/\A\w+\z/)
      error_404
    end
    # Prevent direct access to partials
    if params[:template].start_with?("_")
      error_404
    end
  end
end
