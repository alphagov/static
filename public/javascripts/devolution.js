$(document).ready(function() {
//events


	function devolutionSetup() {
	geo_data = AlphaGeo.readAndParseJSONCookie('geo');
	var nation_name = geo_data.nation.toLowerCase();
	//which countries should we hide?
	hide_nations = [];
	if (nation_name == 'scotland'){
		hide_nations = ['england', 'england-wales', 'northern-ireland', 'wales'];
	}else if (nation_name == 'northern ireland'){
		hide_nations = ['england', 'england-wales', 'scotland', 'wales'];
	}else if (nation_name == 'england'){
		hide_nations = ['scotland', 'wales', 'northern-ireland'];
	}else if (nation_name == 'wales'){
		hide_nations = ['scotland', 'england', 'northern-ireland'];	
	}
	//should we hide london?
	if(geo_data.council.length >= 1){
		if (geo_data.council[0].type != 'LBO'){
			hide_nations.push('london');
		}
	}
	//setup expand/collapse
	$('.devolved-content .devolved-header').each(function() {
		//create an expand/contract link
		var expand_link = $('<a/>');
		expand_link.attr('href', '#');
		expand_link.text('Hide this');
		//setup click event
		expand_link.click(
			function(){
				toggle_section($(this).parent().parent());
				return false;
			}
		);
		//append to seciton
		$(this).append(expand_link);
	});

	//do the hiding
	// $('.devolved-header a').text('[Hide this]');
	for (var i=0; i < hide_nations.length; i++) {
		$('.devolved-content.' + hide_nations[i]).find('.devolved-body').hide();
		$('.devolved-content.' + hide_nations[i]).find('.devolved-header a').text('Show this');
	};
	
	};
	//toggle
	function toggle_section(section){
		if(section.find('.devolved-body').is(':visible')){
			hide_section(section);
		}else{
			show_section(section);
		}
	};
	
	//show
	function show_section(section){
		section.find('.devolved-body').show();
		section.find('.devolved-header a').text('Hide this');
	}
	//hide
	function hide_section(section){
		section.find('.devolved-body').hide();
		section.find('.devolved-header a').text('Show this');
	}	
	$(document).bind('location-changed', function(e, data) {
	  try {
	    devolutionSetup();
	  } catch (e) {
	    return;
	  }
		
	});
	if($('.found_location').css("display") == "block"){
	  try {
	    devolutionSetup();
	  } catch (e) {
	    return;
	  }
		
	}
});