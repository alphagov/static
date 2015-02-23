// Extension to track errors using google analytics as a data store.
(function() {

  "use strict";
  var trackJavaScriptError = function (e) {
    var errorSource = e.filename + ': ' + e.lineno;
    GOVUK.analytics.trackEvent('JavaScript Error', e.message, errorSource, 1, true);
  };

  if (window.addEventListener) {
    window.addEventListener('error', trackJavaScriptError, false);
  } else if (window.attachEvent) {
    window.attachEvent('onerror', trackJavaScriptError);
  } else {
    window.onerror = trackJavaScriptError;
  }

}());
