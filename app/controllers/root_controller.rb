class RootController < ApplicationController
  layout false

  before_action :validate_template_param, only: %i[template]

  rescue_from ActionView::MissingTemplate, with: :error_404

  caches_page :template

  NON_LAYOUT_TEMPLATES = %w[
    campaign
    print
    proposition_menu
  ].freeze
  def template
    if NON_LAYOUT_TEMPLATES.include?(params[:template])
      render action: params[:template]
    else
      render action: params[:template], layout: "govuk_template"
    end
  end

private

  def validate_template_param
    # Allow alphanumeric and _ in template filenames.
    # Prevent any attempts to traverse directores etc...
    unless params[:template].match?(/\A\w+\z/)
      error_404
    end
    # Prevent direct access to partials
    if params[:template].start_with?("_")
      error_404
    end
  end
end
