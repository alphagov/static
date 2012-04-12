var Devolution = {
	initDevolutionSetup: function(AlphaGeo) {
    if (!AlphaGeo.full_location) {
      AlphaGeo.lookup_full_location(function() { Devolution.openAndCloseSectionsByLocation(AlphaGeo.full_location.current_location) })
    } else {
      Devolution.openAndCloseSectionsByLocation(AlphaGeo.full_location.current_location)
    }
  },
  addHideThisLinks: function(){
    $('.devolved-content .devolved-header').each(function() {
      if ( $(this).find('a').length === 0 ){
        //create an expand/contract link
        var expand_link = $('<a/>');
        expand_link.attr('href', '#');
        expand_link.text('Hide this');
        //setup click event
        expand_link.click(
          function(){
            Devolution.toggle_section($(this).parent().parent());
            return false;
          }
        );
        //append to seciton
        $(this).append(expand_link);
      }
    });
  },
  openAndCloseSectionsByLocation: function(geo_data) {
  	var nation_name = geo_data.nation.toLowerCase(),
      all_nations = ['england', 'england-wales', 'northern-ireland', 'wales', 'scotland'],
  		sections_to_hide = [];
  
	  


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
	},
  //toggle
  toggle_section: function(section){
    if(section.find('.devolved-body').is(':visible')){
      Devolution.hide_section(section);
    }else{
      Devolution.show_section(section);
    }
  },

  //show
  show_section: function(section){
    section.find('.devolved-body').show();
    section.find('.devolved-header a').text('Hide this');
  },
  //hide
  hide_section: function(section){
    section.find('.devolved-body').hide();
    section.find('.devolved-header a').text('Show this');
  }  

};

$(document).ready(function() {
//events

  $(AlphaGeo).bind('location-completed', function(e, location) {
    try {
      Devolution.initDevolutionSetup(AlphaGeo);
    } catch (e) {
      return;
    }  
  });
  Devolution.addHideThisLinks();  
});
