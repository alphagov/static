//= require libs/GlobalBarHelper.js

function expectGlobalBarToShow() {
  expect($('html').hasClass("show-global-bar")).toBe(true);
}

function expectGlobalBarToBeHidden() {
  expect($('html').hasClass("show-global-bar")).toBe(false);
}
