namespace :router do
  task :router_environment do
    require 'plek'
    require 'gds_api/router'

    @router_api = GdsApi::Router.new(Plek.current.find('router-api'))
    @app_id = 'static'
  end

  task :register_backend => :router_environment do
    url = Plek.current.find(@app_id, :force_http => true) + "/"
    puts "Registering #{@app_id} application against #{url}"
    @router_api.add_backend(@app_id, url)
  end

  task :register_routes => :router_environment do
    [
      %w(/favicon.ico exact),
      %w(/humans.txt exact),
      %w(/robots.txt exact),
      %w(/google6db9c061ce178960.html exact), # DWP YouTube annotations
      %w(/google991dec8b62e37cfb.html exact),
      %w(/googlef35857dca8b812e7.html exact),
      %w(/apple-touch-icon.png exact static),
      %w(/apple-touch-icon-144x144.png exact),
      %w(/apple-touch-icon-114x114.png exact),
      %w(/apple-touch-icon-72x72.png exact),
      %w(/apple-touch-icon-57x57.png exact),
      %w(/apple-touch-icon-precomposed.png exact),
    ].each do |path, type|
      begin
        puts "Registering #{type} route #{path}"
        @router_api.add_route(path, type, @app_id)
      rescue => e
        puts "Error registering route: #{e.message}"
        raise
      end
    end

    @router_api.commit_routes
  end

  desc "Register application and routes with the router"
  task :register => [ :register_backend, :register_routes ]
end
