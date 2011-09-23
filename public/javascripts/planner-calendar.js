var AlphaCal = {
	/**
		@name AlphaCal.getDates
		@function
		@description Returns the JSON for a set of dates associated with a fixed date

		@param {Object} [opts] Options.
			Options
			@param String keyDate Set this to the date we're setting the view around (e.g. due date for a maternity calendar)
			@param String dataSet Set for the data set around given keydate that we're interested in
			
		@returns false

		@example
			AlphaCal.getDates({ 
				keyDate: "17-2-2012",
				dataSet: "maternity"
				}")
				
				// returns:
				{
					scope: {
						"scope": 27, // the number of months to display for data set 
						"firstMonth": "1", // the first month to display from
						"firstYear": "2011" // the first year to display from
						},
					dates: [
						{"summary": "Date you must tell your employer",
						"dtstart": "5-11-2011",
						"dtend": "5-11-2011",
						"duration": 1, // number of days segment lasts
						"id": "notify-employer"
						},
						{
						"summary": "Earliest you may start maternity",
						"dtstart": "27-11-2011",
						"dtend": "27-11-2011",
						"duration": 1,
						"id": "mat-leave"
						},
						{
						"summary": "Period of Ordinary Maternity Leave",
						"dtstart": "16-1-2011",
						"dtend": "15-7-2012",
						"duration": 105,
						"id": "ordinary-mat"
						},
						{
						"summary": "Period of Additional Maternity Leave",
						"dtstart": "16-7-2012",
						"dtend": "12-1-2013",
						"duration": 105,
						"id": "additional-mat"
						},
						{
						"summary": "Expected week of childbirth",
						"dtstart": "12-2-2012",
						"dtend": "18-2-2012",
						"duration": 7,
						"id": "expecting-week"
						},
						{
						"summary": "Baby's due date",
						"dtstart": "17-2-2012",
						"dtend": "17-2-2012",
						"duration": 1,
						"id": "due-date"
						}
					]
				}
				
		@returns JSON
			
	*/
	getDates: function(opts){
		var data = {
			scope: {
				"scope": 27, // the number of months to display for data set 
				"firstMonth": "1", // the first month to display from
				"firstYear": "2011" // the first year to display from
				},
			dates: [
				{"summary": "Date you must tell your employer",
				"dtstart": "5-11-2011",
				"dtend": "5-11-2011",
				"duration": 1, // number of days segment lasts
				"id": "notify-employer"
				},
				{
				"summary": "Earliest you may start maternity",
				"dtstart": "27-11-2011",
				"dtend": "27-11-2011",
				"duration": 1,
				"id": "mat-leave"
				},
				{
				"summary": "Period of Ordinary Maternity Leave",
				"dtstart": "16-1-2011",
				"dtend": "15-7-2012",
				"duration": 105,
				"id": "ordinary-mat"
				},
				{
				"summary": "Period of Additional Maternity Leave",
				"dtstart": "16-7-2012",
				"dtend": "12-1-2013",
				"duration": 105,
				"id": "additional-mat"
				},
				{
				"summary": "Expected week of childbirth",
				"dtstart": "12-2-2012",
				"dtend": "18-2-2012",
				"duration": 7,
				"id": "expecting-week"
				},
				{
				"summary": "Baby's due date",
				"dtstart": "17-2-2012",
				"dtend": "17-2-2012",
				"duration": 1,
				"id": "due-date"
				}
			]
		}
		/*Date you must tell your employer 05 November 2011
    Earliest you may start maternity leave 27 November 2011
    Period of Ordinary Maternity Leave January 16 2011 – July 15 2012
    Period of Additional Maternity Leave July 16 2012 – January 12 2013
    Expected week of childbirth February 12 2012 – February 18 2012
    Baby's due date 17 February 2012
    */
		return data;
		// this will be for calling to the service
	},

	
	/** 
		@name AlphaCal.show
		@function
		
		@description Generates a calendar view of any number of months starting at any month or year.
		
		@param String id Selector for the element in which to append the calendar
		@param {Object} opts Options object
			@param {Number} [opts.scope=12] Size of the calendar
			@param {Number} [opts.month=01] First month to display calendar from
			@param {Number} [opts.year=current year] First year to display the calendar from
		
		@example
			// will append a calendar of 13 months length, starting in February, to the element #calendar
			AlphaCal.show("#calendar", {
				scope: 13, 
				month: 02, 
				year: 2011
				});
			
		
 	*/
	show: function(id, opts){
		// set defaults
		var opts = opts || {}, 
			scope = opts.scope || 12,
			month = opts.month || 01,
			year = opts.year || new Date().getYear();
		
		// defined for use
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			created = 0;

		// this is just a pointer to the arrays of month info
		var month = month - 1;
		
		// get the first Day Of the Week for our view (day of week for 1st of the month)
		var dow = new Date(year, month, "01").getDay();

		for(; created != scope; created++){
			var row;
			
			// output a table for each
			var newMonth = $("<table></table>")
			$(newMonth).append("<tr><th colspan='7'>"+months[month]+" "+year+"</th></tr><tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>");
			
			// check for february and leap year fun
			if(month == 1){
				var leapCheck = new Date(year,1,29).getDate();
					if(leapCheck == 29){
						var i = 29;
					}
					else{
						var i = monthLengths[month];
					}
			}
			else{
				var i = monthLengths[month];
			}
			
			// check how many extra empty cells we need at the start of a month and append those first
			var emptyDays = 7 - (6 - (dow-1)),
				paddingCells = $(""),
				row = $("<tr></tr>");
		
		 	while(emptyDays--){
				$(row).append("<td class='blank'>&nbsp</td>")
			}
			
			// now start printing out the days
			for(j = 0; i != j; j++){
				
				var day = j+1,
					ISOmonth = month+1;
				$(row).append("<td class='"+day+"-"+ISOmonth+"-"+year+"'>"+day+"</td>")
				
				// when to append a row and when to start a new one.
				if(dow == 6){
					// means we're on a saturday! time to start a new one...
					$(newMonth).append(row);
					row = $("<tr></tr>");
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
			
			
		}; // end month appending
		
	},

	/** 
		@name AlphaCal.applyDates
		@function
		
		@description Applies classes for dates to a calendar with specified information
		
		@param String id A container selector where the calendar you wish to apply dates to will be found
		@param JSON dates A JSON object defining the dates you wish to display
		
		@example
			// will apply dates to a calendar that resides in #calendar.  The data should be of the form, with expected values of summary, dtstart, dtend, duration and id:
			var data = {
				dates: [
					{"summary": "Date you must tell your employer",
					"dtstart": "5-11-2011",
					"dtend": "5-11-2011",
					"duration": 1, // number of days segment lasts
					"id": "notify-employer"
					}
				]
			AlphaCal.applyDates("#calendar", data);
			
		
 	*/
	applyDates: function(id, dates){
		var l = dates.length;
		
		// the calendar cells that we need to process
		var cells = $(id+" td:not(.blank)"),
			j = cells.length,
			found = false;
	
		
		
		while(l--){
			
			$(cells).each(function(){
				
				if($(this).hasClass(dates[l].dtstart)){
					$(this).addClass(dates[l].id)
					if(dates[l].duration != 1){
						found = true;
					}
				}
				else if($(this).hasClass(dates[l].dtend)){
					$(this).addClass(dates[l].id)
					found = false;
				}
				else if(found === true){
					
					$(this).addClass(dates[l].id)
				}
			})
			found = false;
	
		}
		

		/* unicode chars that we're probably going to need for printing
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
	}
	
	
}