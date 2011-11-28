$(document).ready(function() {
  // click on 'get started' CTA
  $(".get-started a").click(function(){
    _gaq.push(['_trackEvent', 'Citizen-Format-Localservice', 'Success-interaction']);
    return true;
  })
  
});
