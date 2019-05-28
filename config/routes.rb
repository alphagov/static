Rails.application.routes.draw do
  get "/component-guide" => redirect("https://govuk-publishing-components.herokuapp.com/component-guide")

  scope format: false do
    with_options to: proc { [410, {}, ['The component system has moved to https://github.com/alphagov/govuk_publishing_components']] } do
      get "/templates/govuk_component/:template.raw.html.erb"
      get "/templates/govuk_component/docs"
      get "/templates/locales"
      get "/templates/locales/:locale"
    end

    get "/templates/:template.html.erb", to: "root#template"
  end
  
  get "/cachable_routes", to: "CacheRoutesController#cachable_routes"

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
