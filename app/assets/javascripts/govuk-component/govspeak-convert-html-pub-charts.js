function govspeakBarcharts() {
    $('.govuk-govspeak .js-barchart-table:not(.mc-chart):not(.js-barchart-table-init)').each(function() {
        $.magnaCharta($(this), {
            toggleText: "Change between chart and table"
        });
      $(this).addClass('js-barchart-table-init')
    })
}
$(govspeakBarcharts);
