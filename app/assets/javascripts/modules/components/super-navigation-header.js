window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function SuperNavigationHeader () { }

  SuperNavigationHeader.prototype.start = function ($module) {
    this.module = $module[0]
    this.initDropDownMenu()
    this.initShadowListener()
  }

  SuperNavigationHeader.prototype.initDropDownMenu = function() {
    var menuLinks = this.module.querySelectorAll('.js-app-c-super-navigation-header__item-link')

    for (var index = 0; index < menuLinks.length; index++) {
      var menuLink = menuLinks[index]

      menuLink.addEventListener("click", function(e) {
        e.preventDefault()
        var target = e.target
        var dropdownId = e.target.getAttribute('data-target-dropdown')
        var dropdown = this.module.querySelector("[data-dropdown-id=" + dropdownId + "]")
        var dropdownBackdrop = this.module.querySelector('.app-c-super-navigation-header__dropdown-menu-full-width-backdrop')
        var shadow = this.module.querySelector('.js-app-c-super-navigation-header__dropdown-shadow')
        var alreadyShown = e.target.classList.contains('app-c-super-navigation-header__item-link--active')

        if (alreadyShown) this.hideActiveDropDown()
        else {
          this.hideActiveDropDown(target, dropdown)
          this.showDropDown(target, dropdown, shadow, dropdownBackdrop)
        }
      }.bind(this))
    }
  }

  SuperNavigationHeader.prototype.initShadowListener = function() {
    var shadow = this.module.querySelector('.js-app-c-super-navigation-header__dropdown-shadow')

    shadow.addEventListener("click", function(e) {
      this.hideActiveDropDown()
    }.bind(this))
  }

  SuperNavigationHeader.prototype.showDropDown = function(target, dropdown, shadow, dropdownBackdrop) {
    dropdown.classList.add('app-c-super-navigation-header__dropdown-menu--active')
    shadow.classList.add('app-c-super-navigation-header__dropdown-shadow--active')
    target.classList.add('app-c-super-navigation-header__item-link--active')
    dropdownBackdrop.style.height = dropdown.offsetHeight.toString() + "px"
    dropdownBackdrop.classList.add('app-c-super-navigation-header__dropdown-menu-full-width-backdrop--active')
  }

  SuperNavigationHeader.prototype.hideActiveDropDown = function(newTarget, newTargetDropdown) {
    // removes all dropdown menus
    // as there is a race condition, we check if the new target is stays

    // shadow
    if (!newTarget || !newTargetDropdown) {
      this.module.querySelector('.app-c-super-navigation-header__dropdown-shadow--active')
        .classList.remove('app-c-super-navigation-header__dropdown-shadow--active')
    }

    // nav link
    var navLinks = this.module.querySelectorAll('.app-c-super-navigation-header__item-link--active')
    for (var index = 0; index < navLinks.length; index++) {
      var navLink = navLinks[index];
      if (!newTarget || navLinks !== newTarget) {
        navLink.classList.remove('app-c-super-navigation-header__item-link--active')
      }
    }

    // dropdown menu
    var dropDownMenus = this.module.querySelectorAll('.app-c-super-navigation-header__dropdown-menu--active')
    for (var index = 0; index < dropDownMenus.length; index++) {
      var dropDown = dropDownMenus[index];
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
