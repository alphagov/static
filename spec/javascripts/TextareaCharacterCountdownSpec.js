FORM_TEXT = '<textarea></textarea><p id="status-area">some text</p>';

describe("textarea character countdown", function () {
    var $textarea, $statusArea;

    beforeEach(function() {
        setFixtures(FORM_TEXT);
        $textarea = $('textarea');
        $statusArea = $('#status-area');

        GOVUK.textareaCharacterCountdown.initialize($textarea, $statusArea, 1000);
    });

    it("should initialise to show the maximum", function () {
        expect($statusArea.html()).toEqual('(Limit is 1000 characters)');
    });

    it("should update to show the remaining characters when something is typed in the text area", function() {
        $textarea.val("aa");
        $textarea.trigger(jQuery.Event( 'keydown', { which: 'a' } ));

        expect($statusArea.html()).toEqual('998 characters remaining (limit is 1000 characters)');
    });
});
