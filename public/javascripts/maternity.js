$(document).ready(function() {
	
	// probably going to make this a generic script for all the planners, just needs to get a 'dataType' from the page to individualise.


		// need to get the date and type from the form being submitted and pass to getDates();
		var data = AlphaCal.getDates();

		AlphaCal.show("#calendar", {
			scope: data.scope.scope, 
			month: data.scope.firstMonth, 
			year: data.scope.firstYear
			});

		AlphaCal.applyDates("#calendar", data.dates);
		generateLegend(".key-dates", data.dates);

	
	// this is probably too specialised for AlphaCal, but if it turns out it's not, it'll move.
	function generateLegend(id, dates){
		var l = dates.length,
			li,
			timeElems,
			ol = $("<ol></ol>");

		for(i=0; i < l; i++){
			// there's not always a seperate dtend
 			if(dates[i].duration != 1){
				timeElems = "<time class='dtstart' datetime='"+dates[i].dtstart+"'>"+dates[i].dtstart+"</time> &ndash; <time class='dtend' datetime='"+dates[i].dtend+"'>"+dates[i].dtend+"</time>"
			}
			else{
				timeElems = "<time class='dtstart dtend' datetime='"+dates[i].dtstart+"'>"+dates[i].dtstart+"</time>";
			};
			
			// build final element
			li = "<li class='vevent "+dates[i].id+"'><span class='summary url'>"+dates[i].summary+"</span>: "+timeElems+"</li>";
			$(ol).append(li);
		}
		$(".key-dates").append(ol);
		
	}
	
	
});