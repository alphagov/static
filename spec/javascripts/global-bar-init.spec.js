// = require global-bar-init

/* global globalBarInit, parseCookie, expectGlobalBarToShow, expectGlobalBarToBeHidden */

describe('Global bar initialize', function () {
  beforeEach(function () {
    deleteAllCookies()
    spyOn(globalBarInit, 'getBannerVersion').and.returnValue(5)
    $('html').removeClass('show-global-bar')

    window.GOVUK.setConsentCookie({ settings: true })
  })

  it('does not show the banner on a blocked URL', function () {
    spyOn(globalBarInit, 'urlBlockList').and.returnValue(true)
    GOVUK.globalBarInit.init()

    // The cookie should still be set, but the banner should not be visible
    expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
    expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(5)
    expectGlobalBarToBeHidden()
  })

  it('sets global_bar_seen cookie', function () {
    GOVUK.globalBarInit.init()

    expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
    expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(5)
    expectGlobalBarToShow()
  })

  it('sets cookie to default value if current cookie is old (prior to versioning mechanism)', function () {
    GOVUK.setCookie('global_bar_seen', 1)
    GOVUK.globalBarInit.init()

    expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
    expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(5)

    expectGlobalBarToShow()
  })

  it('resets cookie if version number is out of date, if count below 3', function () {
    GOVUK.setCookie('global_bar_seen', JSON.stringify({ count: 1, version: 1 }))
    GOVUK.globalBarInit.init()

    expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
    expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(5)
    expectGlobalBarToShow()
  })

  it('resets cookie if version number is out of date, if count above 3', function () {
    GOVUK.setCookie('global_bar_seen', JSON.stringify({ count: 10, version: 1 }))
    GOVUK.globalBarInit.init()

    expect(parseCookie(GOVUK.getCookie('global_bar_seen')).count).toBe(0)
    expect(parseCookie(GOVUK.getCookie('global_bar_seen')).version).toBe(5)
    expectGlobalBarToShow()
  })

  it('makes banner visible if view count is less than 3', function () {
    GOVUK.setCookie('global_bar_seen', JSON.stringify({ count: 1, version: 5 }))
    GOVUK.globalBarInit.init()

    expectGlobalBarToShow()
  })
})

function deleteAllCookies () {
  var cookies = document.cookie.split(';')

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i]
    var eqPos = cookie.indexOf('=')
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}
