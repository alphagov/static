$(document).ready(function() {
	
	var data = AlphaCal.getDates();
	
	AlphaCal.show("#calendar", {
		scope: data.scope.scope, 
		month: data.scope.firstMonth, 
		year: data.scope.firstYear
		});
	
	AlphaCal.applyDates("#calendar", data.dates);
	
});