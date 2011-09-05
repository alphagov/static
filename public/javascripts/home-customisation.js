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
			if(stored == ""){
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
        if(stored != ""){
            var toHide = stored.split(',');
            var i = toHide.length;
            while(i--){
                if (toHide[i] && toHide[i] != '') {
                    var classToFind = "."+toHide[i];
                    $(classToFind).addClass("hidden")                        
                }

            }
        }
        else return false;
    }

    //reset hidden sections
    function resetSections(){
        localStorage.removeItem("deleted-sections");
        stored = "";
        $(sections).removeClass("hidden");
    }
		
		function addClosers(){
			var i = sections.length;
			while(i--){
				$(sections[i]).children("h2").after("<div class='edit-control'><a href='#' class='hide'>hide this</a></div>");
			}
			
			$("a.hide").click(function(){
				var toRemove = $(this).parent().parent().attr("class");
				addRemovedSection(toRemove);
				return false;
			});

			
		}
		
		$(".site-sections").append("<div class='edit-control'><a href='#' class='resetAll'>show hidden sections</a></div>");
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