Static::Application.routes.draw do
  controller "root", format: false do
    get "/templates/:template.raw.html.erb" => :raw_root_template
    get "/templates/govuk_component/:template.raw.html.erb" => :raw_govuk_component_template
    get "/templates/govuk_component/docs" => :govuk_component_docs
    get "/templates/locales" => :govuk_available_locales
    get "/templates/locales/:locale" => :govuk_locales
    get "/templates/:template.html.erb" => :template
  end

  # Icon redirects
  get "/favicon.ico", to: "icon_redirects#show"
  get "/apple-touch-icon.png", to: "icon_redirects#show"
  get "/apple-touch-icon-180x180.png", to: "icon_redirects#show"
  get "/apple-touch-icon-167x167.png", to: "icon_redirects#show"
  get "/apple-touch-icon-152x152.png", to: "icon_redirects#show"

  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)
end
