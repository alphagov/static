//= require libs/GlobalBarHelper.js

function expectGlobalBarToShow() {
  expect($('html').hasClass("show-global-bar")).toBe(true);
}

function expectGlobalBarToBeHidden() {
  expect($('html').hasClass("show-global-bar")).toBe(false);
}

function expectAdditionalSectionToBeVisible() {
  expect($('.global-bar-additional').hasClass("global-bar-additional--show")).toBe(true)
}

function expectAdditionalSectionToBeHidden() {
  expect($('.global-bar-additional').hasClass("global-bar-additional--show")).toBe(false)
}
