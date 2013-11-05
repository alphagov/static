var GOVUK = GOVUK || {};

GOVUK.textareaCharacterCountdown = {};

GOVUK.textareaCharacterCountdown.initialize = function ($elementToMonitor, $remainingCharactersStatus, maximumCharacterNumber) {
    // initial setup
    GOVUK.textareaCharacterCountdown.update($remainingCharactersStatus, $elementToMonitor.text().length, maximumCharacterNumber);

    $elementToMonitor.on('input', function () {
        this.onkeydown = null;
        GOVUK.textareaCharacterCountdown.update($remainingCharactersStatus, this.value.length, maximumCharacterNumber);
    });

    $elementToMonitor.on('keydown', function () {
        GOVUK.textareaCharacterCountdown.update($remainingCharactersStatus, this.value.length, maximumCharacterNumber);
    });
}

GOVUK.textareaCharacterCountdown.update = function ($remainingCharactersStatus, typedCharacterNumber, maximumCharacterNumber) {
    var message;
    if (typedCharacterNumber == 0) {
        message = "(Limit is " + maximumCharacterNumber + " characters)";
    } else {
        var numberOfCharactersRemaining = maximumCharacterNumber - typedCharacterNumber;
        message = numberOfCharactersRemaining +  " characters remaining (limit is " + maximumCharacterNumber + " characters)";
    }
    $remainingCharactersStatus.html(message);
}
