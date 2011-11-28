$(document).ready(function() {
  // click on 'get started' CTA
  $(".get-started a").click(function(){
    _gaq.push(['_trackEvent', 'Citizen-Format-Transaction', 'Success-interaction']);
    return true;
  })
  
});
