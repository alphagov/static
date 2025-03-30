# Moving an app off Static

As part of the effort to retire static, the frontend apps that use it will have to be
altered so that they no longer use the slimmer gem. This means that they will have to
be responsible for their own Global and Emergency banners, and for configuring the
layout_for_public component which does the actual laying out of GOV.UK outward-facing
pages. To move an app off static, you will need to complete the following steps:

## 1. Remove Slimmer gem and config

[example commit](https://github.com/alphagov/email-alert-frontend/pull/1890/commits/6273b19abdd85432058a5417c9fcb32c6900b5b9)

First, remove the gem reference and rebuild the lockfile. Then search for references
to slimmer. There will be at least one, in the application controller where slimmer
is included, and possibly in other controllers if they need to set slimmer_template.

Make a note of controllers that set a different slimmer template. They may indicate a
need either for a specialist layout, or for config variables to send to the default
application layout.

You may also need to remove slimmer references in test setups.

## 2. Update the application layout to call the layout_for_public component directly

[example commit](https://github.com/alphagov/email-alert-frontend/pull/1890/commits/f80d16bf9dd44093c5541b5802bafe2d41eea7bb)

With static, app layouts are an HTML page, with a body that contains a wrapper element.
This element is replaced by slimmer with the contents of the relevant template from
static (which is in turn the body section of a layout_for_public component).

Since layout_for_public is itself a full HTML page, you replace the entire section
with a call to the layout_for_public component. You will need to add a `content_for :head`
block. To this, add the gem component stylesheets for the components used in
layout_for_public, and the call to `render_component_stylesheets`, and also
any additional head elements that were in the existing layout.

Since the app is now not getting the default styles from static, configure the
publishing components gem to not exclude static css files.

in `config/initializers/govuk_publishing_components.rb`:
```
GovukPublishingComponents.configure do |c|
  c.component_guide_title = "Email Alert Frontend Component Guide"
  c.application_stylesheet = "application"
  c.exclude_css_from_static = false
end
```

You will also need to make sure that the js dependencies are included in our application.js,

```
//= require govuk_publishing_components/dependencies
//= require govuk_publishing_components/components/feedback
//= require govuk_publishing_components/components/layout-super-navigation-header
```

...and that the application.scss contains at least the component support styles:

```
@import "govuk_publishing_components/govuk_frontend_support";
@import "govuk_publishing_components/component_support";
```

...at this point, the app should be rendering correctly for the most part.

## 3. Add specific layouts

[example commit](https://github.com/alphagov/email-alert-frontend/pull/1890/commits/a8d28b5567dcd27442fda4c7ab20c3e2d6f502c3)

If in step 1 you identified controllers that were using a slimmer template other than
the default (`gem_layout`), you will now need to look at the relevant templates in static
and decide whether the template used differs enough from the base template to warrant
a separate layout. This is a judgement call - in the example above, the `gem_layout_account_manager`
template requires a lot of configuration, so it seems simplest to keep it as a separate
layout. If there's only one or two things different, possibly configuration is the way.

## 4. Add `govuk_web_banners` support

[example commit](https://github.com/alphagov/email-alert-frontend/pull/1890/commits/39e5915b72a624d14f9ab74fbc1e32dab60dd866)

If the app does not already include `govuk_web_banners` for recruitment banner support,
add in the gem. You will then need to add the various configurations for the banners.

To the application layout (and any special layouts you've added), add the emergency_banner
and global banner keys to the layout_for_public call:

```
<%= render "govuk_publishing_components/components/layout_for_public", {
      title: yield(:title),
      show_explore_header: true,
      emergency_banner: render("govuk_web_banners/emergency_banner"), <- Add this
      global_banner: render("govuk_web_banners/global_banner"),       <- And this
  } do %>
```

You will need to add the web banner dependencies to the application.js file:

```
//= require govuk_publishing_components/components/global-banner
//= require govuk_web_banners/dependencies
```

..and a `config/initializers/govuk_web_banners.rb` config file:

```
Rails.application.config.emergency_banner_redis_client = Redis.new(
  url: ENV["EMERGENCY_BANNER_REDIS_URL"],
  reconnect_attempts: [0, 0.1, 0.25],
)
```

Finally, to make sure your tests do not attempt to wait for an emergency banner, it's
recommented that you mock the redis client in your spec_helper or test_helper:

RSpec example:
```
Rails.application.config.emergency_banner_redis_client = instance_double(Redis, hgetall: {})
```

## 5. Configure environment variables

In order for the app to see emergency banner messages, it will need to have the
`EMERGENCY_BANNER_REDIS_URL` variable set - this is done in govuk-helm-charts, eg:
https://github.com/alphagov/govuk-helm-charts/blob/main/charts/app-config/values-integration.yaml#L1138