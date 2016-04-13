describe("toggling a global bar HTML class based on cookie", function () {

  function globalBarSource() {
    (function (document) {
      "use strict"
      var documentElement = document.documentElement;
      if (showGlobalBanner()) {
        documentElement.className = documentElement.className.concat(' show-global-bar');
      }

      function showGlobalBanner() {
        var c = document.cookie.match('(?:^|[ ;])global_bar_seen=([0-9]+)');
        if (!c) {
          return true;
        }

        return parseInt(c.pop(), 10) < 2;
      }
    })(document);
  }

  function globalBarMinified() {
    !function(a){"use strict";function e(){var e=a.cookie.match("(?:^|[ ;])global_bar_seen=([0-9]+)");return e?parseInt(e.pop(),10)<2:!0}var c=a.documentElement;e()&&(c.className=c.className.concat(" show-global-bar"))}(document);
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

    it("does not show when bar has been seen twice", function() {
      GOVUK.setCookie('global_bar_seen', 2);
      expectGlobalBarToBeHidden();
      globalBarFn();
      expectGlobalBarToBeHidden();
    });

    it("shows when the bar has been seen 1 time", function() {
      GOVUK.setCookie('global_bar_seen', '1');
      globalBarFn();
      expectGlobalBarToShow();
    });

    it("shows when the bar has been seen 1 time and there are lots of cookies", function() {
      GOVUK.setCookie('global_bar_thing', '10');
      GOVUK.setCookie('seen_cookie_message', 'true');
      GOVUK.setCookie('global_bar_seen', '1');
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
  }

  function expectGlobalBarToShow() {
    expect($('html').is('.show-global-bar')).toBe(true);
  }

  function expectGlobalBarToBeHidden() {
    expect($('html').is('.show-global-bar')).toBe(false);
  }
});
