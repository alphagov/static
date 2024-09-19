Rails.application.routes.draw do
  mount GovukPublishingComponents::Engine, at: "/component-guide" if Rails.env.development?

  get "/healthcheck/live", to: proc { [200, {}, %w[OK]] }
  get "/healthcheck/ready", to: GovukHealthcheck.rack_response

  scope format: false do
    scope to: proc { [410, {}, ["The component system has moved to https://github.com/alphagov/govuk_publishing_components"]] } do
      get "/templates/govuk_component/:template.raw.html.erb"
      get "/templates/govuk_component/docs"
      get "/templates/locales"
      get "/templates/locales/:locale"
    end

    get "/templates/:template.html.erb", to: "root#template"
  end

  # Favicon redirect
  get "/favicon.ico", to: "icon_redirects#show_favicon"
end
