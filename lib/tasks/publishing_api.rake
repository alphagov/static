ROUTES = [
  {
    base_path: "/favicon.ico",
    content_id: "5fc8b4bc-f899-4d4e-ae10-f9beeb172f50",
    title: "Favicon",
    description: "The favicon is the image displayed in locations such as the browser tabs.",
  },
].freeze

namespace :publishing_api do
  desc "Publish special routes such as humans.txt"
  task publish_special_routes: :environment do
    require "gds_api/publishing_api/special_route_publisher"

    publisher = GdsApi::PublishingApi::SpecialRoutePublisher.new(
      logger: Logger.new($stdout),
      publishing_api: GdsApi.publishing_api,
    )

    ROUTES.each do |route|
      publisher.publish(
        route.merge(
          document_type: "special_route",
          schema_name: "special_route",
          type: "exact",
          publishing_app: "static",
          rendering_app: "static",
          public_updated_at: Time.zone.now.iso8601,
          update_type: "major",
        ),
      )
    end
  end
end
