// Extension to monitor attempts to print pages.
try {
    (function() {
        "use strict";

        var printAttempt = function() {
            /** TODO:
             * Should this be
               * GOVUK.sendToAnalytics()
               * _gaq / ga
               * or somthing else?
             */
            _gaq.push(['_trackEvent', 'Print Intent', document.location.pathname]); //for classic GA
            // ga('send', 'event', 'Print Intent', document.location.pathname); //for Universal GA
        };
        // We should have window.matchMedia available via javascripts/match-media.js shim
        if (window.matchMedia) {
            var mediaQueryList = window.matchMedia('print'),
                mqlListenerCount = 0;
            mediaQueryList.addListener(function(mql) {
                if (!mql.matches && mqlListenerCount < 1) {
                    printAttempt();
                }
            });
        }
        window.onafterprint = printAttempt;
    }());
} catch (e) {}
