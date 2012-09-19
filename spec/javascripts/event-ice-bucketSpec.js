describe("the event ice bucket", function () {

    var someLink = $('<a id="some-link" data-clicked="false" href="#"></a>')

    beforeEach(function () {
        someLink.clone().addClass('stub').appendTo('body');
    });

    afterEach(function () {
        "use strict";
        $('.stub').remove();
    });

    it("should exist inside the jQuery namespace", function () {
        registerEventIceBucket();
        expect($.freezeEvent).toBeDefined();
    });

    it("should produce a click event which points to the original target", function () {
        $('.stub').click(function() {
            $(this).attr("data-clicked","true");
        });

        var someEvent = $.Event('click');
        someEvent.target = $('.stub').get(0); // only assigning to constant for testing.

        var frozenEvent = $.freezeEvent(someEvent);

        frozenEvent.unfreeze();

        expect($('.stub').attr('data-clicked')).toBeTruthy();
    });

    it("should simulate opening in a new tab for pre ie9 browsers and non-browser based events", function () {
        var someEvent = $.Event('click');
        someEvent.target = $('.stub').get(0);
        someEvent.ctrlKey = true;

        var frozenEvent = $.freezeEvent(someEvent);
        frozenEvent.unfreeze();

        expect($('.stub').attr('data-clicked')).toBeTruthy();
        expect($('.stub').attr('target')).toBe('_blank');
    });

    it("should exactly copy underlying browser mouse events for DOM level 2 browsers", function () {
        var unfrozenEvent={};
        $('.stub').click(function(event) {
            unfrozenEvent = event;
        });

        var someEvent = $.Event('click');
        someEvent.originalEvent = document.createEvent('MouseEvents');
        someEvent.originalEvent.initMouseEvent('click',true,true,window,1,90,90,90,90,false,false,false,false,0,null);
        someEvent.target = $('.stub').get(0);

        var frozenEvent = $.freezeEvent(someEvent);
        frozenEvent.unfreeze();

        expect(unfrozenEvent.originalEvent.type).toBe(someEvent.originalEvent.type);
        expect(unfrozenEvent.originalEvent.bubbles).toBe(someEvent.originalEvent.bubbles);
        expect(unfrozenEvent.originalEvent.cancelable).toBe(someEvent.originalEvent.cancelable);
        expect(unfrozenEvent.originalEvent.view).toBe(someEvent.originalEvent.view);
        expect(unfrozenEvent.originalEvent.detail).toBe(someEvent.originalEvent.detail);
        expect(unfrozenEvent.originalEvent.screenX).toBe(someEvent.originalEvent.screenX);
        expect(unfrozenEvent.originalEvent.screenY).toBe(someEvent.originalEvent.screenY);
        expect(unfrozenEvent.originalEvent.clientX).toBe(someEvent.originalEvent.clientX);
        expect(unfrozenEvent.originalEvent.clientX).toBe(someEvent.originalEvent.clientY);
        expect(unfrozenEvent.originalEvent.ctrlKey).toBe(someEvent.originalEvent.ctrlKey);
        expect(unfrozenEvent.originalEvent.metaKey).toBe(someEvent.originalEvent.metaKey);
        expect(unfrozenEvent.originalEvent.button).toBe(someEvent.originalEvent.button);
        expect(unfrozenEvent.originalEvent.relatedTarget).toBe(someEvent.originalEvent.relatedTarget);
    });


});