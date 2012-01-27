namespace :static do
  
  desc "Fetch autocomplete data from rummager and store in assets. " \
    "Allows the preload_autocomplete.json file to be served from the CDN."
    
  task :fetch_autocomplete_data => :environment do
    source_url = Plek.current.find('search') + "/preload-autocomplete"
    destination_path = Rails.root.join(*%w{app assets json preload-autocomplete.json})
    temp_path = "#{destination_path}.tmp"
    print "Fetching '#{source_url}' to '#{temp_path}' .. "
    output = `curl -D - -o '#{temp_path}' '#{source_url}' 2>&1`
    raise output unless $?.success?
    status_line = output.lines.grep(%r{^HTTP/1\.. ([0-9]+)}).inspect
    raise "No http status line in output when requesting '#{source_url}'):\n #{output}" unless status_line
    status_code = status_line.match(%r{HTTP/1\.. ([0-9]+)})[1]
    raise "HTTP response error #{status_code} when requesting '#{source_url}':\n #{output}" unless status_code == '200'
    puts "OK"
    File.rename(temp_path, destination_path) or raise "Unable to rename #{temp_path} to #{destination_path}"
    puts "Renamed temp file to '#{destination_path}'"
    puts "SUCCESS."
  end
end