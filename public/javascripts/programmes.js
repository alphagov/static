$(function(){
	$('body').addClass("js-enabled");
	$('#wrapper').tabs();
	
	/* step link prompts */
	
	/* get all the sections */
	var sections = $(".tabs-panel"),
		i = sections.length,
		last = $(".tabs-panel:last").attr("id").split("-enhanced")[0],
		j, 
		id,
		ul,
		sectionTitle,
		nav;
		
		last = "<li><a href='#"+last+"'>No thanks, just tell me how to claim</a></li>"
		
	while(i--){
		j = i+1;
		nav = $("<nav class='part-pagination group' role='navigation'></nav>");
		ul = $("<ul></ul>");
		id = $(sections[j]).attr("id");
		sectionTitle = $("#"+id+" h1").html();

		if(sectionTitle != undefined){
			sectionTitle = sectionTitle.toLowerCase();
			id = id.split("-enhanced")[0];
			var next = ("<li><a href='#"+id+"'>Read about "+sectionTitle+" &rarr;<span class='progressor'></span></a></li>")
			if(i == 2){
				ul.append(next)
			}
			else{
				ul.append(next+last)
			}
			
			nav.append(ul);
			$(sections[i]).find(".inner").append(nav);
		}
	}
	
	
	

/* MOVE THIS OUT TO OWN SCRIPT FILE */
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
			var toHide = stored.split(',');
			var i = toHide.length;
			while(i--){
				$("."+toHide[i]).css("display","none")
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
				$(sections[i]).append("<a href='#' class='hide'>hide</a>");
			}
			
			$("a.hide").click(function(){
				var toRemove = $(this).parent().attr("class");
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
		addRemovedSection("section-taxes");
		getLocallyStored();
		
	}
	
	
});