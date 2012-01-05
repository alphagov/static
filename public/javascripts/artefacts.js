$(function() {
  var blankByDefault = ($("#artefact_slug").attr('value') != '');
  var generateSlug = function generateSlug() {
    if(blankByDefault) { return }
    var title = $("#artefact_name").val();
    var slug = title.toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .replace(/^-+|-+$/, '')
    $("#artefact_slug").val(slug);
  }
  $("#artefact_name").change(generateSlug)
  $("#artefact_name").bind('keyup', generateSlug)

  $('a[rel=external]').attr('target','_blank');
  $('.related select').chosen({
    allow_single_deselect: true, 
    no_results_text: "No results matched"
  });
  $('form.formtastic fieldset.related, form.formtastic fieldset.related > ol > li').css('overflow', 'visible');

  $('.flash-notice').delay(4000).slideUp(300).
    one('click', function () { $(this).slideUp(300); });
});
