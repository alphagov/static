#!/bin/bash

export REPO_NAME="alphagov/govuk-content-schemas"
export CONTEXT_MESSAGE="Verify static components against schema examples"

exec ./jenkins.sh
