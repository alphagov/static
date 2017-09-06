if defined?(GovukPublishingComponents)
  GovukPublishingComponents.configure do |c|
    c.component_guide_title = "Static Component Guide"
    c.static = true

    # Component guide already includes static, which includes the components
    # we want to see in the component guide
    c.application_print_stylesheet = nil
    c.application_stylesheet = nil
    c.application_javascript = nil
  end
end
