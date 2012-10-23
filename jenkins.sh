#!/bin/bash -x

set -e

export RAILS_ENV=test

git clean -fdx

bundle install --path "${HOME}/bundles/${JOB_NAME}" --deployment

bundle exec rake
bundle exec rake assets:precompile
