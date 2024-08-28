ROUTES = [
  {
    base_path: "/favicon.ico",
    content_id: "5fc8b4bc-f899-4d4e-ae10-f9beeb172f50",
    title: "Favicon",
    description: "The favicon is the image displayed in locations such as the browser tabs.",
  },
  { # See https://gov-uk.atlassian.net/wiki/spaces/GOVUK/pages/3585441793/Google+Search+Console for ownership of these verification tokens
    base_path: "/googlea6393a390aadfbaa.html",
    content_id: "5a14203f-f79e-4cca-831e-668043f49f1a",
    title: "Google site verification a6393a390aadfbaa",
    description: "These files allow Google to verify ownership of a site.
                      They should not be removed as that can cause the site to become unverified
                      See https://support.google.com/webmasters/answer/35658",
  },
  {
    base_path: "/googlec908b3bc32386239.html",
    content_id: "7ca03916-4340-4b95-a4dd-3078c0446768",
    title: "Google site verification c908b3bc32386239",
    description: "These files allow Google to verify ownership of a site.
                      They should not be removed as that can cause the site to become unverified
                      See https://support.google.com/webmasters/answer/35658",
  },
  {
    base_path: "/BingSiteAuth.xml",
    content_id: "d793dba8-4ff7-4a3f-a6d3-54f52b7bd259",
    title: "Bing site verification",
    description: "This file allows Bing to verify ownership of a site.
                      It should not be removed as that can cause the site to become unverified
                      See https://www.bing.com/webmaster/help/how-to-verify-ownership-of-your-site-afcfefc6",
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
  {
    base_path: "/apple-touch-icon-114x114-precomposed.png",
    content_id: "c15ee6fd-fb3a-45ab-b9e1-0efe1a8a6c2e",
    title: "Crest for Apple iOS bookmarks",
    description: "Used by iOS when saving GOV.UK as a shortcut icon.",
  },
  {
    base_path: "/apple-touch-icon-120x120-precomposed.png",
    content_id: "2e676337-94f3-4f4f-8501-83a1c7813bf8",
    title: "Crest for Apple iOS bookmarks",
    description: "Used by iOS when saving GOV.UK as a shortcut icon.",
  },
  {
    base_path: "/apple-touch-icon-144x144-precomposed.png",
    content_id: "5fd9d11e-997a-4850-ad69-a43a3aec8a9f",
    title: "Crest for Apple iOS bookmarks",
    description: "Used by iOS when saving GOV.UK as a shortcut icon.",
  },
  {
    base_path: "/apple-touch-icon-152x152-precomposed.png",
    content_id: "39541207-fdce-4415-8498-42477fce4b58",
    title: "Crest for Apple iOS bookmarks",
    description: "Used by iOS when saving GOV.UK as a shortcut icon.",
  },
  {
    base_path: "/apple-touch-icon-176x176-precomposed.png",
    content_id: "96833c45-64e2-4bdb-af43-90a96be2a1a3",
    title: "Crest for Apple iOS bookmarks",
    description: "Used by iOS when saving GOV.UK as a shortcut icon.",
  },
  {
    base_path: "/apple-touch-icon-180x180-precomposed.png",
    content_id: "db853854-42a6-49ce-95c5-0b41b4bed921",
    title: "Crest for Apple iOS bookmarks",
    description: "Used by iOS when saving GOV.UK as a shortcut icon.",
  },
  {
    base_path: "/apple-touch-icon-57x57-precomposed.png",
    content_id: "ead323b2-80e0-494f-8b1d-f7f998b9267c",
    title: "Crest for Apple iOS bookmarks",
    description: "Used by iOS when saving GOV.UK as a shortcut icon.",
  },
  {
    base_path: "/apple-touch-icon-72x72-precomposed.png",
    content_id: "4068ca41-f6b1-48d5-a19d-3ea85be49434",
    title: "Crest for Apple iOS bookmarks",
    description: "Used by iOS when saving GOV.UK as a shortcut icon.",
  },
  {
    base_path: "/apple-touch-icon-76x76-precomposed.png",
    content_id: "0526a59d-c9f8-4d44-8649-e54d532a0b35",
    title: "Crest for Apple iOS bookmarks",
    description: "Used by iOS when saving GOV.UK as a shortcut icon.",
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
