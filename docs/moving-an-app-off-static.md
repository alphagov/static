# Moving an app off Static

As part of the effort to retire static, the frontend apps that use it will have to be
altered so that they no longer use the slimmer gem. This means that they will have to
be responsible for their own Global and Emergency banners, and for configuring the
layout_for_public component which does the actual laying out of GOV.UK outward-facing
pages. To move an app off static, you will need to complete the following steps:

## (Existing PRs you can copy from)
- [Email Alert Frontend](https://github.com/alphagov/email-alert-frontend/pull/1890)
- [Feedback](https://github.com/alphagov/feedback/pull/2108)


## 1. Remove Slimmer gem and config

- [example commit - email-alert-frontend](https://github.com/alphagov/email-alert-frontend/pull/1890/commits/bd9af8d10d625a05e70082eaae98daa681015af5)
- [example commit - feedback](https://github.com/alphagov/feedback/pull/2108/commits/e6cecdf8819367336fa311df605318516ddb4d6d)

First, remove the slimmer gem reference and rebuild the lockfile (`bundle install`). Then
search for references to slimmer. There will be at least one, in the application controller
where slimmer is included, and possibly in other controllers if they need to set slimmer_template.

Make a note of controllers that set a different slimmer template. They may indicate a
need either for a specialist layout, or for config variables to send to the default
application layout.

You may also need to remove slimmer references in test setups.

## 2. Update the application layout to call the layout_for_public component directly

- [example commit - email-alert-api](https://github.com/alphagov/email-alert-frontend/pull/1890/commits/3e57223d90f66e3def475a88db76eb2976fef865)
- [example commit - feedback](https://github.com/alphagov/feedback/pull/2108/commits/db2e5303b41d9aefe60e71b7dc3ba5768fd4750a)

With static, app layouts are an HTML page, with a body that contains a wrapper element.
This element is replaced by slimmer with the contents of the relevant template from
static (which is in turn the body section of a layout_for_public component).

Since layout_for_public is itself a full HTML page, you replace the entire section
with a call to the layout_for_public component. You will need to add a `content_for :head`
block, containing the gem component stylesheets for the components used in
layout_for_public, and the call to `render_component_stylesheets`, and also
any additional head elements that were in the existing layout.

Your content_for: head block should also contain a meta_tag component to render the rendering_app
meta_tag (previously added by slimmer), and csp meta tags.

```
<%= content_for :head do %>
  <%= csp_meta_tag %>
  <%= render_component_stylesheets %>
  <%= render "govuk_publishing_components/components/meta_tags", {
    content_item: {
      rendering_app: "feedback",
    }
  } %>
<% end %>

```

# 3. Update initializers to ensure that all components can be loaded individually

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

:large_orange_diamond: In the long run: If you are moving the last application, it's worth considering whether this should now be the default
in the component gem. If so, and that is updated, you can then remove this configuration from all apps :large_orange_diamond:

You will also need to make sure that the js dependencies are included in `application.js`,

```
//= require govuk_publishing_components/dependencies
//= require govuk_publishing_components/components/feedback
//= require govuk_publishing_components/components/layout-super-navigation-header
```

...and that `application.scss` contains at least the component support styles:

```
@import "govuk_publishing_components/govuk_frontend_support";
@import "govuk_publishing_components/component_support";
```

...at this point, the app should be rendering correctly for the most part.

## 4. (OPTIONAL) Create a basic elements bundle

Although we get some advantage from individual component loading over h2, it's still wise at this point to provide
a bundle of CSS assets for the app that are used on all (or almost all) pages, because CSS compresses well, and
it compresses better if the file is larger to start with (a large CSS file is likely to contain a lot of identical
string ranges that can be compressed, compared to fewer in a small CSS file).

:large_orange_diamond: In the long run: we will eventually be able to provide a single CSS file with the extremely commonly
used css assets that's shared by all apps, like the current static CSS file, but without static. :large_orange_diamond:

Work out the components that are used by every (or most) pages in your app and add their stylesheets into `application.scss`,

```
@import "govuk_publishing_components/components/heading";
@import "govuk_publishing_components/components/label";
@import "govuk_publishing_components/components/layout-footer";
@import "govuk_publishing_components/components/layout-for-public";
@import "govuk_publishing_components/components/layout-super-navigation-header";
...etc...
```

...then update `config/initializers/govuk_publishing_components.rb` to remove the `exclude_css_from_static option` and
replace it with a include a `custom_css_exclude_list` matching the components you added into `application.scss`:

```
GovukPublishingComponents.configure do |c|
  c.component_guide_title = "Email Alert Frontend Component Guide"
  c.application_stylesheet = "application"
  c.custom_css_exclude_list = %w[
    heading
    label
    layout-footer
    layout-for-public
    layout-super-navigation-header
    ...etc...
  ]
end
```

If you didn't already have an `application.scss` for the app, remember also to add it to `config/initializers/dartsass.rb`

## 5. Check views for missing `content_for` blocks

Depending on the application, you may have `content_for` blocks that refer to the old layout. In Feedback this was views
that wanted to provide special headers. These, for instance, should now go into `content_for :head`, as mentioned
in step 2.

## 6. Lint your views

One of the things slimmer does as a side-effect of how it works is to fix non-standard HTML (for instance, attributes
whose values are not wrapped in speechmarks). You'll have to make sure that your views don't have any of that
[example](https://github.com/alphagov/feedback/pull/2108/commits/17b97bbfeecfb35c2fdde6c9913cb03b5082a02c)

## 7. Add specific layouts

[example commit](https://github.com/alphagov/email-alert-frontend/pull/1890/commits/0e16b0474b99e8987b16e5448d638c09f993d2bc)

If in step 1 you identified controllers that were using a slimmer template other than
the default (`gem_layout`), you will now need to look at the relevant templates in static
and decide whether the template used differs enough from the base template to warrant
a separate layout. This is a judgement call - in the example above, the `gem_layout_account_manager`
template requires a lot of configuration, so it seems simplest to keep it as a separate
layout. If there's only one or two things different, possibly configuration is the way - you
can add controller helper methods for the different requirements, then set flags in the
layout component based on the return values of those methods.

This is subjective, but it will often be relatively obvious if a single layout would require
too much configuration / too many conditionals to be easy to work with. If in doubt, get another
developer involved.

## 8. Add middleware to optimise GA4 data attributes

Another thing slimmer does as a side-effect of how it works is optimise long ga4 attributes, which often contain a lot
of double-quotes, by wrapping the attributes in single quotes so that the double quotes don't need to be escaped.

The publishing components gem has a more focused middleware for doing this, which you'll need to add to your app.
[example commit](https://github.com/alphagov/feedback/pull/2108/commits/5f95ee5e4105f92bbd09405d026641997b658b92)

In `config/application.rb`, add:

```
require "govuk_publishing_components/middleware/ga4_optimise" # (at the top)

module Feedback
  class Application < Rails::Application
    ...etc...
    # Use the middleware to compact data-ga4-event/link attributes
    config.middleware.use GovukPublishingComponents::Middleware::Ga4Optimise
  end
end
```

## 9. Add `govuk_web_banners` support

[example commit](https://github.com/alphagov/email-alert-frontend/pull/1890/commits/b08add52f18a609284af92acdb7b3d4b42ace549)

If the app does not already include [govuk_web_banners](https://github.com/alphagov/govuk_web_banners)
for recruitment banner support, add in the gem. You will then need to add the various
configurations for the banners.

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

These two banner partials contain their own CSS references, but they can't add their
own JS references, so you will need to add the web banner dependencies to the
application.js file:

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
recommended that you mock the redis client in your spec_helper or test_helper:

RSpec example:
```
Rails.application.config.emergency_banner_redis_client = instance_double(Redis, hgetall: {})
```

## 10. Configure environment variables

In order for the app to see emergency banner messages, it will need to have the
`EMERGENCY_BANNER_REDIS_URL` variable set - this is done in govuk-helm-charts, eg:
https://github.com/alphagov/govuk-helm-charts/blob/main/charts/app-config/values-integration.yaml#L1138
