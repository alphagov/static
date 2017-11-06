// used by the task list component

(function(root) {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  GOVUK.getCurrentLocation = function(){
    return root.location;
  };
}(window));
