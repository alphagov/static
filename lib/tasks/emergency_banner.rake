namespace :emergency_banner do
  desc 'Deploy the emergency banner'
  task :deploy, [:campaign_class, :heading] => :environment do |_, args|
    raise ArgumentError unless args.campaign_class
    raise ArgumentError unless args.heading

    EmergencyBanner::Deploy.new.run
  end
end
