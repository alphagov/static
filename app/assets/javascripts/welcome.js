$(function() {
  
  
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