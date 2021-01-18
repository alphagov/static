#!/usr/bin/env groovy

library("govuk")

REPOSITORY = 'static'

node {
  govuk.buildProject(
    publishingE2ETests: true,
    brakeman: true,
  )
}
