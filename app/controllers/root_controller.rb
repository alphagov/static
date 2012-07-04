class RootController < ApplicationController

  caches_page :wrapper, :print, :related, :homepage, :admin
  caches_page *%w(404 406 418 500 501 503 504)

  def related
    render :text => File.read("#{Rails.root}/app/views/root/related.raw.html.erb")
  end

end
