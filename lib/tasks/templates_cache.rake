namespace :templates_cache do
  desc "Clear the templates cache - should be run on a schedule"
  task clear: :environment do
    Services::ClearTemplateCache.run!
  end
end
