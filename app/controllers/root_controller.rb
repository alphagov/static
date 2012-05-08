class RootController < ApplicationController
  before_filter :load_popular_items, only: [:wrapper_with_fat_footer]
  
  def related
    render :text => File.read("#{Rails.root}/app/views/root/related.raw.html.erb")
  end
  
  def load_popular_items
    file = File.open(Rails.root.join("data", "popular_items.json"), 'r')
    @popular_items = JSON.load(file)
  end

end
