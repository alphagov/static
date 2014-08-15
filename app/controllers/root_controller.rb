class RootController < ApplicationController
  layout false

  before_filter :validate_template_param, :except => [:govuk_component_docs]

  rescue_from ActionView::MissingTemplate, :with => :error_404

  caches_page :template, :raw_root_template, :raw_govuk_component_template

  def raw_root_template
    render_raw_template("root", params[:template])
  end

  def raw_govuk_component_template
    render_raw_template("govuk_component", params[:template])
  end

  def govuk_component_docs
    component_doc = JSON.parse(File.read(File.join(Rails.root, 'app', 'views', 'govuk_component', 'docs.json')))
    render :json => component_doc
  end

  NON_LAYOUT_TEMPLATES = %w(
    alpha_label
    barclays_epdq
    beta_notice
    beta_label
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

  def render_raw_template(prefix, file_name)
    file_path = Rails.root.join("app", "views", prefix, "#{file_name}.raw.html.erb")
    error_404 and return unless File.exists?(file_path)
    render :text => File.read(file_path)
  end

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
