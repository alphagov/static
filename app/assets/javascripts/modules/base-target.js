window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function BaseTarget () { }

  BaseTarget.prototype.start = function () {
    if (this.pageIsInIframe()) {
      this.setBaseTarget()
    }
  }

  BaseTarget.prototype.setBaseTarget = function () {
    var base = document.createElement('base')
    base.target = '_blank'
    document.getElementsByTagName('head')[0].appendChild(base)
  }

  BaseTarget.prototype.pageIsInIframe = function () {
    return window.parent && window.location !== window.parent.location
  }

  Modules.BaseTarget = BaseTarget
})(window.GOVUK.Modules)

new window.GOVUK.Modules.BaseTarget().start()
