# Static

This application defines global templates for [GOV.UK](https://www.gov.uk) pages. It is used in conjunction with [Slimmer](https://github.com/alphagov/slimmer), which is Rack middleware that takes a HTML response from a Rails app and combines it with a template from Static.
## Screenshots

`gem_layout` template:

![screenshot](/docs/gem_layout.png?raw=true)

## Technical documentation

This is a Ruby on Rails app, and should follow [our Rails app conventions](https://docs.publishing.service.gov.uk/manual/conventions-for-rails-applications.html).

You can use the [GOV.UK Docker environment](https://github.com/alphagov/govuk-docker) or the local `startup.sh` script to run the app. Read the [guidance on local frontend development](https://docs.publishing.service.gov.uk/manual/local-frontend-development.html) to find out more about each approach, before you get started.

If you are using GOV.UK Docker, remember to combine it with the commands that follow. See the [GOV.UK Docker usage instructions](https://github.com/alphagov/govuk-docker#usage) for examples.

### Further documentation

- [List of Slimmer templates](docs/slimmer_templates.md)
- [How Slimmer and Static work together](https://docs.publishing.service.gov.uk/apps/slimmer/what-slimmer-does.html)
- [Frontend architecture and long term plan to remove Static / Slimmer](https://docs.publishing.service.gov.uk/manual/frontend-architecture.html)
- [Analytics (no longer in Static, but imported from govuk_publishing_components)](docs/analytics.md)

### How to's

- [How to: deploy the Emergency Banner](docs/emergency-banner.md)
- [How to: optimise images](docs/image-optimisation.md)
- [How to: update `humans.txt`](docs/humans.md)

### Running the application

`./startup.sh`

This will start the server running on http://0.0.0.0:3013

#### Running Locally

If you'd like to run static locally, and keep all its asset links pointing to
the same local instance, you'll need to set `PLEK_SERVICE_STATIC_URI`, which is
the host used for static assets (even on static).

Otherwise it defaults to `static.dev.gov.uk`, which won't exist if you're
running this repo locally, without the rest of the GOV.UK stack.

To run this app locally, and have it point at its own assets, run it like this:

```
PLEK_SERVICE_STATIC_URI=0.0.0.0:3013 ./startup.sh
```

If you're making front end changes to `static` and testing them out
on your development VM, you may find that it takes several minutes for changes to
appear due to caching in Slimmer. One approach to speed this up is to run all of the
relevant app's dependencies (including static), then start that app separately.
Restarting the app should pick up the changes.

For example, to see changes made to static templates which
are wrapped around feedback pages, run `bowl feedback
--without=feedback` in one terminal and the `.startup.sh` script for `feedback`
in a separate terminal. Following local edits to `static`, restarting only
`feedback` should be sufficient.

If you repeatedly see 504 Gateway Timeout errors when developing with static in your
development VM it's possible to increase the `proxy_read_timeout` value in
`/etc/nginx/sites-available/static.dev.gov.uk` and restart nginx on the VM.

### Running the test suite

`bundle exec rake` runs the test suite.

#### Javascript unit tests

Tests can run in browser at `/specs`

Or in terminal to run only the jasmine tests you can use `RAILS_ENV=test bundle exec rake jasmine:ci` or in Docker `govuk-docker run -e RAILS_ENV=test static-lite bundle exec rake jasmine:ci`
