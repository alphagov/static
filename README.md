GOV.UK shared static assets
===========================

This repository contains global stylesheets and templates for [GOV.UK](https://www.gov.uk).

Other related repositories:

* [alphagov/govuk_frontend_toolkit](https://github.com/alphagov/govuk_frontend_toolkit) - an SCSS toolkit for building responsive and cross-browser friendly web sites
* [alphagov/slimmer](https://github.com/alphagov/slimmer) - Rack middleware for wrapping Rack applications in shared templated layouts

##Javascript unit tests

To run the unit tests in batch use the jasmine:ci rake task, but it must be run in the test environment: `RAILS_ENV=test rake jasmine:ci`.

Alternatively to run tests in browser: `RAILS_ENV=test rake jasmine`

##Running Locally

If you'd like to run static locally, and keep all its asset links pointing to
the same local instance, you'll need to set `PLEK_SERVICE_STATIC_URI`, which is
the host used for static assets (even on static).

Otherwise it defaults to `static.dev.gov.uk`, which won't exist if you're
just running this repo locally, without the rest of the GOV.UK stack.

To run this app locally, and have it point at its own assets, run it like this:

```
PLEK_SERVICE_STATIC_URI=0.0.0.0:3013 ./startup.sh
```

## GOV.UK components

Shared partials that encapsulate the HTML/CSS/JS for a common UI component.
The component files are centrally hosted on static and exposed to applicatins via [alphagov/slimmer](https://github.com/alphagov/slimmer).
The partial is exposed over the network, and the CSS/JS are included by the shared templated layout.

The available compoents and their documentation are exposed by an API at `/templates/govuk_component/docs`, which is consumed by
[alphagov/govuk_component_guide](https://github.com/alphagov/govuk_component_guide) to generate a living styleguide for components.


* a [Partial View](app/views/govuk_component) - The template logic and markup, also defines the arguements expected
* a [SCSS module](app/assets/stylesheets/govuk-component) - The styling of the component
* a Javascript module - no examples yet.
* Documentation - currenly in a [static/central file](app/views/govuk_component/docs.json), this will generated dynamically in the future (something like)

### Creating a new component

First pick a name. Components should be lowercase and hyphenated, eg `your-compontent-name`.

When referenced from an application as a partial they'll be prefixed with `govuk-`, eg `govuk-your-compontent-name`. To match rails view convention the partial itself should use an underscore, rather than a hyphen.

1) Create a new partial at `app/views/govuk_component/your_compontent_name.raw.html.erb` - There should be a single root element, with a class that's the same as a prefixed component name, eg
```
<div class="govuk-your-compontent-name">
<p>things</p>
</div>
```

2) Create a new SCSS module at `app/stylesheets/govuk-component/_your-compontent-name.scss` - there should be a single root class, the same class on the root of the partial, eg
```
.govuk-your-compontent-name {
  // CSS rules go here.
  p {
    // scoped rules
  }
}
```

3) Include the new SCSS module in to `app/stylesheets/govuk-component/_component.scss`

4) Add documentation to `app/views/govuk_component/docs.json` - this is in the form of an array of hashes:
* `id`: The underscore version of the compontent name
* `name`: The human name, eg, `Your Example Component`
* `description`: A longer form description of what the component does, when it should be used
* `fixtures`: TBD: For components that expect aguements this will be a hash of fixtured example arguments

Adding it to the documentation will allow you to preview it in the `govuk_component_guide`, which can be pointed to any
version of startic, including your local one running a branch. Which you should probably do.
