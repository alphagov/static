class RootController < ApplicationController
  layout false

  before_filter :validate_template_param, only: [:template, :raw_govuk_component_template, :raw_root_template]

  rescue_from ActionView::MissingTemplate, with: :error_404

  caches_page :template, :raw_root_template, :raw_govuk_component_template, :govuk_available_locales, :govuk_locales

  def raw_root_template
    render_raw_template("root", params[:template])
  end

  def raw_govuk_component_template
    render_raw_template("govuk_component", params[:template])
  end

  def govuk_component_docs
    doc_files = Rails.root.join('app', 'views', 'govuk_component', 'docs', '*.yml')
    docs = Dir[doc_files].sort.map do |file|
      {id: File.basename(file, '.yml')}.merge(YAML::load_file(file))
    end
    render json: docs
  end

  def govuk_available_locales
    locale_files = Rails.root.join("config", "locales", "*.yml")
    locales = Dir[locale_files].map { |file| File.basename(file, '.yml') }
    render json: locales
  end

  def govuk_locales
    # Smart Answers uses "en-GB" instead of "en". We don't have a specfic en-GB
    # locale for the components. This will make return the English locale since
    # it's a reasonable fallback.
    params[:locale] = "en" if params[:locale] == "en-GB"

    return error_404 unless params[:locale].match(/^[a-z]{2}(-[a-z0-9]{2,3})?$/)
    locale_file_path = Rails.root.join("config", "locales", "#{params[:locale]}.yml")
    render_yaml_as_json(locale_file_path)
  end

  NON_LAYOUT_TEMPLATES = %w(
    campaign
    print
    proposition_menu
    homepage
  )
  def template
    if NON_LAYOUT_TEMPLATES.include?(params[:template])
      render action: params[:template]
    else
      render action: params[:template], layout: 'govuk_template'
    end
  end

  private

  def render_yaml_as_json(file_path)
    error_404 and return unless File.exists?(file_path)
    render json: YAML::load_file(file_path)
  end

  def render_raw_template(prefix, file_name)
    file_path = Rails.root.join("app", "views", prefix, "#{file_name}.raw.html.erb")
    error_404 and return unless File.exists?(file_path)
    render text: File.read(file_path)
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
