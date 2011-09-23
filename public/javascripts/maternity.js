$(document).ready(function() {
	
	// probably going to make this a generic script for all the planners, just needs to get a 'dataType' from the page to individualise.

	var data = AlphaCal.getDates();
	
	AlphaCal.show("#calendar", {
		scope: data.scope.scope, 
		month: data.scope.firstMonth, 
		year: data.scope.firstYear
		});
	
	AlphaCal.applyDates("#calendar", data.dates);
	
});