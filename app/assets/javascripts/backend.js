$(document).ready( function() {
  $('nav.gds-menu select').change( function() {
    window.location = $(this).val();
  });
});