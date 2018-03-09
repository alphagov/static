#!/usr/bin/env groovy

library("govuk")

REPOSITORY = 'static'

node {
  // Deployed by Puppet's Govuk_jenkins::Pipeline manifest

  govuk.buildProject(
    sassLint: false,
    beforeTest: {
      stage("Lint component sass") {
        govuk.sassLinter("app/assets/stylesheets/govuk-component")
      }
    },
    overrideTestTask: {
      stage("Test") {
        govuk.runTests("test")
        govuk.runTests("spec:javascript")
      }
    },
    publishingE2ETests: true,
  )
}
