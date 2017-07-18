#!/bin/bash

bundle install

if [[ $1 == "--test-govuk-frontend-toolkit" ]] ; then
  # Find out where it the gem is installed
  installed_location="$(bundle show govuk_frontend_toolkit)"
  temporary_location="./tmp/govuk_frontend_toolkit_gem_dev"

  # Remove any existing tmp file
  rm -rf ${temporary_location}

  # Copy the old assets aside
  # Using sudo here since the installed location has elevated permissions
  sudo cp -r ${installed_location} ${temporary_location}

  # Remove current submoduled assets
  rm -rf ${temporary_location}/app/assets

  # Symlink the local
  sudo ln -rs ../govuk_frontend_toolkit ${temporary_location}/app/assets

  export GOVUK_FRONTEND_TOOLKIT_DEV=true

  bundle install

  echo "Testing local govuk_frontend_toolkit"
fi

bundle exec rails s -p 3013
