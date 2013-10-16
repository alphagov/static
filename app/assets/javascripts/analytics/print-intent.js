function tryCatcher( fn, message ){
    return function(){
        try {
            fn.apply(this, arguments);
        } catch (e) {
            console.log( message, e );
        }
    };
}

// Extension to monitor attempts to print pages.
(tryCatcher(function() {

    "use strict";

    var printAttempt = tryCatcher(function() {
        _gaq.push(['_trackEvent', 'Print Intent', document.location.pathname]); //for classic GA
        // ga('send', 'event', 'Print Intent', document.location.pathname); //for Universal GA
    },'gaq event push failed');

    // We should have window.matchMedia available via javascripts/match-media.js shim
    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print'),
            mqlListenerCount = 0;
        mediaQueryList.addListener(tryCatcher(function(mql) {
            if (!mql.matches && mqlListenerCount < 1) {
                printAttempt();
            }
        },'no matchMedia matching available'));
    }
    window.onafterprint = printAttempt;
},'Print attempt failed')());
