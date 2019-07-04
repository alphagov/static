/* global describe it expect beforeEach afterEach spyOn */

describe('GOVUK.analyticsPlugins.error', function () {
  'use strict'
  var GOVUK = window.GOVUK

  GOVUK.analyticsPlugins.error({ filenameMustMatch: /gov\.uk/ })

  beforeEach(function () {
    GOVUK.analytics = { trackEvent: function () {} }
    spyOn(GOVUK.analytics, 'trackEvent').and.callThrough()
  })

  afterEach(function () {
    delete GOVUK.analytics
  })

  xit('sends errors to Google Analytics', function () {
    triggerError('https://www.gov.uk/filename.js', 2, 'Error')

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'JavaScript Error',
      'Error',
      { label: 'https://www.gov.uk/filename.js: 2', value: 1, nonInteraction: true })

    // this test doesn't work because when the error is created the test fails, because there was an error
    // the expect line above works just fine
    // leaving this debug code here temporarily to show what has been tried without success

    /*
    var throwError = function () {
      triggerError('https://www.gov.uk/filename.js', 2, 'Error')
    }

    expect(throwError).toThrow({ message: 'Error', line: 2, sourceURL: 'https://www.gov.uk/filename.js', stack: 0 })
    */

    /*
    var throwError = function () {
      GOVUK.analytics = { trackEvent: function (error) { output = error } }
      spyOn(GOVUK.analytics, 'trackEvent')

      triggerError('https://www.gov.uk/filename.js', 2, 'Error')
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
        'JavaScript Error',
        'Error',
        { label: 'https://www.gov.uk/filename.js: 2sdfsdfsd', value: 1, nonInteraction: true })
    }

    expect(throwError).toThrow({ message: 'Error', line: 2, sourceURL: 'https://www.gov.uk/filename.js', stack: 0 })
    */

    /*
    try {
      expect(throwError).toThrow({ message: 'Error', line: 2, sourceURL: 'https://www.gov.uk/filename.js', stack: 0 })
      console.log("output:", output)
      triggerError('https://www.gov.uk/filename.js', 2, 'Error')
      // as soon as the error is triggered, the try block exits to the catch
      // presumably even before trackEvent can be called
      expect(analytics.trackEvent).toHaveBeenCalledWith(errorDetails)
    }
    catch(e) {
      expect(output).toBe(0)
    }
    */

    // expect(throwError).toThrow({ message: 'Error', line: 2, sourceURL: 'https://www.gov.uk/filename.js', stack: 0 })
    // console.log("output:", output)

    /*
    var throwError = function () {
      console.log('throwError')
      output = "moo"
      triggerError('https://www.gov.uk/filename.js', 2, 'Error')
      console.log('throwError end')
    }

    expect(throwError).toThrow({ message: 'Error', line: 2, sourceURL: 'https://www.gov.uk/filename.js', stack: 0 })
    console.log("output:", output)
    */
  })

  xit('tracks only errors with a matching or blank filename', function () {
    triggerError('http://www.gov.uk/somefile.js', 2, 'Error message')
    triggerError('', 2, 'In page error')
    triggerError('http://www.broken-external-plugin-site.com/horrible.js', 2, 'Error message')

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'JavaScript Error',
      'Error message',
      {
        label: 'http://www.gov.uk/somefile.js: 2',
        value: 1,
        nonInteraction: true })

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'JavaScript Error',
      'In page error',
      {
        label: ': 2',
        value: 1,
        nonInteraction: true })

    expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalledWith(
      'JavaScript Error',
      'Error message',
      {
        label: 'http://www.broken-external-plugin-site.com/horrible.js: 2',
        value: 1,
        nonInteraction: true })
  })

  function triggerError (filename, lineno, message) {
    var event = document.createEvent('Event')
    event.initEvent('error', true, true)
    event.filename = filename
    event.lineno = lineno
    event.message = message

    event.name = 'Custom error'
    event.sourceURL = filename
    event.lineNumber = lineno
    window.dispatchEvent(event)
  }
})
