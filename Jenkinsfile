#!/usr/bin/env groovy

library("govuk")

REPOSITORY = 'static'

node {
  // Deployed by Puppet's Govuk_jenkins::Pipeline manifest

  govuk.buildProject(
    sassLint: false,
    overrideTestTask: {
      stage("Test") {
        govuk.runTests("test")
        govuk.runTests("spec:javascript")
      }
    },
    publishingE2ETests: true,
  )
}
