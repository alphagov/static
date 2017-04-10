namespace :emergency_banner do
  desc 'Deploy the emergency banner'
  task deploy: :environment do
    EmergencyBanner::Deploy.new.run
  end
end
