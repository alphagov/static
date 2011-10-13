/**
	@name BetaFeedback
	@namespace
	@description A set of methods for generating feedback popups
	@requires jquery 1.6.2
*/

var BetaFeedback = {
	/**
		@name BetaFeedback.cta
		@function
		@description Creates a call to action button panel
		@param position [top|left|bottom|right] The position of the call to action - not that top and bottom will provide a full width bar, and left and right will provide a box.
		
		@param opts Options object
			@param html The html to use within the box
			@param delay Number of seconds to delay showing the call to action (default is 3 seconds)
			
		@example
			BetaFeedback.cta();
	*/
	
	cta: function(position, opts) {
		var html = "<div id='feedback-cta' class='"+position+"'><h2>Did you find what you're looking for?</h2><form><input id='cta-yes' type='button' value='Yes' /><input id='cta-no' type='button' value='No' /></form></div>";
		var delay = 3000;
		$("body").append(html);
		$("#cta-yes").click(function(){
			// send to a collection bucket
			$("#feedback-cta").html("<h2>Thanks for letting us know</h2>");
			$("#feedback-cta").delay(1500).fadeOut('slow');
		})
		$("#cta-no").click(function(){
			BetaFeedback.popup();
		})
		$("#feedback-cta").delay(3000).fadeIn(1500);
		
	},

	/**
		@name BetaFeedback.popup
		@function
		@description Shows a feedback popup
		
		@example
			BetaFeedback.popup();
	*/
	
	popup: function(){
		$("#feedback-cta").fadeOut('fast');
		
		var html = "<div id='feedback-popup'><a href='' id='close-feedback'>Close</a><h2>Help improve gov.uk</h2><form><label>Describe what kind of problem you're having</label><select><option>Missing information</option></select><textarea /><input type='submit' value='Send' /></form><div id='related-popup'><h2>Related items</h2><ul><li>Related article item</li><li>Related article item</li><li>Related article item</li></ul></div></div>";
		$("body").append(html);
		$("body").append("<div id='mask'></div>")
		

		
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
		$("#feedback-popup").css('top',  winH/2-$("#feedback-popup").height()/2);
		$("#feedback-popup").css('left', winW/2-$("#feedback-popup").width()/2);


		//transition effect
/*		$("#feedback-popup").css({'display':'block'});
		*/
		
		$("#feedback-popup").delay(500).slideDown('slow');
		$("#close-feedback").click(function(){
			$("#feedback-popup").slideUp('fast');	
			$("#mask").fadeOut();
			return false;
		})
	}
};
