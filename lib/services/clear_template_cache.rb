class Services::ClearTemplateCache
  def self.run!
    RootController::TEMPLATES.each do |template|
      ActionController::Base.expire_page("templates/#{template}.html.erb")
    end
  end
end
