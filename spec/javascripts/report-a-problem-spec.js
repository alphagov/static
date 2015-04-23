describe("form submission for reporting a problem", function () {
    var FORM_TEXT = '<div class="report-a-problem-container">' +
                      '<div class="report-a-problem-content">' +
                        '<form><button class="button" name="button" type="submit">Send</button></form>' +
                      '</div>' +
                    '</div>';
    var form;

    beforeEach(function() {
        setFixtures(FORM_TEXT);
        form = $('form');
        new GOVUK.ReportAProblem($('.report-a-problem-container'));
    });

    it("should append a hidden 'javascript_enabled' field to the form", function() {
        expect(form.find("[name=javascript_enabled]").val()).toBe("true");
    });

    it("should append a hidden 'referrer' field to the form", function() {
        expect(form.find("[name=referrer]").val()).toBe("unknown");
    });

    describe("clicking on the toggle", function(){
        it("should toggle the visibility of the form", function() {
            expect(form).toBeVisible();

            $('a').click();

            expect(form).toBeHidden();

            $('a').click();

            expect(form).toBeVisible();
        });
    });

    describe("while the request is being handled", function() {
        it("should disable the submit button to prevent multiple problem reports", function () {
            spyOn($, "ajax").and.callFake(function(options) {});

            form.triggerHandler('submit');

            expect($('.button')).toBeDisabled();
        });
    });

    describe("if the request succeeds", function() {
        it("should replace the form with the response from the AJAX call", function() {
            spyOn($, "ajax").and.callFake(function(options) {
                options.success({message: 'great success!'});
            });

            form.triggerHandler('submit');

            expect(form).toBeHidden();
            expect($('.report-a-problem-content').html()).toEqual('great success!');
        });
    });

    describe("if the request is invalid", function() {
        it("should re-enable the submit button, in order to allow the user to resubmit", function () {
            spyOn($, "ajax").and.callFake(function(options) {
                options.error({status: 422}, 'error');
            });

            form.triggerHandler('submit');

            expect(form).toBeVisible();
            expect($('.button')).not.toBeDisabled();
        });
    });

    describe("if the request has failed with a status 500", function() {
        it("should display an error message", function() {
            spyOn($, "ajax").and.callFake(function(options) {
                options.statusCode[500]({responseText: 'this might not even be JSON because nginx intercepts the error'});
            });

            form.triggerHandler('submit');

            expect(form).not.toBeVisible();
            expect($('.report-a-problem-content').html()).toContain("Sorry, we’re unable to receive your message");
        });
    });
});
