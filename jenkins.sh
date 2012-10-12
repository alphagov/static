#!/bin/bash -x

set -e

bundle install --path "${HOME}/bundles/${JOB_NAME}" --deployment
bundle exec rake assets:precompile
bundle exec rake test
RAILS_ENV=test bundle exec rake test --trace
