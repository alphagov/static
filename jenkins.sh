#!/bin/bash -x

set -e

git clean -fdx

bundle install --path "${HOME}/bundles/${JOB_NAME}" --deployment

export GOVUK_APP_DOMAIN=dev.gov.uk
export GOVUK_WEBSITE_ROOT=http://www.dev.gov.uk

RAILS_ENV=test bundle exec rake test
RAILS_ENV=test bundle exec rake spec:javascript
bundle exec rake assets:precompile
