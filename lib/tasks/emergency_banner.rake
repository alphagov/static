require_relative "../emergency_banner/deploy"
require_relative "../emergency_banner/remove"

namespace :emergency_banner do
  desc "Deploy the emergency banner"
  task :deploy, %i[campaign_class heading short_description link link_text] => :environment do |_, args|
    raise ArgumentError unless args.campaign_class
    raise ArgumentError unless args.heading

    EmergencyBanner::Deploy.new.run(args.campaign_class, args.heading, args.short_description, args.link, args.link_text)
    Services::ClearTemplateCache.run!
  end

  desc "Remove the emergency banner"
  task remove: :environment do
    EmergencyBanner::Remove.new.run
    Services::ClearTemplateCache.run!
  end
end
