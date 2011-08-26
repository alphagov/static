$(function(){
	$('body').addClass("js-enabled");
	$('#wrapper').tabs();
	
	/* step link prompts */
	
	/* get all the sections */
	var sections = $(".tabs-panel"),
		i = sections.length,
		j, 
		id;
		
	while(i--){
		var j = i+1,
		nav = $("<nav class='part-pagination' role='navigation'></nav>"),
		ul = $("<ul></ul>"),
		id = $(sections[j]).attr("id");
		sectionTitle = $("#"+id+" h1").html();
		if(sectionTitle != undefined){
			sectionTitle = sectionTitle.toLowerCase();
			//var sectionTitle = $(this).next("h1").html();
			switch(i){
				case 3: //last step
					return false;
					break;
					case 2://eligibility
					ul.append("<li><a href='#"+id+"'>Read about "+sectionTitle+"</a></li>")
					break;
				case 1://what you'll get
					ul.append("<li><a href='#"+id+"'>Read about "+sectionTitle+"</a></li><li><a href='#'>No thanks, just tell me how to claim</a></li>")
					break;
				case 0://overview
					ul.append("<li><a href='#"+id+"'>Read about "+sectionTitle+"</a></li><li><a href='#'>No thanks, just tell me how to claim</a></li>")
					break;
				}
				nav.append(ul);
				$(sections[i]).find(".inner").append(nav);
			}
		}
	
});