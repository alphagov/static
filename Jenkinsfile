#!/usr/bin/env groovy

library("govuk")

REPOSITORY = 'static'

node {
  govuk.buildProject(
    beforeTest: { sh("yarn install") },
    sassLint: false,
    publishingE2ETests: true,
    brakeman: true,
  )
}
