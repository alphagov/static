window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function SuperNavigationHeader () { }

  SuperNavigationHeader.prototype.start = function ($module) {
    this.module = $module[0]
    this.initDropDownMenu()
    this.initShadowListener()
  }

  SuperNavigationHeader.prototype.initDropDownMenu = function () {
    var menuLinks = this.module.querySelectorAll('.js-app-c-super-navigation-header__item-link')

    for (var index = 0; index < menuLinks.length; index++) {
      var menuLink = menuLinks[index]

      var button = document.createElement('button')
      button.innerHTML = menuLink.innerHTML
      button.setAttribute('class', menuLink.getAttribute('class') + ' app-c-super-navigation-header__item-link--button')
      button.setAttribute('data-target-dropdown', menuLink.getAttribute('data-target-dropdown'))
      button.setAttribute('aria-controls', menuLink.getAttribute('data-target-dropdown'))
      button.setAttribute('aria-expanded', 'false')

      var parentElement = menuLink.parentElement
      parentElement.insertBefore(button, menuLink)
      parentElement.removeChild(menuLink)

      button.addEventListener('click', function (e) {
        e.preventDefault()
        var target = e.target
        if (!target.classList.contains('js-app-c-super-navigation-header__item-link')) {
          target = target.parentElement
        }

        var dropdownId = target.getAttribute('data-target-dropdown')
        var dropdown = this.module.querySelector('[data-dropdown-id=' + dropdownId + ']')
        var dropdownBackdrop = this.module.querySelector('.app-c-super-navigation-header__dropdown-menu-full-width-backdrop')
        var shadow = this.module.querySelector('.js-app-c-super-navigation-header__dropdown-shadow')
        var alreadyShown = target.classList.contains('app-c-super-navigation-header__item-link--active')

        if (alreadyShown) this.hideActiveDropDown()
        else {
          this.hideActiveDropDown(target, dropdown)
          this.showDropDown(target, dropdown, shadow, dropdownBackdrop)
        }
      }.bind(this))
    }
  }

  SuperNavigationHeader.prototype.initShadowListener = function () {
    var shadow = this.module.querySelector('.js-app-c-super-navigation-header__dropdown-shadow')

    shadow.addEventListener('click', function (e) {
      this.hideActiveDropDown()
    }.bind(this))
  }

  SuperNavigationHeader.prototype.showDropDown = function (target, dropdown, shadow, dropdownBackdrop) {
    dropdown.classList.add('app-c-super-navigation-header__dropdown-menu--active')
    shadow.classList.add('app-c-super-navigation-header__dropdown-shadow--active')
    target.classList.add('app-c-super-navigation-header__item-link--active')
    target.setAttribute('aria-expanded', 'true')
    dropdownBackdrop.style.height = dropdown.offsetHeight.toString() + 'px'
    dropdownBackdrop.classList.add('app-c-super-navigation-header__dropdown-menu-full-width-backdrop--active')
  }

  SuperNavigationHeader.prototype.hideActiveDropDown = function (newTarget, newTargetDropdown) {
    // shadow
    if (!newTarget || !newTargetDropdown) {
      var activeShadow = this.module.querySelector('.app-c-super-navigation-header__dropdown-shadow--active')
      if (activeShadow) activeShadow.classList.remove('app-c-super-navigation-header__dropdown-shadow--active')
    }

    // nav link
    var navLinks = this.module.querySelectorAll('.app-c-super-navigation-header__item-link--active')
    for (var index = 0; index < navLinks.length; index++) {
      var navLink = navLinks[index]
      if (!newTarget || navLinks !== newTarget) {
        navLink.classList.remove('app-c-super-navigation-header__item-link--active')
        navLink.setAttribute('aria-expanded', 'false')
      }
    }

    // dropdown menu
    var dropDownMenus = this.module.querySelectorAll('.app-c-super-navigation-header__dropdown-menu--active')
    for (var menuIndex = 0; menuIndex < dropDownMenus.length; menuIndex++) {
      var dropDown = dropDownMenus[menuIndex]
      if (!newTargetDropdown || dropDown !== newTargetDropdown) {
        dropDown.classList.remove('app-c-super-navigation-header__dropdown-menu--active')
      }
    }

    // dropdown backdrop
    if (!newTarget || !newTargetDropdown) {
      this.module.querySelector('.app-c-super-navigation-header__dropdown-menu-full-width-backdrop')
        .classList.remove('app-c-super-navigation-header__dropdown-menu-full-width-backdrop--active')
    }
  }

  Modules.SuperNavigationHeader = SuperNavigationHeader
})(window.GOVUK.Modules)
