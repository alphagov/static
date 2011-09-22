var AlphaCal = {
	/**
		@name AlphaCal.getDates
		@function
		@description Returns the JSON for a set of dates associated with a fixed date

		@param {Object} [opts] Options.
			Options
			@param String keyDate Set this to the date we're setting the view around (e.g. due date for a maternity calendar)

		@returns false

		@example
			AlphaCal.getDates({ 
				keyDate: "12/10/2011"
				}")
				
				// returns:
				{
					scope: {
						"scope": 12, // the number of months to display for data set 
						"firstMonth": "01", // the first month to display from
						"firstYear": "2011" // the first year to display from
						},
					dates: [
						{"summary": "Maternity starts",
						"dstart": "12-01-2011",
						"dtend": "13-09-2011",
						"duration": 105 // number of days segment lasts
						},
						{
						"summary": "Extended maternity",
						"dstart": "12-01-2011",
						"dtend": "14-02-2012",
						"duration": 105
						},
						{
						"summary": "Last date to inform employer of leave",
						"dstart": "12-01-2011",
						"dtend": "12-01-2011",
						"duration": 1
						}	
					]
				}
				
		@returns JSON
			
	*/
	getDates: function(opts){
		// this will be for calling to the service
	},

	
	/** 
		@name AlphaCal.show
		@function
		
		@description Generates a calendar with a set of dates defined in a JSON object
		
		@param String id Selector ID for the element in which to append the calendar
		@param JSON data A JSON object defining the dates (generally obtained from AlphaCal.getDates())
		
 	*/
	show: function(id, data){
		// passed in. dummy until we've got a service.
		var data = {
			scope: {
				"scope": 13,
				"firstMonth": "02",
				"firstYear": "2011"
				},
			dates: [
				{"summary": "Maternity starts",
				"dstart": "12-04-2011",
				"dtend": "13-09-2011",
				"duration": 105, // number of days segment lasts
				"id": "mat-start" // identifier for use as classname
				},
				{
				"summary": "Extended maternity",
				"dstart": "12-04-2011",
				"dtend": "14-02-2012",
				"duration": 105,
				"id": "ext-mat" 
				},
				{
				"summary": "Last date to inform employer of leave",
				"dstart": "12-05-2011",
				"dtend": "12-05-2011",
				"duration": 1,
				"id": "mat-inform" 
				}	
			]
		},
			id = "#calendar";
		

		
		// defined for use
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			
		
		// number of months we need
		var calendarScope = data.scope.scope;

		// this is just a pointer to the arrays of month info
		var month = data.scope.firstMonth - 1;
		
		// intital iterators
		var year = data.scope.firstYear;
		
		// get the first day of the week for our view (day of week for 1st of the month)
		var dow = new Date(year, month, "01").getDay();

		var created = 0;
		
	
		
		for(; created != calendarScope; created++){
			
			
			// output a table for each
			var newMonth = $("<table></table>")
			$(newMonth).append("<tr><th colspan='7'>"+months[month]+"</th></tr><tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>");
			
			// check for february and leap year fun
			if(month == 1){
				var isLeap = new Date(year,1,29).getDate();
					if(isLeap == 29){
						var i = 29;
					}
					else{
						var i = monthLengths[month];
					}
			}
			else{
				var i = monthLengths[month];
			}
			var row;
			
			// check how many extra empty cells we need at the start of a month and append those first
			var emptyDays = 7 - (6 - (dow-1)),
				paddingCells;
			
			var paddingCells = $("");
		
		 	row = $("<tr></tr>");
		
		 	while(emptyDays--){
				$(row).append("<td>&nbsp</td>")
			}
			
			
			
			for(j = 0; i != j; j++){
				
				var day = j+1;
				$(row).append("<td>"+day+"</td>")
				
				// when to append a row and when to start a new one.
				if(dow == 6){
					// means we're on a saturday! time to start a new one...
					$(newMonth).append(row);
					row = $("<tr></tr>");
					//console.log("modulus:"+dow%6+" new row!:"+dow)
				}
				
				// set DOW
				if(dow == 6){
					dow = 0;
				}
				else{
					dow++;
				}
				
			}
	
			// this'll append any left over days not in a full row of their own
			$(newMonth).append(row);

			// append the completed table
			$(id).append(newMonth);
			
			// configure next month and year we'll want
			if(month == 11){
				month = 0;
				year++;
			}
			else{
				month++;
			}
			
			
		} // end month appending
		

		// if adding month position 1, check if leap year and modify days to 29
		
		
		
	/* unicode chars 
	&#x2606; WHITE STAR
	&#x2605; BLACK STAR
	&#x2660; SPADE
	&#x2663; CLUB
	&#x2666; DIAMOND
	&#x2665; HEART
	&#x20DD; CIRCLE OUTLinER
	&#x20E3; SQUARE OUTLINER
	&#x25C8; B&W STARTER MARKER
	&#x0333; double below
	
 */
		// apply data
		// check how many dates
		// for each of the DATES:  data.dates[1].summary
		// if duration is 1, apply class once
		// if duration larger than 1, apply class to all cells from dstart until dtend
		
	}
}