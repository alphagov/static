jQuery(document).ready(function() {

    $.extend( $.ui.autocomplete.prototype, {

    	_renderItem: function( ul, item) {
        return $( "<li></li>" )
          .data( "item.autocomplete", item )
          .append( $( "<a></a>" ).html( item.html || item.label ) )
          .appendTo( ul );
      }
    });
    

    //hide instructions
     $('#search_hint').hide();  
     
    //search hint
    $('#main_autocomplete').blur(
      function(){
        $('#main_autocomplete').val("I'm looking for...");
        $('#search_hint').hide();        
      }
    );

    $('#main_autocomplete').focus(
      function(){
        $('#main_autocomplete').val("");
        $('#search_hint').show();
      }
    );

    $("#main_autocomplete").autocomplete({
        delay: 0,
        source: function( request, response ) {
          $.ajax({
            url: "/search/autocomplete",
            dataType: "jsonp",
            data: {
              term: request.term
            },
            success: function( data ) {
              var highlight_term = function(string,term) {
                html_safe = html_escape(string);
                var terms = term.split(' ');
                for (var i in terms)  {
                  var clean_term = html_escape(terms[i].replace(/^\s+|\s+$/g, ''));
                  if (clean_term != "") {
                    var regex = new RegExp("("+clean_term+")","ig");
                    html_safe = html_safe.replace(regex,'<em>$1</em>');
                  }
                }
                return html_safe;
              };
              var filter = function(search_term,data) {
                return $.map(data, function(item) {
                  return {
                    label: html_escape(item.label),
                    html:  highlight_term(item.label,search_term),
                    url:   item.url + "?q=" + encodeURIComponent(item.label)
                  }
                });
              };
              var html_escape = function( string) {
                return $('<div/>').text(string).html();
              }
              var search_term = request.term;
						  last_item = {
                label: "search the site for "+html_escape(search_term),
                html:  "search the site for <em>"+html_escape(search_term)+"</em>",
                url:   "/search?q="+encodeURIComponent(search_term)
              };
              data = filter(search_term,data.slice(0,10));
              data.push(last_item);
              response( data );       
            }
          });
        },
        select: function(event, ui) {
          location.href = ui.item.url
        },
        open: function(event, ui){
          // console.debug(event);
        }
    });

});
