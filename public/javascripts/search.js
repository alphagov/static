$(document).ready(function() {
	// this is for custom formating of results
   $.extend( $.ui.autocomplete.prototype, {
    _renderItem: function( ul, item) {
      var list = "<li></li>";
      if (item.class) {
        list = "<li class=\""+item.class+"\"></li>"
      }
			// temp until the service actually returns us a type
			else{
				list = "<li class=\"guide\"></li>"
			}
      return $( list )
        .data( "item.autocomplete", item )
        .append( $( "<a></a>" ).html( item.html || item.label ) )
        .appendTo( ul );
    }
  });
	
  $.ajax({
    url: "/javascripts/testdata.json",
    isLocal:true,
    dataType: "json",
    cache: true,
    success: function(data) {
      var results = $.map(data, function(e) {
        return { 'label': e.title, 'url': "/"+e.link, 'class': e.format }
      });
      $('#s').autocomplete({
        delay: 0,
				width:300,
        source: results, 
        select: function(event, ui) {
          location.href = ui.item.link;
        },
				open: function(event, ui){
					// all this just to move the ul to the left by an offset
					var offset = $("#s").offset(),
						leftoffset = offset.left,
						width = $("#s").width();
					
					var newLeft = (leftoffset - width);
					$(".ui-autocomplete").css("left", newLeft+"px").css("width", ((width*2)+4)+"px");
					
					// quickly add the search value to end of list
					var searchVal = $("#s").attr("value");
					$(".ui-autocomplete").append("<li class='search-site ui-state-hover'><a href='/search?q="+searchVal+"' class='ui-corner-all' tabindex='-1'>Search for <em>"+searchVal+"</em></li>")
					}
      });

			$('#main_autocomplete').autocomplete({
        delay: 0,
        source: results, 
        select: function(event, ui) {
          location.href = ui.item.url;
        }
      });

    }
		
  });
});
