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
- [Emergency Banner](doc/emergency-banner.md)

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

If you're making front end changes to `static` and testing them out
on your development VM, you may find that it takes several minutes for changes to
appear due to caching in Slimmer. One approach to speed this up is to run all of the
relevant app's dependencies (including static), then start that app separately.
Restarting the app should pick up the changes.

For example, to see changes made to static templates which
are wrapped around feedback pages, run `bowl feedback
--without=feedback` in one terminal and the `.startup.sh` script for `feedback`
in a separate terminal. Following local edits to `static`, restarting just
`feedback` should be sufficient.

#### Testing a local version of govuk_frontend_toolkit
To test any local updates to [govuk_frontend_toolkit](https://github.com/alphagov/govuk_frontend_toolkit) you can use `./startup.sh --test-govuk-frontend-toolkit`

### Running the test suite

`bundle exec rake` runs the test suite.

#### Javascript unit tests

Tests can run in browser at `/specs`

Or in terminal to run only the jasmine tests you can use `RAILS_ENV=test bundle exec rake spec:javascript`
