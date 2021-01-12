#!/usr/bin/env groovy

library("govuk")

REPOSITORY = 'static'

node {
  govuk.buildProject(
    beforeTest: { sh("yarn install") },
    sassLint: false,
    overrideTestTask: {
      stage("Test") {
        govuk.runTests("test")
        govuk.runTests("jasmine:ci")
      }
    },
    publishingE2ETests: true,
    brakeman: true,
  )
}
