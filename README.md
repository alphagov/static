GOV.UK shared static assets
===========================

This repository contains global stylesheets and templates for [GOV.UK](https://www.gov.uk).

Other related repositories:

* [alphagov/govuk_frontend_toolkit](https://github.com/alphagov/govuk_frontend_toolkit) - an SCSS toolkit for building responsive and cross-browser friendly web sites
* [alphagov/slimmer](https://github.com/alphagov/slimmer) - Rack middleware for wrapping Rack applications in shared templated layouts

## Javascript unit tests

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
The component files are centrally hosted on static and exposed to applications via [alphagov/slimmer](https://github.com/alphagov/slimmer).
The partial is exposed over the network, and the CSS/JS are included by the shared templated layout.

The available components and their documentation are exposed by an API at `/templates/govuk_component/docs`, which is consumed by
[alphagov/govuk_component_guide](https://github.com/alphagov/govuk_component_guide) to generate a living styleguide for components.

* a [Partial View](app/views/govuk_component) - The template logic and markup, also defines the arguments expected
* a [SCSS module](app/assets/stylesheets/govuk-component) - The styling of the component
* a Javascript module - no examples yet.
* Documentation - currently in a [static/central file](app/views/govuk_component/docs.json), this will generated dynamically in the future

### Creating a new component

There's a rails generator you can use to create the basic component files, but it's recommended you read below to understand how it works as well.

```
bundle exec rails generate govuk_component [your-component-name]
```

### How components are structured

Component names should be lowercase and hyphenated. For example: `your-component-name`.

When referenced from an application as a partial they'll be prefixed with `govuk-`. For example: `govuk-your-component-name`.

To match rails view convention the partial itself should use an underscore, rather than a hyphen.

1) views live in `app/views/govuk_component/your_compontent_name.raw.html.erb` - There should be a single root element, with a class name consisting of the prefixed component name. For example:
```
<div class="govuk-your-component-name">
<p>things</p>
</div>
```

2) There is a SCSS module at `app/stylesheets/govuk-component/_your-component-name.scss` - there should be a single root class, the same class on the root of the partial. For example:
```
.govuk-your-component-name {
  // CSS rules go here.
  p {
    // scoped rules
  }
}
```

3) SCSS modules are included in `app/stylesheets/govuk-component/_component.scss` - which is used in the standard static layout SCSS files (application.scss, header_footer_only.scss)

4) Documentation lives `app/views/govuk_component/docs.json` - this is in the form of an array of hashes:
* `id`: The underscore version of the component name
* `name`: The human name. eg, `Your Example Component`
* `description`: A longer form description of what the component does, when it should be used
* `fixtures`: TBD: For components that expect arguments this will be a hash of fixtured example arguments

Adding it to the documentation will allow you to preview it in the `govuk_component_guide`, which can be pointed to any
version of static, including your local one running a branch. Which you should probably do.

## Image Optimisation

### Why?

PNGs, GIFs and some other image formats can be optimised to make the images smaller without losing any quality.  Smaller image files can be downloaded quicker by web browsers, and this can significantly improve user experience.

### How?

Images should be compressed before committing them to git.  This can be done via:

```
bundle exec image_optim --no-pngcrush --no-svgo -r app/
```

This may require some extra binaries to be installed on your system - please read the output of the above command or see https://github.com/toy/image_optim for more details.
