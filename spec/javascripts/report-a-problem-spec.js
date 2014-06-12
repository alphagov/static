describe("form submission for reporting a problem", function () {
    var FORM_TEXT = '<div class="report-a-problem-container"><form><button class="button" name="button" type="submit">Send</button></form></div>';
    var form;

    beforeEach(function() {
        setFixtures(FORM_TEXT);
        form = $('form');
        form.submit(ReportAProblem.submit);
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
            expect($('.report-a-problem-container').html()).toEqual('great success!');
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
            expect($('.report-a-problem-container').html()).toContain("Sorry, we're unable to receive your message");
        });
    });
});
