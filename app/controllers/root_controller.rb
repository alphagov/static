class RootController < ApplicationController

  def related
    render :text => File.read("#{Rails.root}/app/views/root/related.raw.html.erb")
  end

end
