function govspeakBarcharts() {
    $('.govuk-govspeak .js-barchart-table').each(function() {
        $.magnaCharta($(this), {
            toggleText: "Change between chart and table"
        });
    })
}
$(govspeakBarcharts);
