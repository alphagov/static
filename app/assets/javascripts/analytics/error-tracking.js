// Extension to track errors using google analytics as a data store.
(function() {

    "use strict";
    var trackJavaScriptError = function (e) {
      var errorSource = e.filename + ': ' + e.lineno;
      _gaq.push([
        '_trackEvent',
        'JavaScript Error',
        e.message,
        errorSource,
        1, // Set our value to 1, though we could look to tally session errors here
        true // nonInteractive so bounce rate isn't affected
      ]);
    };

    if (window.addEventListener) {
      window.addEventListener('error', trackJavaScriptError, false);
    } else if (window.attachEvent) {
      window.attachEvent('onerror', trackJavaScriptError);
    } else {
      window.onerror = trackJavaScriptError;
    }

}());
