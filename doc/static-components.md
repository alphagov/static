# Static components

Pages are rendered using components. Components in static are available to all applications through slimmer.

They are documented in the [static component guide](https://govuk-static.herokuapp.com/component-guide). When running static locally the component guide is available at: http://static.dev.gov.uk/component-guide.

## Building components

[Components](https://docs.publishing.service.gov.uk/manual/components.html) follow rules set out by the [govuk_publishing_components gem](https://github.com/alphagov/govuk_publishing_components).

A component must:

* [meet the component principles](https://github.com/alphagov/govuk_publishing_components/blob/master/docs/component_principles.md)
* [follow component conventions](https://github.com/alphagov/govuk_publishing_components/blob/master/docs/component_conventions.md)

The [govuk_publishing_components gem](https://github.com/alphagov/govuk_publishing_components) provides a generator to stub the files you’ll need in each component:

```
bundle exec rails generate govuk_publishing_components:component [component_name]
```

## Distribute via the network

Static components differ from application components. The component files are centrally hosted on static and exposed to applications via [alphagov/slimmer](https://github.com/alphagov/slimmer). The partial is exposed over the network, and the CSS/JS are included by the shared templated layout.

One of the goals of components is to have consistency between the many different frontend applications. Components that are needed by different applications live in a central place (the `static` application) and are distributed to the different frontends over the network. This is done via Slimmer, in a similar way to [layout templates](slimmer_templates.md).

This allows a component to be changed and deployed within `static` and each frontend application will automatically fetch a new version of the [component template code](../app/views/govuk_component).

The automatic updating allows changes to be made to every GOV.UK frontend app, without having to manually update and deploy them. With 15+ frontend apps, this makes updating components much easier.

However, this approach does have some costs. It's less explicit, and not as clear how the common component code is included or updated. Changes to the component interface/parameters require [forwards-only migrations](http://engineering.skybettingandgaming.com/2016/02/02/how-we-release-so-frequently/#forward-only-migrations), which for components, would look like this:

- Release a version of static that introduces backwards compatible change to a component
- Migrate all frontends to use new API and stop depending on old one
- Release version of static to remove old implementation for a component
