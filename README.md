# Static

This application defines global templates for [GOV.UK](https://www.gov.uk) pages. It is used in conjunction with [Slimmer](https://github.com/alphagov/slimmer), which is Rack middleware that takes a HTML response from a Rails app and combines it with a template from Static.
## Live examples

See this [`gem_layout` template screenshot](/docs/gem_layout.png?raw=true) for an example of the page furniture Static provides.

## Technical documentation

This is a Ruby on Rails app, and should follow [our Rails app conventions](https://docs.publishing.service.gov.uk/manual/conventions-for-rails-applications.html).

You can use the [GOV.UK Docker environment](https://github.com/alphagov/govuk-docker) to run the the application and its tests with all the necessary dependencies. Follow the [usage instructions](https://github.com/alphagov/govuk-docker#usage) to get started.

### Running the app

Static has no home page or navigation, so you need to manually type in the URL of the template you want to view. Here's an example:

<http://static.dev.gov.uk/templates/gem_layout.html.erb>

See the [list of Slimmer templates](docs/slimmer_templates.md) for more.

If you're making front end changes to Static and testing them out inside your other apps, you may find that it takes several minutes for changes to appear due to caching in Slimmer. Restarting the consumer app should pick up the changes.

### Running the test suite

```
bundle exec rake
```

To run JavaScript tests (only):

```
env RAILS_ENV=test bundle exec rake jasmine
```

### Further documentation

Background information:

- [How Slimmer and Static work together](https://docs.publishing.service.gov.uk/repos/slimmer/what-slimmer-does.html)
- [Frontend architecture and long term plan to remove Static / Slimmer](https://docs.publishing.service.gov.uk/manual/frontend-architecture.html)
- [Analytics (no longer in Static, but handled by govuk_publishing_components)](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/analytics-ga4/analytics.md)

## Licence

[MIT License](LICENCE)
