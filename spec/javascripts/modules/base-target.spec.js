describe('A base target module', function () {
  'use strict'

  describe('when rendered inside an iframe', function () {
    var windowParent = window.parent
    var mockWindowParent = {} // window.parent would be different than window when used inside an iframe

    beforeEach(function () {
      window.parent = mockWindowParent
      var baseTarget = new window.GOVUK.Modules.BaseTarget()
      baseTarget.start()
    })

    afterEach(function () {
      window.parent = windowParent
      var head = document.getElementsByTagName('head')[0]
      var base = document.getElementsByTagName('base')[0]
      if (head && base) head.removeChild(base)
    })

    it('should append a <base target="_blank"> tag to <head>', function () {
      var base = document.getElementsByTagName('base')[0]
      expect(base.getAttribute('target')).toEqual('_blank')
    })
  })

  describe('when not rendered inside an iframe', function () {
    beforeEach(function () {
      var baseTarget = new window.GOVUK.Modules.BaseTarget()
      baseTarget.start()
    })

    it('should not append a <base target="_blank"> tag to <head>', function () {
      var head = document.getElementsByTagName('head')[0]
      var base = head.getElementsByTagName('base')[0]
      expect(base).toBeFalsy()
    })
  })
})
