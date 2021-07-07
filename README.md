# Static

This application defines global templates for [GOV.UK](https://www.gov.uk) pages. It is used in conjunction with [Slimmer](https://github.com/alphagov/slimmer), which is Rack middleware that takes a HTML response from a Rails app and combines it with a template from Static.
## Screenshots

`gem_layout` template:

![screenshot](/docs/gem_layout.png?raw=true)

## Technical documentation

This is a Ruby on Rails app, and should follow [our Rails app conventions](https://docs.publishing.service.gov.uk/manual/conventions-for-rails-applications.html).

You can use the [GOV.UK Docker environment](https://github.com/alphagov/govuk-docker) to run the app. Remember to combine it with the commands that follow. See the [GOV.UK Docker usage instructions](https://github.com/alphagov/govuk-docker#usage) for examples.

### Further documentation

- [List of Slimmer templates](docs/slimmer_templates.md)
- [How Slimmer and Static work together](https://docs.publishing.service.gov.uk/apps/slimmer/what-slimmer-does.html)
- [Frontend architecture and long term plan to remove Static / Slimmer](https://docs.publishing.service.gov.uk/manual/frontend-architecture.html)
- [Analytics (no longer in Static, but imported from govuk_publishing_components)](docs/analytics.md)

### How to's

- [How to: deploy the Emergency Banner](docs/emergency-banner.md)
- [How to: optimise images](docs/image-optimisation.md)
- [How to: update `humans.txt`](docs/humans.md)

### Running the test suite

`bundle exec rake` runs the test suite.

#### Javascript unit tests

Tests can run in browser at `/specs`

Or in terminal to run only the jasmine tests you can use `RAILS_ENV=test bundle exec rake jasmine:ci` or in Docker `govuk-docker run -e RAILS_ENV=test static-lite bundle exec rake jasmine:ci`
