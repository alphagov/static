#!/bin/bash -x

set -e

git clean -fdx

bundle install --path "${HOME}/bundles/${JOB_NAME}" --deployment

export GOVUK_APP_DOMAIN=dev.gov.uk

RAILS_ENV=test bundle exec rake
bundle exec rake assets:precompile
