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
    chromeless
    gem_layout
    gem_layout_account_manager
    gem_layout_account_manager_manage_your_account_active
    gem_layout_account_manager_no_nav
    gem_layout_explore_header
    gem_layout_full_width
    gem_layout_full_width_explore_header
    gem_layout_full_width_old_header
    gem_layout_no_feedback_form
    gem_layout_no_footer_navigation
    gem_layout_old_header
    gem_layout_old_header_full_width
    scheduled_maintenance
    print
  ].freeze

  def template
    if TEMPLATES.include?(params[:template])
      render action: params[:template]
    else
      error_404
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
