$(function(){
  function checkOverflow(){
    if($(window).width() >= "768"){
      if($(".related-positioning").length !== 0){
        var viewPort = $(window).height();
        var relatedBox = $(".related").height();
        var boxOffset = $(".related-positioning").position().top;
        if(relatedBox > (viewPort - boxOffset)){
          $(".related-positioning").css("position", "absolute");
          return true;
        } else {
          $(".related-positioning").css("position", "fixed");
          return false;
        }
      }
    }
    return false;
  }
  if(!checkOverflow()){
    window.GOVUK.stopScrollingAtFooter.addEl($('.related-positioning'), $('#related').height());
  }
});
