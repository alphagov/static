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
	
	popup: function(html){
		
		

		$("body").append("<div id='mask'></div>")
		$("#feedback-popup").html("");
		$("#feedback-popup").append(html);
		
		
		
		//Get the screen height and width
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();

 		//Set heigth and width to mask to fill up the whole screen
		$('#mask').css({'width':maskWidth,'height':maskHeight});

		//transition effect             
		//$('#mask').fadeIn(1000);        
		$('#mask').fadeTo("slow",0.8);  

		//Get the window height and width
		var winH = $(window).height();
		var winW = $(window).width();

		//Set the popup window to center
		//$("#feedback-popup").css('top',  winH/2-$("#feedback-popup").height()/2);
		$("#feedback-popup").css('left', winW/2-$("#feedback-popup").width()/2);


		//transition effect
/*		$("#feedback-popup").css({'display':'block'});
		*/
		
		$("#feedback-popup").delay(500).slideDown('slow');
		$(".close").click(function(){
			$("#feedback-popup").slideUp('fast');	
			$("#mask").fadeOut();
			return false;
		})
	}
};
