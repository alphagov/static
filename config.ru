root= File.join(File.dirname(__FILE__), "public")
puts ">>> Serving: #{root}"
run Rack::Directory.new("#{root}")

