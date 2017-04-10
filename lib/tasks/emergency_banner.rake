require_relative '../emergency_banner/deploy'
require_relative '../emergency_banner/remove'

namespace :emergency_banner do
  desc 'Deploy the emergency banner'
  task :deploy, [:campaign_class, :heading, :short_description, :link] => :environment do |_, args|
    raise ArgumentError unless args.campaign_class
    raise ArgumentError unless args.heading

    EmergencyBanner::Deploy.new.run(args.campaign_class, args.heading, args.short_description, args.link)
  end

  desc 'Remove the emergency banner'
  task remove: :environment do
    EmergencyBanner::Remove.new.run
  end
end
