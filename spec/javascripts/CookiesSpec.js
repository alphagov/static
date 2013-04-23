describe("Cookies", function () {
  var cookie;

  var key = "joe";
  var value = "bloggs";

  beforeEach(function () {
    cookie = new GOVUK.Cookie();
  });

  afterEach(function () {
    document.cookie = key + "=;expires=" + new Date(0).toGMTString();
    cookie = null;
  });

  it("should write the key/value pair to the cookie", function () {
    expect(document.cookie).toBe("");
    cookie.write(key, value);
    expect(document.cookie).toBe(key + "=" + value);
  });

  it("should delete a cookie value given the key", function () {
    cookie.write(key, value);
    expect(document.cookie).toBe(key + "=" + value);
    cookie.delete(key, value);
    expect(document.cookie).toBe("");
  });

  it("should read the cookie value given the key", function () {
    cookie.write(key, value);
    expect(document.cookie).toBe(key + "=" + value);
    expect(cookie.read(key)).toBe(value);
  });
});
