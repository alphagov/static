# Static

This application defines global templates for [GOV.UK](https://www.gov.uk) pages. It is used in conjunction with [Slimmer](https://github.com/alphagov/slimmer), which is Rack middleware that takes a HTML response from a Rails app and combines it with a template from Static.
## Live examples

See this [`gem_layout` template screenshot](/docs/gem_layout.png?raw=true) for an example of the page furniture Static provides.

## Technical documentation

This is a Ruby on Rails app, and should follow [our Rails app conventions](https://docs.publishing.service.gov.uk/manual/conventions-for-rails-applications.html).

You can use the [GOV.UK Docker environment](https://github.com/alphagov/govuk-docker) to run the app. Remember to combine it with the commands that follow.

### Running the app

Run the app [using GOV.UK Docker](https://github.com/alphagov/govuk-docker#usage). You can then view your templates - here's an example:

<http://static.dev.gov.uk/templates/gem_layout.html.erb>

See the [list of Slimmer templates](docs/slimmer_templates.md) for more.

If you're making front end changes to Static and testing them out inside your other apps, you may find that it takes several minutes for changes to appear due to caching in Slimmer. Restarting the consumer app should pick up the changes.

### Running the test suite

```
bundle exec rake
```

To run JavaScript tests (only):

```
env RAILS_ENV=test bundle exec rake jasmine:ci
```

### Further documentation

Background information:

- [How Slimmer and Static work together](https://docs.publishing.service.gov.uk/apps/slimmer/what-slimmer-does.html)
- [Frontend architecture and long term plan to remove Static / Slimmer](https://docs.publishing.service.gov.uk/manual/frontend-architecture.html)
- [Analytics (no longer in Static, but imported from govuk_publishing_components)](docs/analytics.md)

How to's:

- [How to: deploy the Emergency Banner](docs/emergency-banner.md)
- [How to: optimise images](docs/image-optimisation.md)
- [How to: update `humans.txt`](docs/humans.md)

## License

[MIT License](LICENCE)
