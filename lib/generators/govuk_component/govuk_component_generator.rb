require 'json'

class GovukComponentGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('../templates', __FILE__)

  def copy_component_files
    @public_name = file_name.dasherize

    template 'component.html.erb', "app/views/govuk_component/#{file_name}.raw.html.erb"
    template 'component.yml', "app/views/govuk_component/docs/#{file_name}.yml"

    template '_component.scss', "app/assets/stylesheets/govuk-component/_#{@public_name}.scss"
    append_to_file "app/assets/stylesheets/govuk-component/_component.scss", "@import \"#{@public_name}\";\n"
  end
end
