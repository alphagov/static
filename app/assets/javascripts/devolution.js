$(document).ready(function() {
//events

  function initDevolutionSetup() {
    if (!AlphaGeo.full_location) {
      AlphaGeo.lookup_full_location(devolutionSetup)
    } else {
      devolutionSetup()
    }
  };
  function devolutionSetup() {
    var geo_data = AlphaGeo.full_location.current_location,
    	nation_name = geo_data.nation.toLowerCase(),all_nations = ['england', 'england-wales', 'northern-ireland', 'wales', 'scotland'],
    	sections_to_hide = [];
    
    //setup expand/collapse
    $('.devolved-content .devolved-header').each(function() {
    	if ( $(this).find('a').length === 0 ){
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
    	}
    });


    if (nation_name == 'scotland'){
      sections_to_hide = ['england', 'england-wales', 'northern-ireland', 'wales'];
    }else if (nation_name == 'northern ireland'){
      sections_to_hide = ['england', 'england-wales', 'scotland', 'wales'];
    }else if (nation_name == 'england'){
      sections_to_hide = ['scotland', 'wales', 'northern-ireland'];
    }else if (nation_name == 'wales'){
      sections_to_hide = ['scotland', 'england', 'northern-ireland'];  
    }
 
 		// should we hide london?
    if(geo_data.council.length >= 1){
      if (geo_data.council[0].type != 'LBO'){
        sections_to_hide.push('london');
      }
    }
    

    //do the hiding
    $('.devolved-content').each(function(i, section) {
    	var class_names = $(section).attr("class").split(/\s+/),
    		should_hide = false,
    		j,
    		classes_length = class_names.length;

    	for (j=0; j < classes_length; j++) {
    		if ($.inArray(class_names[j], sections_to_hide) !== -1) {
    			should_hide = true;
    		}
    	}
    	if (should_hide) {
    		$(section).find('.devolved-body').hide();
    		$(section).find('.devolved-header a').text('Show this');
    	} else {
    		$(section).find('.devolved-body').show();
    		$(section).find('.devolved-header a').text('Hide this');
    	}
    });

    // for (var i=0; i < all_nations.length; i++) {
    // 	var possible_nation = all_nations[i];
    // 	if(nation_name !== current_nation) {
    //   	$('.devolved-content.' + possible_nation).find('.devolved-body').hide();
    //   	$('.devolved-content.' + possible_nation).find('.devolved-header a').text('Show this');
    // 	} else {
    // 		$('.devolved-content.' + possible_nation).find('.devolved-body').show();
    //   	$('.devolved-content.' + possible_nation).find('.devolved-header a').text('Hide this');
    // 	}
    // };

  
  
  };

  function show_all() {
  	$('.devolved-content').each(function(i, j) {
  		console.log(i, j);
  	});
  }

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

  $(AlphaGeo).bind('location-completed', function(e, location) {
    try {
      initDevolutionSetup();
    } catch (e) {
      return;
    }  
  });  
});
