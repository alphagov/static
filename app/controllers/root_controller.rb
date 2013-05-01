class RootController < ApplicationController

  before_filter :validate_template_param

  rescue_from ActionView::MissingTemplate, :with => :error_404

  caches_page :template, :raw_template

  def raw_template
    file_path = Rails.root.join("app", "views", "root", "#{params[:template]}.raw.html.erb")
    error_404 and return unless File.exists?(file_path)
    render :text => File.read(file_path)
  end

  def template
    render :action => params[:template]
  end

  private

  def validate_template_param
    unless params[:template] =~ /\A\w+\z/
      error_404
    end
    # Prevent direct access to partials
    if params[:template].start_with?('_')
      error_404
    end
  end
end
