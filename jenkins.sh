#!/bin/bash -x

set -e

git clean -fdx

bundle install --path "${HOME}/bundles/${JOB_NAME}" --deployment

export GOVUK_APP_DOMAIN=dev.gov.uk
export GOVUK_WEBSITE_ROOT=http://www.dev.gov.uk

# Lint changes introduced in this branch, but not for master
if [[ ${GIT_BRANCH} != "origin/master" ]]; then
  bundle exec govuk-lint-ruby \
    --rails \
    --display-cop-names \
    --display-style-guide \
    --diff \
    --cached \
    --format html --out rubocop-${GIT_COMMIT}.html \
    --format clang \
    app test lib config
fi

RAILS_ENV=test bundle exec rake test
RAILS_ENV=test bundle exec rake spec:javascript
bundle exec rake assets:precompile
