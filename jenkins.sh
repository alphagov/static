#!/bin/bash -x
csslint public/stylesheets
echo "Not failing on csslint failures"
bundle install --path "${HOME}/bundles/${JOB_NAME}" --deployment
RAILS_ENV=test bundle exec rake test --trace
