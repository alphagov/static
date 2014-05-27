beforeEach(function () {
    this.addMatchers({
        toBeEqualAsJSON:function (expected) {
            var actualAsJSON = JSON.stringify(this.actual);
            var expectedAsJSON = JSON.stringify(expected);

            this.message = function () {
                return "Expected " + actualAsJSON + " to be equal to " + expectedAsJSON + " once converted to JSON";
            };

            return actualAsJSON === expectedAsJSON;
        }
    });
});
