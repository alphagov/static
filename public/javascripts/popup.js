/**
	@name BetaPopup
	@namespace
	@description A set of methods for generating popups and related odds and ends
	@requires jquery 1.6.2
*/

var BetaPopup = {
	

	/**
		@name BetaPopup.popup
		@function
		@description Shows a feedback popup
		
		@example
			BetaPopup.popup();
	*/
	
	popup: function(html, ident){
	
		$("body").append("<div id='mask'></div>");
		$("body").append("<div id='popup' class="+ident+"></div>");
		$("#popup").append(html);
		
		//Get the screen height and width
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();

 		//Set heigth and width to mask to fill up the whole screen
		$('#mask').css({'width':maskWidth,'height':maskHeight});
     
		$('#mask').fadeTo("slow",0.8);  

		//Get the window height and width
		var winH = $(window).height();
		var winW = $(window).width();

		//Set the popup window to center
		$("#popup").css('left', winW/2-$("#popup").width()/2);

		$("#popup").delay(500).slideDown('slow');
		$(".close").click(function(){
			$("#popup").slideUp('fast');	
			$("#mask").fadeOut();
			$("#mask").destroy();
			$("#popup").destroy();
			return false;
		})
	}
};
