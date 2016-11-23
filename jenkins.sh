#!/bin/bash -x

set -e

git clean -fdx

export GOVUK_APP_DOMAIN=dev.gov.uk
export GOVUK_WEBSITE_ROOT=http://www.dev.gov.uk

REPO_NAME=${REPO_NAME:-"alphagov/static"}
CONTEXT_MESSAGE=${CONTEXT_MESSAGE:-"default"}
GH_STATUS_GIT_COMMIT=${SCHEMA_GIT_COMMIT:-${GIT_COMMIT}}

env

function github_status {
  REPO_NAME="$1"
  STATUS="$2"
  MESSAGE="$3"
  gh-status "$REPO_NAME" "$GH_STATUS_GIT_COMMIT" "$STATUS" -d "Build #${BUILD_NUMBER} ${MESSAGE}" -u "$BUILD_URL" -c "$CONTEXT_MESSAGE" >/dev/null
}

function error_handler {
  trap - ERR # disable error trap to avoid recursion
  local parent_lineno="$1"
  local message="$2"
  local code="${3:-1}"
  if [[ -n "$message" ]] ; then
    echo "Error on or near line ${parent_lineno}: ${message}; exiting with status ${code}"
  else
    echo "Error on or near line ${parent_lineno}; exiting with status ${code}"
  fi
  github_status "$REPO_NAME" error "errored on Jenkins"
  exit "${code}"
}

trap 'error_handler ${LINENO}' ERR
github_status "$REPO_NAME" pending "is running on Jenkins"

# Try to merge master into the current branch, and abort if it doesn't exit
# cleanly (ie there are conflicts). This will be a noop if the current branch
# is master.
git merge --no-commit origin/master || git merge --abort

# Clone govuk-content-schemas depedency for contract tests
rm -rf tmp/govuk-content-schemas
git clone git@github.com:alphagov/govuk-content-schemas.git tmp/govuk-content-schemas
(
  cd tmp/govuk-content-schemas
  git checkout ${SCHEMA_GIT_COMMIT:-"deployed-to-production"}
)
export GOVUK_CONTENT_SCHEMAS_PATH=tmp/govuk-content-schemas

bundle install --path "${HOME}/bundles/${JOB_NAME}" --deployment

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

  bundle exec govuk-lint-sass app/assets/stylesheets/govuk-component
fi

RAILS_ENV=test bundle exec rake test
RAILS_ENV=test bundle exec rake spec:javascript
RAILS_ENV=production bundle exec rake assets:precompile

export EXIT_STATUS=$?

if [ "$EXIT_STATUS" == "0" ]; then
  github_status "$REPO_NAME" success "succeeded on Jenkins"
else
  github_status "$REPO_NAME" failure "failed on Jenkins"
fi

exit $EXIT_STATUS
