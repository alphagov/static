GOV.UK shared static assets
===========================

This repository contains global stylesheets and templates for [GOV.UK](https://www.gov.uk).

Other related repositories:

* [alphagov/govuk_frontend_toolkit](https://github.com/alphagov/govuk_frontend_toolkit) - an SCSS toolkit for building responsive and cross-browser friendly web sites
* [alphagov/slimmer](https://github.com/alphagov/slimmer) - Rack middleware for wrapping Rack applications in shared templated layouts

##Javascript unit tests

To run the unit tests in batch use the jasmine:ci rake task, but it must be run in the test environment: `RAILS_ENV=test rake jasmine:ci`.

Alternatively to run tests in browser: `RAILS_ENV=test rake jasmine`
