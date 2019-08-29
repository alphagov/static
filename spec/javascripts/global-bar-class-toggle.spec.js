describe("toggling a global bar HTML class based on cookie", function () {
  var root = window;

  /**
   * The global bar needs to be activated early in page loading to prevent
   * a flash of unstyled content, to do this we need to minify and inline
   * the activation logic into the page head.
   * This spec runs tests against both the full and minified sources of the
   * activation JS because minification is not automated.
   */
  function globalBarSource(fakeWindow) {
    var window = fakeWindow || root;

    /* begin minify */

    (function (document) {
      "use strict"
      var documentElement = document.documentElement;
      if (urlPermitsShow() && viewCountPermitsShow()) {
        documentElement.className = documentElement.className.concat(' show-global-bar');
      }

      function urlPermitsShow() {
        return !/^\/register-to-vote|^\/done|^\/brexit|^\/get-ready-brexit-check/.test(window.location.pathname);
      }

      function viewCountPermitsShow() {
        var c = document.cookie.match('(?:^|[ ;])global_bar_seen=([0-9]+)');
        if (!c) {
          return true;
        }

        return parseInt(c.pop(), 10) < 3;
      }
    })(document);

    /* end minify */
  }


  /**
   * This is the minified version of the function above 'globalBarSource',
   * when developing and testing updates and features,
   * changes should be mirrored here manually.
   * Only the code between the 'begin/end minify' comments should be copied.
   */
  function globalBarMinified(fakeWindow) {
    var window = fakeWindow || root;

    /* begin minify */
    !function(t){"use strict";function e(){return!/^\/register-to-vote|^\/done|^\/brexit|^\/get-ready-brexit-check/.test(window.location.pathname)}function n(){var e=t.cookie.match("(?:^|[ ;])global_bar_seen=([0-9]+)");return e?parseInt(e.pop(),10)<3:!0}var o=t.documentElement;e()&&n()&&(o.className=o.className.concat(" show-global-bar"))}(document);
    /* end minify */
  }

  afterEach(function() {
    $('html').removeClass('show-global-bar');
    deleteAllCookies();

    function deleteAllCookies() {
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  });

  describe('when running the full source', function() {
    runTests(globalBarSource);
  });

  describe('when running the minified source', function() {
    runTests(globalBarMinified);
  });

  function runTests(globalBarFn) {
    it("shows when no cookie is set", function() {
      expectGlobalBarToBeHidden();
      globalBarFn();
      expectGlobalBarToShow();
    });

    it("does not show when bar has been seen 3 times", function() {
      GOVUK.setCookie('global_bar_seen', 3);
      expectGlobalBarToBeHidden();
      globalBarFn();
      expectGlobalBarToBeHidden();
    });

    it("shows when the bar has been seen 2 times", function() {
      GOVUK.setCookie('global_bar_seen', '2');
      globalBarFn();
      expectGlobalBarToShow();
    });

    it("shows when the bar has been seen 2 times and there are lots of cookies", function() {
      GOVUK.setCookie('global_bar_thing', '10');
      GOVUK.setCookie('seen_cookie_message', 'true');
      GOVUK.setCookie('global_bar_seen', '2');
      GOVUK.setCookie('is_global_bar_seen', '8');
      GOVUK.setCookie('_ua', '1234873487');
      globalBarFn();
      expectGlobalBarToShow();
    });

    it("shows when the cookie value is not a parseable number", function() {
      GOVUK.setCookie('global_bar_seen', 'foo_bar2');
      globalBarFn();
      expectGlobalBarToShow();
    });

    it("does not show on register to vote pages", function() {
      globalBarFn({location: {pathname: '/register-to-vote'}});
      expectGlobalBarToBeHidden();
    });

    it("does not show on done pages", function() {
      globalBarFn({location: {pathname: '/done'}});
      expectGlobalBarToBeHidden();
    });

    it("does not show on brexit landing page", function() {
      globalBarFn({location: {pathname: '/brexit'}});
      expectGlobalBarToBeHidden();
    });

    it("does not show on brexit checker pages", function() {
      globalBarFn({location: {pathname: '/get-ready-brexit-check'}});
      expectGlobalBarToBeHidden();
    });
  }

  function expectGlobalBarToShow() {
    expect($('html').is('.show-global-bar')).toBe(true);
  }

  function expectGlobalBarToBeHidden() {
    expect($('html').is('.show-global-bar')).toBe(false);
  }
});
