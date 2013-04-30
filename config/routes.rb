Static::Application.routes.draw do

  # Templates
  get "/templates/wrapper.html.erb", :to => "root#wrapper"
  get "/templates/wrapper_with_js_last.html.erb", :to => "root#wrapper_with_js_last"
  get "/templates/print.html.erb", :to => "root#print"
  get "/templates/homepage.html.erb", :to => "root#homepage"
  get "/templates/admin.html.erb", :to => "root#admin"
  get "/templates/header_footer_only.html.erb", :to => "root#header_footer_only"
  get "/templates/chromeless.html.erb", :to => "root#chromeless"

  get "/templates/barclays_epdq.html", :to => "root#barclays_epdq"

  # Snippets
  get "/templates/campaign.html.erb", :to => "root#campaign"
  get "/templates/related.raw.html.erb", :to => "root#related"
  get "/templates/report_a_problem.raw.html.erb", :to => "root#report_a_problem"
  get "/templates/beta_notice.html.erb", :to => "root#beta_notice"
  get "/templates/proposition_menu.html.erb", :to => "root#proposition_menu"

  # Errors
  get "/templates/404.html.erb", :to => "root#404"
  get "/templates/406.html.erb", :to => "root#406"
  get "/templates/410.html.erb", :to => "root#410"
  get "/templates/418.html.erb", :to => "root#418"
  get "/templates/500.html.erb", :to => "root#500"
  get "/templates/501.html.erb", :to => "root#501"
  get "/templates/503.html.erb", :to => "root#503"
  get "/templates/504.html.erb", :to => "root#504"

  # Icon redirects
  get "/apple-touch-icon.png", :to => "apple_icons#show"
  get "/apple-touch-icon-144x144.png", :to => "apple_icons#show"
  get "/apple-touch-icon-114x114.png", :to => "apple_icons#show"
  get "/apple-touch-icon-72x72.png", :to => "apple_icons#show"
  get "/apple-touch-icon-57x57.png", :to => "apple_icons#show"
  get "/apple-touch-icon-precomposed.png", :to => "apple_icons#show"
end
