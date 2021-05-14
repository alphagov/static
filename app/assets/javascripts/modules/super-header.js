window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function SuperHeader () { }

  SuperHeader.prototype.start = function ($module) {
    this.module = $module[0]

    this.initMobileMenu();
  }

  SuperHeader.prototype.initMobileMenu = function () {
    this.mobileMenuToggleButton = this.module.querySelector(".js-govuk-header__super-navigation-menu-toggle-button")
    this.mobileMenu = this.module.querySelector(".js-govuk-header__super-navigation-menu--mobile")

    this.initMobileMenuToggle()
  }

  SuperHeader.prototype.initMobileMenuToggle = function () {
    this.mobileMenuToggleButton.addEventListener("click", function(event) {
      this.mobileMenuToggleButton.classList.toggle("js-govuk-header__super-navigation-menu-toggle-button--shown")
      this.mobileMenu.classList.toggle("js-govuk-header__super-navigation-menu--mobile-shown")
    }.bind(this))
  }

  Modules.SuperHeader = SuperHeader
})(window.GOVUK.Modules)
