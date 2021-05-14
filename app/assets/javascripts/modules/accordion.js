// This component relies on JavaScript from GOV.UK Frontend
// = require govuk/components/accordion/accordion.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}
window.GOVUK.Modules.GovukFrontendAccordion = window.GOVUKFrontend

var $accordions = document.querySelectorAll('[data-module="govuk-accordion"]')

$accordions.forEach(function($accordion) {
  new window.GOVUK.Modules.GovukFrontendAccordion($accordion).init()
})
