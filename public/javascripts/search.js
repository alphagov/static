$(document).ready(function() {

  //$.extend( $.ui.autocomplete.prototype, {
  //  _renderItem: function( ul, item) {
  //    var list = "<li></li>"
  //    if (item.clazz) {
  //      list = "<li class=\""+item.clazz+"\"></li>"
  //    }
  //    return $( list )
  //      .data( "item.autocomplete", item )
  //      .append( $( "<a></a>" ).html( item.html || item.label ) )
  //      .appendTo( ul );
  //  }
  //});

  $.ajax({
    url: "/publications",
    dataType: "json",
    cache: true,
    success: function(data) {
      var results = $.map(data, function(e) {
        return { 'label': e.title, 'url': e.url }
      });
      $('#s').autocomplete({
        delay: 0,
        source: results, 
        select: function(event, ui) {
          location.href = ui.item.url;
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

  //var filter_terms = function(search_term,data) {
  //  var highlight_term = function(string,term) {
  //    html_safe = html_escape(string);
  //    var terms = term.split(' ');
  //    for (var i in terms)  {
  //      var clean_term = html_escape(terms[i].replace(/^\s+|\s+$/g, ''));
  //      if (clean_term != "") {
  //        var regex = new RegExp("\\b("+clean_term+")","ig");
  //        html_safe = html_safe.replace(regex,'<em>$1</em>');
  //      }
  //    }
  //    return html_safe;
  //  };

  //  return $.map(data, function(item) {
  //    return {
  //      label: html_escape(item.label),
  //      html:  highlight_term(item.label,search_term),
  //      url:   item.url
  //    };
  //  });
  //};

  //var html_escape = function( string) {
  //    return $('<div/>').text(string).html();
  //};
});
