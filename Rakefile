require 'rake'
require 'rake/tasklib'

ENV['RACK_ENV'] ||= 'production'

require "bundler/setup"
Bundler.require(:default, ENV['RACK_ENV'])
load 'cdn_helpers/cdn_helpers.rake'

task :environment do
end

namespace :cdn do
  task :process_html do
    require 'logger'

    logger = Logger.new(STDOUT)
    public_root_path = Pathname.new(File.join(File.dirname(__FILE__), 'public'))
    
    asset_hosts = case ENV['RACK_ENV']
    when 'dev': %W(http://assets0.dev.alphagov.co.uk http://assets1.dev.alphagov.co.uk)
    when 'staging': %W(http://assets0.staging.alphagov.co.uk http://assets1.staging.alphagov.co.uk)
    when 'production': %W(http://assets0.alpha.gov.uk http://assets1.alpha.gov.uk)
    end

    Dir.glob(public_root_path.join("**/*.html")).each do |file_path|
      logger.warn "Processing file #{file_path}"
      CdnHelpers::HtmlRewriter.rewrite_file(logger, file_path, public_root_path, asset_hosts)
    end
  end
end
