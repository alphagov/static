$(function(){
	$('body').addClass("js-enabled");
	$('#wrapper').tabs();
	
	/* step link prompts */
	
	/* get all the sections */
	var sections = $(".tabs-panel"),
		i = sections.length,
		last = $(".tabs-panel:last").attr("id").split("-enhanced")[0],
		j, 
		id;
		
		last = "<li><a href='#"+last+"'>No thanks, just tell me how to claim</a></li>"
		
	while(i--){
		var j = i+1,
		nav = $("<nav class='part-pagination group' role='navigation'></nav>"),
		ul = $("<ul></ul>"),
		id = $(sections[j]).attr("id"),
		sectionTitle = $("#"+id+" h1").html();

		if(sectionTitle != undefined){
			sectionTitle = sectionTitle.toLowerCase();
			id = id.split("-enhanced")[0];
			var next = ("<li><a href='#"+id+"'>Read about "+sectionTitle+" &rarr;<span class='progressor'></span></a></li>")
			switch(i){
				case 3: //last step
					return false;
					break;
				case 2://eligibility
					ul.append(next)
					break;
				case 1://what you'll get
				case 0://overview
					ul.append(next+last)
					break;
				}
				nav.append(ul);
				$(sections[i]).find(".inner").append(nav);
			}
		}
	
});