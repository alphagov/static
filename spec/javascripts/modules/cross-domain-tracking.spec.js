describe('Cross Domain Tracking', function () {
  'use strict'
  var module

  beforeEach(function () {
    GOVUK.Modules.crossDomainLinkedTrackers = []
    GOVUK.analytics = GOVUK.analytics || {}
    GOVUK.analytics.addLinkedTrackerDomain = function () {}

    spyOn(GOVUK.analytics, 'addLinkedTrackerDomain')
    module = new GOVUK.Modules.CrossDomainTracking()
  })

  it('tracks realistic example', function () {
    var anchorToTest = document.createElement('a')
    anchorToTest.href = 'https://www.registertovote.service.gov.uk/register-to-vote/start'
    anchorToTest.className = 'button button--start'
    anchorToTest.setAttribute('role', 'button')
    anchorToTest.setAttribute('data-module', 'cross-domain-tracking')
    anchorToTest.setAttribute('data-tracking-code', 'UA-23066786-5')
    anchorToTest.setAttribute('data-tracking-name', 'transactionTracker')
    anchorToTest.textContent = 'Start Now'

    module.start($(anchorToTest))

    expect(
      GOVUK.analytics.addLinkedTrackerDomain
    ).toHaveBeenCalledWith('UA-23066786-5', 'transactionTracker', 'www.registertovote.service.gov.uk')
  })

  it('tracks links with cross-domain-analytics data attributes', function () {
    var anchorToTest = document.createElement('a')
    anchorToTest.href = 'https://www.gov.uk/browse/citizenship/voting'
    anchorToTest.setAttribute('data-module', 'cross-domain-tracking')
    anchorToTest.setAttribute('data-tracking-code', 'UA-XXXXXXXXX-Y')
    anchorToTest.setAttribute('data-tracking-name', 'govspeakButtonTracker')

    var wrapperDiv = document.createElement('div')
    wrapperDiv.appendChild(anchorToTest)

    module.start($(wrapperDiv))

    expect(
      GOVUK.analytics.addLinkedTrackerDomain
    ).toHaveBeenCalledWith('UA-XXXXXXXXX-Y', 'govspeakButtonTracker', 'www.gov.uk')
  })

  it('tracks multiple links', function () {
    var anchorToTest = document.createElement('a')
    anchorToTest.href = 'https://www.gov.uk/browse/citizenship/voting'
    anchorToTest.setAttribute(
      'data-tracking-code',
      'UA-XXXXXXXXX-Y'
    )
    anchorToTest.setAttribute(
      'data-tracking-name',
      'govspeakButtonTracker'
    )

    var secondAnchorToTest = document.createElement('a')
    secondAnchorToTest.href = 'https://www.registertovote.service.gov.uk/register-to-vote/start'
    secondAnchorToTest.setAttribute(
      'data-tracking-code',
      'UA-23066786-5'
    )
    secondAnchorToTest.setAttribute(
      'data-tracking-name',
      'transactionTracker'
    )

    var wrapperDiv = document.createElement('div')
    wrapperDiv.appendChild(anchorToTest)
    wrapperDiv.appendChild(secondAnchorToTest)

    module.start($(wrapperDiv))

    expect(
      GOVUK.analytics.addLinkedTrackerDomain
    ).toHaveBeenCalledWith('UA-XXXXXXXXX-Y', 'govspeakButtonTracker', 'www.gov.uk')

    expect(
      GOVUK.analytics.addLinkedTrackerDomain
    ).toHaveBeenCalledWith('UA-23066786-5', 'transactionTracker', 'www.registertovote.service.gov.uk')
  })

  it('tracks doesnt track if data attributes are not there', function () {
    var anchorToTest = document.createElement('a')
    anchorToTest.href = 'https://www.registertovote.service.gov.uk/register-to-vote/start'

    var wrapperDiv = document.createElement('div')
    wrapperDiv.appendChild(anchorToTest)

    module.start($(wrapperDiv))

    expect(GOVUK.analytics.addLinkedTrackerDomain).not.toHaveBeenCalled()
  })

  it('can be configured to track events', function () {
    spyOn(GOVUK.analytics, 'trackEvent')
    var anchorToTest = document.createElement('a')
    anchorToTest.href = 'https://www.gov.uk/browse/citizenship/voting'
    anchorToTest.innerText = 'Do some voting'
    anchorToTest.setAttribute('data-module', 'cross-domain-tracking')
    anchorToTest.setAttribute('data-tracking-code', 'UA-XXXXXXXXX-Y')
    anchorToTest.setAttribute('data-tracking-name', 'govspeakButtonTracker')
    anchorToTest.setAttribute('data-tracking-track-event', 'true')

    var wrapperDiv = document.createElement('div')
    wrapperDiv.appendChild(anchorToTest)

    module.start($(wrapperDiv))

    expect(
      GOVUK.analytics.addLinkedTrackerDomain
    ).toHaveBeenCalledWith('UA-XXXXXXXXX-Y', 'govspeakButtonTracker', 'www.gov.uk')

    $(anchorToTest).trigger('click')

    expect(
      GOVUK.analytics.trackEvent
    ).toHaveBeenCalledWith('External Link Clicked', 'Do some voting', { trackerName: 'govspeakButtonTracker' })
  })

  it('adds the linked tracker domain once', function () {
    var anchor1 = document.createElement('a')
    anchor1.href = 'https://www.gov.uk/browse/citizenship/voting'
    anchor1.setAttribute('data-module', 'cross-domain-tracking')
    anchor1.setAttribute('data-tracking-code', 'UA-XXXXXXXXX-Y')
    anchor1.setAttribute('data-tracking-name', 'govspeakButtonTracker')

    var anchor2 = document.createElement('a')
    anchor2.href = 'https://www.gov.uk/browse/citizenship/shopping'
    anchor2.setAttribute('data-module', 'cross-domain-tracking')
    anchor2.setAttribute('data-tracking-code', 'UA-XXXXXXXXX-Y')
    anchor2.setAttribute('data-tracking-name', 'govspeakButtonTracker')

    var wrapperDiv = document.createElement('div')
    wrapperDiv.appendChild(anchor1)
    wrapperDiv.appendChild(anchor2)

    module.start($(wrapperDiv))

    var moduleDup = new GOVUK.Modules.CrossDomainTracking()
    moduleDup.start($(wrapperDiv))

    expect(GOVUK.analytics.addLinkedTrackerDomain.calls.count()).toBe(1)
  })
})
