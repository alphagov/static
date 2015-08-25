class RootController < ApplicationController
  layout false

  before_filter :validate_template_param, :only => [:template, :raw_govuk_component_template, :raw_root_template]

  rescue_from ActionView::MissingTemplate, :with => :error_404

  caches_page :template, :raw_root_template, :raw_govuk_component_template, :govuk_available_locales, :govuk_locales

  def raw_root_template
    render_raw_template("root", params[:template])
  end

  def raw_govuk_component_template
    render_raw_template("govuk_component", params[:template])
  end

  def govuk_component_docs
    render_yaml_as_json('govuk_component', 'docs.yml')
  end

  def govuk_available_locales
    locale_files = Rails.root.join('app', 'views', 'locales', '*.yml')
    locales = Dir[locale_files].map { |file| File.basename(file, '.yml') }
    render :json => locales
  end

  def govuk_locales
    return error_404 unless params[:locale].match(/^[a-z]{2}(-[a-z0-9]{2,3})?$/)
    render_yaml_as_json("locales", "#{params[:locale]}.yml")
  end

  NON_LAYOUT_TEMPLATES = %w(
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

  def render_yaml_as_json(folder, file)
    file_path = Rails.root.join('app', 'views', folder, file)
    error_404 and return unless File.exists?(file_path)
    render :json => YAML::load_file(file_path)
  end

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
