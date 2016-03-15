# Static

This application defines global templates for [GOV.UK](https://www.gov.uk) pages.

## Screenshots

![screenshot](/doc/screenshot.png?raw=true)


## Nomenclature

* [slimmer](https://github.com/alphagov/slimmer) - Rack middleware for wrapping Rack applications in shared templated layouts

## Technical documentation

There are docs for:

- [Image optimisation](doc/image-optimisation.md)
- [GOV.UK components](doc/govuk-components.md)
- [Slimmer templates](doc/slimmer_templates.md)

### Running the application

`./startup.sh`

This will start the server running on http://0.0.0.0:3013

#### Running Locally

If you'd like to run static locally, and keep all its asset links pointing to
the same local instance, you'll need to set `PLEK_SERVICE_STATIC_URI`, which is
the host used for static assets (even on static).

Otherwise it defaults to `static.dev.gov.uk`, which won't exist if you're
just running this repo locally, without the rest of the GOV.UK stack.

To run this app locally, and have it point at its own assets, run it like this:

```
PLEK_SERVICE_STATIC_URI=0.0.0.0:3013 ./startup.sh
```

### Running the test suite

`bundle exec rake` runs the test suite.

#### Javascript unit tests

Tests can run in browser at `/specs`

Or in terminal to run only the jasmine tests you can use `RAILS_ENV=test bundle exec rake spec:javascript`
