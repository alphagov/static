$(function(){
	function supports_html5_storage() {
	  try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	  } catch (e) {
	    return false;
	  }
	}
	
	if(supports_html5_storage()){

		if(localStorage.getItem("deleted-sections") != undefined){
			var stored = localStorage.getItem("deleted-sections");
		}
		else{
			var stored = "";
		}
		var sections = $(".site-sections li");
		//add something to our localStorage we want to delete from the main page
		function addRemovedSection(toStore){
			if(stored == null){
				var store = toStore;
			}
			else{
				var store = stored+","+toStore;
			}
			localStorage.setItem("deleted-sections", store);
			stored = localStorage.getItem("deleted-sections");
			getLocallyStored();
 		}
		
		
		//retrieve and hide hidden sections
		function getLocallyStored(){
			if(stored != null){
				var toHide = stored.split(',');
				var i = toHide.length;
				while(i--){
					var classToFind = "."+toHide[i];
					$(classToFind).css("display","none")
				}
			}
		}
		
		//reset hidden sections
		function resetSections(){
			localStorage.removeItem("deleted-sections");
			stored = localStorage.getItem("deleted-sections");
			$(sections).css("display","block");
		}
		
		function addClosers(){
			var i = sections.length;
			while(i--){
				$(sections[i]).children("h2").append(" <a href='#' class='hide'>hide</a>");
			}
			
			$("a.hide").click(function(){
				var toRemove = $(this).parent().parent().attr("class");
				addRemovedSection(toRemove);
				return false;
			});

			
		}
		
		$(".site-sections").prepend("<a href='#' class='resetAll'>reset sections</a>");
		$("a.resetAll").click(function(){
			resetSections();
			return false;
		});

		addClosers();
		getLocallyStored();
		
	}
	else{
		return false;
	}
	
});