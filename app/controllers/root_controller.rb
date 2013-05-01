class RootController < ApplicationController

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
end
