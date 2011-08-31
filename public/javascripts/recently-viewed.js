/* this keeps a record of which pages have recently been accessed across the domain.  It only tracks the URL and the h1 title, and stores in in localstorage.  None of it is send back to the server or set in cookies. */

$(function(){

	function supports_html5_storage() {
	  try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	  } catch (e) {
	    return false;
	  }
	}
	if(supports_html5_storage()){

		if(localStorage.getItem("betagov-visited") != undefined){
			var stored = localStorage.getItem("betagov-visited");
		}
		else{
			var stored = "";
		}

		// record a link
		function addLink(toStore){

			// if more than 5 stored, clear the data, remove the first, put them back in the object
			// if less than 5, just add to the end
			if(stored != ""){
				var saved = stored.split(',');
				var i = saved.length;
				while(i--){
					
				}
			}
			else return false;
			
			
			if(stored == ""){
				var store = toStore;
			}
			else if(i <= 5){
				var store = stored+","+toStore;
			}
			else{
				var old = stored;
				while(i--){
			
					resetRecent();
				}
			}
			localStorage.setItem("betagov-visited", store);
			stored = localStorage.getItem("betagov-visited");

 		}
		
		
		// see if we've got anything stored, see how many are already stored
		
		// get the uri, h1, type (meta data) and stick it into localstorage
		function getPageData(){
			var uri = location.pathname,
				title = $("#wrapper.programme hgroup h1").text(),
				type;
				
				addLink(uri+":"+title);
		}
		
		
		//reset hidden sections
		function resetRecent(){
			localStorage.removeItem("betagov-visited");
			stored = "";
		}


	//	getPageData();

	}
	
	
});