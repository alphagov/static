require_relative "../emergency_banner/deploy"
require_relative "../emergency_banner/remove"

namespace :emergency_banner do
  desc "Deploy the emergency banner"
  task :deploy, [] => :environment do |_, args|
    campaign_class, heading, short_description, link, link_text = args.extras
    raise ArgumentError unless campaign_class
    raise ArgumentError unless heading
    raise ArgumentError, "Expected up to 5 arguments. #{args.extras.count} were provided" if args.extras.count > 5

    EmergencyBanner::Deploy.new.run(campaign_class, heading, short_description, link, link_text)
  end

  desc "Remove the emergency banner"
  task remove: :environment do
    EmergencyBanner::Remove.new.run
  end
end
