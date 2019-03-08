require 'json'

Rake::Task['assets:precompile'].enhance do
  Rake::Task['asset_precompile:create_non_digest_assets'].invoke
end

namespace :asset_precompile do
  task :create_non_digest_assets do
    relative_asset_path = 'public/static'
    manifest_path = Dir.glob(File.join(Rails.root, relative_asset_path, '.sprockets-manifest-*.json')).first

    manifest_data = JSON.parse(File.read(manifest_path))

    manifest_data["assets"].each do |logical_path, digested_path|
      if logical_path.end_with?('.js')
        full_digested_path = File.join(Rails.root, relative_asset_path, digested_path)
        full_nondigested_path = File.join(Rails.root, relative_asset_path, logical_path)

        FileUtils.ln_s full_digested_path, full_nondigested_path, force: true
      end
    end
  end
end
