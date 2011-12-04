Static::Application.routes.draw do
  match "/templates/wrapper.html.erb", :to => "root#wrapper"
  match "/templates/homepage.html.erb", :to => "root#homepage"
  match "/templates/admin.html.erb", :to => "root#admin"
  match "/templates/404.html.erb", :to => "root#404"
  match "/templates/500.html.erb", :to => "root#500"
end
