require 'test_helper'

class ComponentTestCase < ActionView::TestCase
  def component_name
    raise NotImplementedError, "Override this method in your test class"
  end

  def render_component(locals)
    render file: "govuk_component/#{component_name}.raw", locals: locals
  end
end
