class RootController < ApplicationController
  layout false

  before_filter :validate_template_param

  rescue_from ActionView::MissingTemplate, :with => :error_404

  caches_page :template, :raw_template

  def raw_template
    file_path = Rails.root.join("app", "views", "root", "#{params[:template]}.raw.html.erb")
    error_404 and return unless File.exists?(file_path)
    render :text => File.read(file_path)
  end

  NON_LAYOUT_TEMPLATES = %w(
    barclays_epdq
    beta_notice
    campaign
    print
    proposition_menu
    homepage
  )
  def template
    if NON_LAYOUT_TEMPLATES.include?(params[:template])
      render :action => params[:template]
    else
      render :action => params[:template], :layout => 'govuk_template'
    end
  end

  private

  def validate_template_param
    # Allow alphanumeric and _ in template filenames.
    # Prevent any attempts to traverse directores etc...
    unless params[:template] =~ /\A\w+\z/
      error_404
    end
    # Prevent direct access to partials
    if params[:template].start_with?('_')
      error_404
    end
  end
end
