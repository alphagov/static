class RootController < ApplicationController

  caches_page :campaign, :wrapper, :print, :related, :report_a_problem, :homepage, :admin
  caches_page *%w(404 406 418 500 501 503 504)

  def related
    return_raw_template("related")
  end

  def report_a_problem
    return_raw_template("report_a_problem")
  end

  private

  def return_raw_template(basename)
    render :text => File.read("#{Rails.root}/app/views/root/#{basename}.raw.html.erb")
  end
end
