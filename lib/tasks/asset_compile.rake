require "json"

Rake::Task["assets:precompile"].enhance do
  Rake::Task["asset_precompile:create_non_digest_assets"].invoke
end

namespace :asset_precompile do
  desc "Create aliases for assets with random/digest filenames"
  task create_non_digest_assets: :environment do
    relative_asset_path = "public/static"
    manifest_path = Dir.glob(Rails.root.join(relative_asset_path, ".sprockets-manifest-*.json")).first

    manifest_data = JSON.parse(File.read(manifest_path))

    manifest_data["assets"].each do |logical_path, digested_path|
      if logical_path.end_with?(".js")
        full_digested_path = Rails.root.join(relative_asset_path, digested_path)
        full_nondigested_path = Rails.root.join(relative_asset_path, logical_path)

        FileUtils.ln_s full_digested_path, full_nondigested_path, force: true

        if logical_path == "libs/jquery/jquery-1.12.4.js"
          jquery_nondigested_path = Rails.root.join(relative_asset_path, "libs/jquery/jquery-1.7.2.js")

          FileUtils.ln_s full_digested_path, jquery_nondigested_path, force: true
        end
      end
    end
  end
end
