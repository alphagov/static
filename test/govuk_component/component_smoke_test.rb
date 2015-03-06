require 'test_helper'

class ComponentsTest < ActionView::TestCase
  test "each component fixture can be rendered without errors being raised" do
    doc_files = Rails.root.join('app', 'views', 'govuk_component', 'docs', '*.yml')
    components = Dir[doc_files].sort.map do |file|
      { id: File.basename(file, '.yml') }.merge(YAML::load_file(file)).deep_symbolize_keys
    end

    components.each do |component|
      component[:fixtures].each do |_, fixture|
        render file: "govuk_component/#{component[:id]}.raw", locals: fixture
      end
    end
  end
end
