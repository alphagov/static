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

  # Old devices with old OSs may still request these old image sizes
  # They should receive a working image.
  # It’s acceptable to send them a higher resolution image which they will downscale.
  # https://mathiasbynens.be/notes/touch-icons
  get "/apple-touch-icon-120x120.png", to: "icon_redirects#apple_old_size_icon"
  get "/apple-touch-icon-76x76.png", to: "icon_redirects#apple_old_size_icon"
  get "/apple-touch-icon-60x60.png", to: "icon_redirects#apple_old_size_icon"
  get "/apple-touch-icon-precomposed.png", to: "icon_redirects#apple_old_size_icon"

  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)
end
