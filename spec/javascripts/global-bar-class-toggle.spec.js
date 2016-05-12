describe("toggling a global bar HTML class based on cookie", function () {
  var root = window;

  function globalBarSource(fakeWindow) {
    var window = fakeWindow || root;

    /* --------------------------------------- */

    (function (document) {
      "use strict"
      var documentElement = document.documentElement;
      if (datePermitsShow() && urlPermitsShow() && viewCountPermitsShow()) {
        documentElement.className = documentElement.className.concat(' show-global-bar');
      }

      function urlPermitsShow() {
        return !/^\/register-to-vote|^\/done/.test(window.location.pathname);
      }

      function viewCountPermitsShow() {
        var c = document.cookie.match('(?:^|[ ;])global_bar_seen=([0-9]+)');
        if (!c) {
          return true;
        }

        return parseInt(c.pop(), 10) < 3;
      }

      function datePermitsShow() {
        var ends = new Date("May 26 2016 15:59:59").getTime(),
            now = new Date().getTime();

        return now <= ends;
      }
    })(document);

    /* --------------------------------------- */
  }

  function globalBarMinified(fakeWindow) {
    var window = fakeWindow || root;

    /* --------------------------------------- */
    !function(e){"use strict";function t(){return!/^\/register-to-vote|^\/done/.test(window.location.pathname)}function n(){var t=e.cookie.match("(?:^|[ ;])global_bar_seen=([0-9]+)");return t?parseInt(t.pop(),10)<3:!0}function a(){var e=new Date("May 26 2016 15:59:59").getTime(),t=(new Date).getTime();return e>=t}var o=e.documentElement;a()&&t()&&n()&&(o.className=o.className.concat(" show-global-bar"))}(document);
    /* --------------------------------------- */
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
    describe("before May 26 4pm", function() {
      beforeEach(function() {
        var originalDate = Date;
        spyOn(window, 'Date').and.callFake(function(params) {
          if (params) {
            return new originalDate(params);
          } else {
            return new originalDate("May 26, 2016 15:00:00");
          }
        });
      });

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
    });

    it("does not show after 26 May 4pm", function() {
      var originalDate = Date;
      spyOn(window, 'Date').and.callFake(function(params) {
        if (params) {
          return new originalDate(params);
        } else {
          return new originalDate("May 26, 2016 16:00:00");
        }
      });

      globalBarFn();
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
