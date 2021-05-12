//= require govuk_publishing_components/dependencies
//= require analytics
//= require govuk_publishing_components/components/cookie-banner
//= require govuk_publishing_components/components/layout-header
//= require govuk_publishing_components/lib/track-click
//= require modules/global-bar
//= require modules/cross-domain-tracking
//= require global-bar-init
//= require surveys

(function(){
  document
  .getElementsByClassName("js-header-menu-toggle")[0]
  .addEventListener("click", function (event) {
    document
      .getElementsByClassName("js-header-menu-toggle")[0]
      .classList
      .toggle("js-header-menu-toggle--shown")

    document
      .getElementsByClassName("js-header-menu")[0]
      .classList
      .toggle("js-header-menu--shown")
  })
})()
