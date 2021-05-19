window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function SuperHeader () { }

  SuperHeader.prototype.start = function ($module) {
    this.module = $module[0]

    this.initMobileMenu()
    this.initDropDownMenu()
    this.initDropDownShadowListener()
  }

  SuperHeader.prototype.initMobileMenu = function () {
    this.mobileMenuToggleButton = this.module.querySelector('.js-govuk-header__super-navigation-menu-toggle-button')
    this.mobileMenu = this.module.querySelector('.js-govuk-header__super-navigation-menu--mobile')

    this.initMobileMenuToggle()
  }

  SuperHeader.prototype.initMobileMenuToggle = function () {
    this.mobileMenuToggleButton.addEventListener('click', function (event) {
      this.mobileMenuToggleButton.classList.toggle('js-govuk-header__super-navigation-menu-toggle-button--shown')
      this.mobileMenu.classList.toggle('js-govuk-header__super-navigation-menu--mobile-shown')
    }.bind(this))
  }

  SuperHeader.prototype.initDropDownMenu = function () {
    this.module.querySelectorAll('.js-govuk-header__super-navigation-dropdown-toggle').forEach(function (menuLink) {
      menuLink.addEventListener('click', function (event) {
        event.preventDefault()
        const shown = menuLink.classList.contains('govuk-header__super-navigation-dropdown-toggle--shown')
        this.hideDropDown()

        // show all current targets
        if (!shown) {
          menuLink.classList.add('govuk-header__super-navigation-dropdown-toggle--shown')
          this.module.querySelector('.govuk-header__super-navigation-dropdown-shadow')
            .classList.toggle('govuk-header__super-navigation-dropdown-shadow--shown')
          this.module
            .querySelector(menuLink.getAttribute('data-dropdown-target'))
            .classList.toggle('govuk-header__super-navigation-dropdown--shown')
        }
      }.bind(this))
    }.bind(this))
  }

  SuperHeader.prototype.initDropDownShadowListener = function () {
    this.module.querySelector('.govuk-header__super-navigation-dropdown-shadow')
      .addEventListener('click', function () {
        this.hideDropDown()
      }.bind(this))
  }

  SuperHeader.prototype.hideDropDown = function () {
    const shadow = this.module.querySelector('.govuk-header__super-navigation-dropdown-shadow--shown')
    const currentlyShown = this.module.querySelector('.govuk-header__super-navigation-dropdown--shown')
    const currentlyShownToggle = this.module.querySelector('.govuk-header__super-navigation-dropdown-toggle--shown')

    // hide all other shown elements
    if (shadow) shadow.classList.toggle('govuk-header__super-navigation-dropdown-shadow--shown')
    if (currentlyShown) currentlyShown.classList.toggle('govuk-header__super-navigation-dropdown--shown')
    if (currentlyShownToggle) currentlyShownToggle.classList.toggle('govuk-header__super-navigation-dropdown-toggle--shown')
  }

  Modules.SuperHeader = SuperHeader
})(window.GOVUK.Modules)
