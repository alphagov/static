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
