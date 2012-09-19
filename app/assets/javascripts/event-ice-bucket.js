// adding this to the jQuery name space
var registerEventIceBucket = function () {
    $.extend({
        freezeEvent:function (event) {
            var newEventTrigger = {};

            var cloneBrowserEvent = function (originalEvent) {
                var newEvent = document.createEvent('MouseEvents');
                newEvent.initMouseEvent(
                    originalEvent.type,
                    originalEvent.bubbles,
                    originalEvent.cancelable,
                    originalEvent.view,
                    originalEvent.detail,
                    originalEvent.screenX,
                    originalEvent.screenY,
                    originalEvent.clientX,
                    originalEvent.clientY,
                    originalEvent.ctrlKey,
                    originalEvent.altKey,
                    originalEvent.shiftKey,
                    originalEvent.metaKey,
                    originalEvent.button,
                    originalEvent.relatedTarget);
                return newEvent;
            };

            if ((event.originalEvent !== undefined) && event.originalEvent.initMouseEvent) {
                var newEvent = cloneBrowserEvent(event.originalEvent);
                newEventTrigger = function () {
                    event.target.dispatchEvent(newEvent);
                };
            } else {
                var shouldOpenInNewWindow = event.metaKey || event.ctrlKey;
                newEventTrigger = function () {
                    if (shouldOpenInNewWindow) {
                        $(event.target).attr('target', '_blank');
                    }
                    event.target.click();
                };
            }
            return { unfreeze:newEventTrigger };
        }
    });
};

$(registerEventIceBucket);