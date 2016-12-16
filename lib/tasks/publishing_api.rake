namespace :publishing_api do
  desc "Publish special routes such as robots.txt"
  task :publish_special_routes do
    require 'gds_api/publishing_api/special_route_publisher'

    publishing_api = GdsApi::PublishingApiV2.new(
      Plek.new.find('publishing-api'),
      bearer_token: ENV['PUBLISHING_API_BEARER_TOKEN'] || 'example'
    )

    publisher = GdsApi::PublishingApi::SpecialRoutePublisher.new(
      logger: Logger.new(STDOUT),
      publishing_api: publishing_api
    )

    routes = [
      {
        base_path: "/favicon.ico",
        content_id: "5fc8b4bc-f899-4d4e-ae10-f9beeb172f50",
        title: "Favicon",
        description: "The favicon is the image displayed in locations such as the browser tabs.",
      },
      {
        base_path: "/humans.txt",
        content_id: "6e92af59-3a73-4db6-b58b-740a02b229d0",
        title: "humans.txt",
        description: "In opposition to robots.txt, humans.txt provides information about GOV.UK to interested readers,
                      such as developers interested in joining GDS.",
      },
      {
        base_path: "/google6db9c061ce178960.html",
        content_id: "10bdfc2b-6e25-45d9-8a6d-330bd70de056",
        title: "Google site verification 6db9c061ce178960",
        description: "These files allow Google to verify ownership of a site.
                      They should not be removed as that can cause the site to become unverified
                      See https://support.google.com/webmasters/answer/35658",
      },
      {
        base_path: "/google991dec8b62e37cfb.html",
        content_id: "2bd98a91-9aaf-4cf0-8145-dd45de947de2",
        title: "Google site verification 991dec8b62e37cfb",
        description: "These files allow Google to verify ownership of a site.
                      They should not be removed as that can cause the site to become unverified
                      See https://support.google.com/webmasters/answer/35658",
      },
      {
        base_path: "/googlef35857dca8b812e7.html",
        content_id: "698ebb90-593f-4aee-bc16-af8e532eca26",
        title: "Google site verification f35857dca8b812e7",
        description: "These files allow Google to verify ownership of a site.
                      They should not be removed as that can cause the site to become unverified
                      See https://support.google.com/webmasters/answer/35658",
      },
      {
        base_path: "/apple-touch-icon.png",
        content_id: "cdc36458-74d4-42a7-86c8-221e03877dfc",
        title: "Crest for Apple iOS bookmarks",
        description: "Used by iOS when saving GOV.UK as a shortcut icon.",
      },
      {
        base_path: "/apple-touch-icon-144x144.png",
        content_id: "a18912cb-94ff-46a0-b9a3-5f707b0dca2f",
        title: "Crest for Apple iOS bookmarks 144px by 144px",
        description: "Used by iOS when saving GOV.UK as a shortcut icon.",
      },
      {
        base_path: "/apple-touch-icon-114x114.png",
        content_id: "d8a8b79a-b056-4f87-bb48-47566645f358",
        title: "Crest for Apple iOS bookmarks 114px by 114px",
        description: "Used by iOS when saving GOV.UK as a shortcut icon.",
      },
      {
        base_path: "/apple-touch-icon-72x72.png",
        content_id: "98fc34ab-b620-4bd4-bc8a-d4db63960f4f",
        title: "Crest for Apple iOS bookmarks 72px by 72px",
        description: "Used by iOS when saving GOV.UK as a shortcut icon.",
      },
      {
        base_path: "/apple-touch-icon-57x57.png",
        content_id: "c7de1c80-f278-49c4-84cd-a8ff53149ab6",
        title: "Crest for Apple iOS bookmarks 57px by 57px",
        description: "Used by iOS when saving GOV.UK as a shortcut icon.",
      },
      {
        base_path: "/apple-touch-icon-precomposed.png",
        content_id: "d8c1618b-ad27-42f3-a7cd-b11f4b90a15e",
        title: "Crest for Apple iOS bookmarks",
        description: "Used by iOS when saving GOV.UK as a shortcut icon.",
      },
    ]

    routes.each do |route|
      publisher.publish(
        route.merge(
          document_type: "special_route",
          schema_name: "special_route",
          type: "exact",
          publishing_app: "static",
          rendering_app: "static",
          public_updated_at: Time.now.iso8601,
          update_type: "major",
        )
      )
    end
  end
end
