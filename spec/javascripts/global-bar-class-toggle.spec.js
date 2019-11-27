describe("toggling a global bar HTML class based on cookie", function () {
  var root = window;

  /**
   * The global bar needs to be activated early in page loading to prevent
   * a flash of unstyled content, to do this we need to minify and inline
   * the activation logic into the page head.
   * This spec runs tests against both the full and minified sources of the
   * activation JS because minification is not automated.
   *
   * This is the code copied from global_bar.html.erb.
   * when developing and testing updates and features,
   * changes should be mirrored here manually.
   * Code outside the 'begin/end minify' comments has been slightly tweaked to allow flexible testing structure.
   */
  function globalBarMinified(fakeWindow, close_date) {
    var window = fakeWindow || root;

    CLOSE_DATE = close_date || false;
    var today = new Date();

    if (!CLOSE_DATE || today < CLOSE_DATE) {
    /* begin minify */
      !function(e){COOKIE_VERSION=3;function n(){var e=new Date(Date.now()+72576e5).toUTCString();document.cookie='global_bar_seen={"count":0,"version":'+COOKIE_VERSION+"}; expires="+e+";"}var t,a,r,c=e.documentElement;!/^\/register-to-vote|^\/done|^\/brexit|^\/get-ready-brexit-check/.test(window.location.pathname)&&(a=document.cookie.match("(?:^|[ ;])(?:global_bar_seen=)(.+?)(?:(?=;|$))"),r=!1,null===a?(n(),r=!0):(t=a[1],void 0===JSON.parse(t).version||JSON.parse(a[1]).version!==COOKIE_VERSION?(n(),r=!0):(a=JSON.parse(a[1]),r=parseInt(a.count,10)<3)),r)&&(c.className=c.className.concat(" show-global-bar"))}(document);
    /* end minify */
    }
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

  it("shows when no cookie is set", function() {
    expectGlobalBarToBeHidden();
    globalBarMinified();
    expectGlobalBarToShow();
  });

  it("does not show when bar has been seen 3 times", function() {
    document.cookie = "global_bar_seen="+JSON.stringify({"count": 3, "version": 3})

    expectGlobalBarToBeHidden();
    globalBarMinified();
    expectGlobalBarToBeHidden();
  });

  it("shows when the bar has been seen 2 times", function() {
    document.cookie = "global_bar_seen="+JSON.stringify({"count": 2, "version": 3})

    globalBarMinified();
    expectGlobalBarToShow();
  });

  it("shows when the bar has been seen 2 times and there are lots of cookies", function() {
    GOVUK.setCookie('global_bar_thing', '10');
    GOVUK.setCookie('seen_cookie_message', 'true');
    document.cookie = "global_bar_seen="+JSON.stringify({"count": 2, "version": 3})
    GOVUK.setCookie('is_global_bar_seen', '8');
    GOVUK.setCookie('_ua', '1234873487');
    globalBarMinified();
    expectGlobalBarToShow();
  });

  it("shows when the close date is not set (false)", function() {
    document.cookie = "global_bar_seen="+JSON.stringify({"count": 1, "version": 2})

    globalBarMinified({location: {pathname: '/done'}});
    expectGlobalBarToShow();
  });

  it("does not show when the close date is in the past", function() {
    document.cookie = "global_bar_seen="+JSON.stringify({"count": 1, "version": 2})

    past_date = new Date(1990, 10, 27, 17, 50, 00, 00);

    globalBarMinified({location: {pathname: '/done'}}, past_date);
    expectGlobalBarToBeHidden();
  });

  it("shows when the close date is in the future", function() {
    document.cookie = "global_bar_seen="+JSON.stringify({"count": 1, "version": 2})

    future_date = new Date() + 1

    globalBarMinified({location: {pathname: '/done'}}, future_date);
    expectGlobalBarToShow();
  });

  it("does not show on register to vote pages", function() {
    globalBarMinified({location: {pathname: '/register-to-vote'}});
    expectGlobalBarToBeHidden();
  });

  it("does not show on done pages", function() {
    globalBarMinified({location: {pathname: '/done'}});
    expectGlobalBarToBeHidden();
  });

  it("does not show on brexit landing page", function() {
    globalBarMinified({location: {pathname: '/brexit'}});
    expectGlobalBarToBeHidden();
  });

  it("does not show on brexit checker pages", function() {
    globalBarMinified({location: {pathname: '/get-ready-brexit-check'}});
    expectGlobalBarToBeHidden();
  });

  function expectGlobalBarToShow() {
    expect($('html').is('.show-global-bar')).toBe(true);
  }

  function expectGlobalBarToBeHidden() {
    expect($('html').is('.show-global-bar')).toBe(false);
  }
});
