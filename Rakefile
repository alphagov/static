require 'rake'
require 'rake/tasklib'

ENV['RACK_ENV'] ||= 'production'

require "bundler/setup"
Bundler.require(:default, ENV['RACK_ENV'])
load 'cdn_helpers/cdn_helpers.rake'

task :environment do
end

namespace :cdn do
  desc "Iterate over each html file in public and process for cache busting and asset host URLs"
  task :process_html do
    require 'logger'

    logger = Logger.new(STDOUT)
    public_root_path = Pathname.new(File.join(File.dirname(__FILE__), 'public'))
    
    asset_hosts = case ENV['RACK_ENV']
    when 'dev' then %W(http://assets0.dev.alphagov.co.uk http://assets1.dev.alphagov.co.uk)
    # when 'staging' then %W(http://assets0.staging.alphagov.co.uk http://assets1.staging.alphagov.co.uk)
    when 'staging' then %W(http://staging.alphagov.co.uk:8080)
    when 'production' then %W(http://assets0.alpha.gov.uk http://assets1.alpha.gov.uk)
    when 'admin' then %W(https://admin.alphagov.co.uk)
    end
    
    CdnHelpers::AssetPath.set_hash_salt(ENV['CDN_HASH_SALT']) if ENV['CDN_HASH_SALT']

    FileList.new(public_root_path.join("**/*.html").to_s).exclude("google5edcc5ea3311ac5f.html").each do |file_path|
      logger.warn "Processing file #{file_path}"
      CdnHelpers::HtmlRewriter.rewrite_file(logger, file_path, public_root_path, asset_hosts)
    end
  end
end

namespace :css do
  def public_root_path
    Pathname.new(File.join(File.dirname(__FILE__), 'public'))
  end

  namespace :icons do
    task :search do
      puts "/* Search results icons */"
      FileList.new(public_root_path.join("images/search/*.gif").to_s).each do |path|
        filename = File.basename(path)
        class_name = File.basename(path, '.gif')
        puts "#search-everything .search-results li.#{class_name} {"
        puts "  background-image: url(/images/search/#{filename});"
        puts "}"
      end
      puts "/* END: Search results icons */"
    end
  end
end