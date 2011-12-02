$(document).ready(function() {
	// this is for custom formating of results
   $.extend( $.ui.autocomplete.prototype, {
 
    _renderItem: function( ul, item) {
      var list = "<li></li>";
      if (item['class']) {
        list = "<li class=\""+item['class']+"\"></li>";
      }
			// temp until the service actually returns us a type
			else{
				list = "<li class=\"guide\"></li>";
			}
      return $( list )
        .data( "item.autocomplete", item )
        .append( $( "<a href='"+item['url']+"'></a>" ).html( item.html || item.label ) )
        .appendTo( ul );
    }
  });
	
  $("#site-search-text").autocomplete({ 
    delay: 300,
    width: 300, 
    source: function(req, add){  
      $.ajax({
        url: "/autocomplete?q="+req.term,
        dataType: "json",
        cache: true,
        success: function(data) {
          var results = $.map(data, function(e) {
            return { 'label': e.title, 'url': e.link, 'class': e.format };
          });
          add(results)
        }
      });
    },  
    select: function(event, ui) {
      location.href = ui.item.url;
    },
    open: function(event, ui){
      // all this just to move the ul to the left by an offset
      var offset = $("#site-search-text").offset(),
      leftoffset = offset.left,
      width = $("#site-search-text").width();

      var newLeft = (leftoffset - width);
      $(".ui-autocomplete").css("left", newLeft+"px").css("width", ((width*2)+4)+"px");

      // quickly add the search value to end of list
      var searchVal = $("#site-search-text").attr("value");
      $(".ui-autocomplete").append("<li class='search-site ui-state-hover'><a href='/search?q="+searchVal+"' class='ui-corner-all' tabindex='-1'>Search for <em>"+searchVal+"</em></li>");
    } 
  });
  
});
