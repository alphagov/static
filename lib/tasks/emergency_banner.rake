namespace :emergency_banner do
  desc 'Deploy the emergency banner'
  task :deploy, [:campaign_class] => :environment do |_, args|
    raise ArgumentError unless args.campaign_class

    EmergencyBanner::Deploy.new.run
  end
end
