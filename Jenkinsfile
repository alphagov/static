#!/usr/bin/env groovy

REPOSITORY = 'static'

def sassLinter() {
  echo 'Running SASS linter'
  sh('bundle exec govuk-lint-sass app/assets/stylesheets/govuk-component')
}

node {
  // Deployed by Puppet's Govuk_jenkins::Pipeline manifest
  def govuk = load '/var/lib/jenkins/groovy_scripts/govuk_jenkinslib.groovy'

  properties([
    buildDiscarder(
      logRotator(
        numToKeepStr: '50')
      ),
    [$class: 'RebuildSettings', autoRebuild: false, rebuildDisabled: false],
    [$class: 'ThrottleJobProperty',
      categories: [],
      limitOneJobWithMatchingParams: true,
      maxConcurrentPerNode: 1,
      maxConcurrentTotal: 0,
      paramsToUseForLimit: REPOSITORY,
      throttleEnabled: true,
      throttleOption: 'category'],
    [$class: 'ParametersDefinitionProperty',
      parameterDefinitions: [
        [$class: 'StringParameterDefinition',
          name: 'SCHEMA_BRANCH',
          defaultValue: 'deployed-to-production',
          description: 'The branch of govuk-content-schemas to test against']]],
  ])

  try {
    govuk.setEnvar('GOVUK_APP_DOMAIN', 'dev.gov.uk')
    govuk.initializeParameters([
      'SCHEMA_BRANCH': 'deployed-to-production',
    ])

    stage('Build') {
      checkout scm

      govuk.cleanupGit()
      govuk.mergeMasterBranch()

      govuk.bundleApp()

      govuk.contentSchemaDependency(env.SCHEMA_BRANCH)
    }

    stage('Lint') {
      govuk.rubyLinter()

      // Can't use govuk.sassLinter as no way to provide custom paths... yet.
      sassLinter()
    }

    stage('Test') {
      govuk.setEnvar('RAILS_ENV', 'test')

      govuk.runTests('test')
      govuk.runTests('spec:javascript')
    }

    stage('Validate assets') {
      govuk.setEnvar('RAILS_ENV', 'production')
      govuk.runRakeTask('assets:precompile')
    }

    stage('Deploy') {
      // pushTag and deployIntegration are no-ops unless on master branch
      govuk.pushTag(REPOSITORY, env.BRANCH_NAME, 'release_' + env.BUILD_NUMBER)
      govuk.deployIntegration(REPOSITORY, env.BRANCH_NAME, 'release', 'deploy')
    }

  } catch (e) {
    currentBuild.result = 'FAILED'
    step([$class: 'Mailer',
          notifyEveryUnstableBuild: true,
          recipients: 'govuk-ci-notifications@digital.cabinet-office.gov.uk',
          sendToIndividuals: true])
    throw e
  }
}
