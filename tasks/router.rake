
module RouterHelpers
  def register_application(application)
    begin
      @router.applications.create(application)
    rescue Router::Conflict
      existing = @router.applications.find(application[:application_id])
      @logger.info "Application already registered: #{existing}"
    end
  end

  def register_route(type, incoming_path)
    route = {
      application_id: @application[:application_id],
      route_type: type,
      incoming_path: incoming_path
    }
    begin
      @router.routes.create(route)
    rescue Router::Conflict
      existing = @router.routes.find(route[:incoming_path])
      @logger.info "Route already registered: #{existing.inspect}"
      updated = @router.routes.update(route)
      @logger.info "Route updated to: #{updated.inspect}"
    end
  end
end

namespace :router do
  include RouterHelpers

  task :router_environment do
    Bundler.require :router, :default

    require 'logger'
    @logger = Logger.new STDOUT
    @logger.level = Logger::DEBUG

    @router = Router::Client.new :logger => @logger
  end

  task :register_application => :router_environment do
    platform = ENV['FACTER_govuk_platform']
    @application = {
      application_id: "static",
      backend_url: "static.#{platform}.alphagov.co.uk/"
    }
    register_application(@application)
  end

  task :register_routes => :router_environment do
    register_route(:prefix, '/stylesheets')
    register_route(:prefix, '/javascripts')
    register_route(:prefix, '/images')
    register_route(:prefix, '/templates')
    register_route(:full, '/favicon.ico')
    register_route(:full, '/robots.txt')
  end

  desc "Register application and routes with the router (run this task on server in cluster)"
  task :register => [ :register_application, :register_routes ]
end

