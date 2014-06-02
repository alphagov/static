beforeEach(function () {
  jasmine.addMatchers({
    toBeEqualAsJSON: function (util, customEqualityTesters) {
      return {
        compare: function (actual, expected) {
          var actualAsJSON = JSON.stringify(actual);
          var expectedAsJSON = JSON.stringify(expected);

          var result = {};

          result.pass = actualAsJSON === expectedAsJSON;

          if (result.pass)
            result.message = "Expected " + actualAsJSON + " not to be equal to " + expectedAsJSON + " once converted to JSON";
          else
            result.message = "Expected " + actualAsJSON + " to be equal to " + expectedAsJSON + " once converted to JSON";

          return result;
        }
      }
    }
  });
});

// When using phantomJS JSON.parse seems bugged, returning a string instead of a built object.
// I'm unsure as to why, since when testing this behaviour directly in phantom it behaves
// as expected. This monkey patches the issue, but It'd be good to find out what's going on here.
var _JSON_parse = JSON.parse;
JSON.parse = function(json_string) {
  var result = _JSON_parse(json_string);
  if (typeof result == "string") {
    result = eval(result);
  }
  return result;
}
