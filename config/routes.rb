Static::Application.routes.draw do

  controller "root", :format => false do
    get "/templates/:template.raw.html.erb" => :raw_template
    get "/templates/:template.html.erb" => :template
  end

  # Icon redirects
  get "/favicon.ico", :to => "icon_redirects#show"
  get "/apple-touch-icon.png", :to => "icon_redirects#show"
  get "/apple-touch-icon-144x144.png", :to => "icon_redirects#show"
  get "/apple-touch-icon-114x114.png", :to => "icon_redirects#show"
  get "/apple-touch-icon-72x72.png", :to => "icon_redirects#show"
  get "/apple-touch-icon-57x57.png", :to => "icon_redirects#show"
  get "/apple-touch-icon-precomposed.png", :to => "icon_redirects#show"
end
