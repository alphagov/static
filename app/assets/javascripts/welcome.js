$(function() {
  var welcomeCopy = "<h1>Hello!</h1><p>Welcome to GOV.UK, an experimental trial ('beta') replacement for DirectGov, and the first step towards a single government website. It aims to be as simple as possible, which should make it clear and straightforward to use.</p><p>Developed in 6 months by a team within the Government Digital Service, it's a direct response to Martha Lane Fox's 2010 review of government websites, which demanded revolution, not evolution, in the way that government services are delivered online.</p><p>As this is a test site, it's likely you may find inaccuracies and anomalies. We're expecting a few. So your feedback is really valuable, and we've included <a href='/help/feedback'>simple, clear ways in which you can give it to us</a>, and help make the site better.</p><p><strong>An important thing to note</strong> – if you need a fully working, tested, accurate site upon which to carry out any of your normal business with the government, head to <a href='http://direct.gov.uk'>DirectGov</a>.</p><p>And if you want to find out more about how this new GOV.UK beta site works, click here to take the tour.</p><p class='thanks'>Thanks for visiting</p><p><small>N.B. This site makes use of cookies. In case you're concerned about that or want to know more, there's information <a href='/help/cookies'>right here</a>.</small></p>";



  if(getCookie("govuktour") != "dismiss"){
    BetaPopup.popup(welcomeCopy, "welcome-tour"); 
  }

  function setCookie(name,value,days) {
      if (days) {
          var date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          var expires = "; expires="+date.toGMTString();
        }
      else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
      }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return          c.substring(nameEQ.length,c.length);
      }
    return null;
  }
  
  $(".welcome-tour .close").live("click", function(){
    setCookie("govuktour","dismiss",365);
    return;
  })
  
  
  if($(".carousel").length != 0){
    
    $(preloadImages).each(function() {
    	var item = $('<img />').attr('src',this).appendTo("<li></li>");
      item.parent().appendTo($(".carousel ul"));
    });
    
    
    $(".carousel").jCarouselLite({
      auto: 7000,
      visible: 1,
      speed: 600
    });
  }
});