$(document).ready(function() {
  // this is for custom formating of results
  $.extend( $.ui.autocomplete.prototype, {

    _renderItem: function( ul, item) {
      var list = "<li></li>";
      return $( list )
        .data( "item.autocomplete", item )
        .append( $( "<a href='"+item['url']+"'></a>" ).html( item.html || item.label ) )
        .appendTo( ul );
    }
  });

  var searchUrl = function(pathSuffix) {
    var url = $("form[role=search]").attr("action") ? $("form[role=search]").attr("action") : '/search';
    if (pathSuffix !== undefined) {
      url = url.replace(/search$/, pathSuffix);
    }
    return url;
  };

  function transformPreloadedSearchData(data) {
    var result = [];
    var item = function(e) {
      return {
        'label': e.title, 'url': e.link, 'html_class': e.format, 'keywords': e.keywords, 'weight': e.weight
      };
    };

    if (data && data[0] && data[0].link && data[0].title && data[0].format) {
      for (var x = 0; x < data.length; x++) {
        result.push(item(data[x]));
      }
    }

    return result;
  }

  function preloadedSearchData() {
    if(typeof(GDS.search_top_trumps) == 'undefined') {
      return [];
    } else if(typeof(GDS.transformed_preloaded_search_data) == 'undefined') {
      GDS.transformed_preloaded_search_data = transformPreloadedSearchData(GDS.search_top_trumps);
    }
    return GDS.transformed_preloaded_search_data;
  }

  var score_document = function(search_query, doc){
    var terms = $.map(search_query.split(' '), function(term) {
      if(term) return term;
    });
    var doc_score = 0;

    $.each(terms, function(index, term){
      var regex = new RegExp("\\b("+term+")","ig");

      if (doc.keywords.match(regex)) {
        doc_score ++;
      }
    });

    return doc_score * doc.weight;
  };

  var uniqueDocuments = function(scored_documents){
    var found = {};

    return $.map(scored_documents, function(scored_document){
      if(!found[scored_document.doc.url]){
        found[scored_document.doc.url] = 1;
        return scored_document;
      }
    });
  };

  var filter_terms = function(search_query, data){
    var scored_docs = $.map(data, function(doc){
      var score = score_document(search_query, doc);

      if(score != 0) return { score: score, doc: doc };
    });

    var sorted_docs = scored_docs.sort(function(a,b){
      if(a.score < b.score) {
        return 1;
      } else if(a.score > b.score) {
        return -1;
      } else {
        return 0;
      }
    });

    return $.map(uniqueDocuments(sorted_docs).slice(0, 5), function(data) {
      return data.doc;
    });
  };

 /* Smoke and mirrors search hint */

  function hintPlaceholder(element) {
    if($(".hint-suggest").length == 0) {
      if (element.attr('id') == 'main_autocomplete') {
        $("#search_hint").after("<span class='hint-suggest'><em>Type for suggestions</em></span>");
        $("#search_hint").addClass("visuallyhidden");
      }
      else {
        var attachPoint = element.parent("fieldset");
        attachPoint.append("<span class='hint-suggest'><em>Type for suggestions</em></span>");
      }
    }
    return $('.hint-suggest');
  }


  var results_found = -1;

  $("#main_autocomplete, #site-search-text").live("focus", function(){
    hintPlaceholder($(this)).text('Type for suggestions');
  });

	$("#site-search-text, #main_autocomplete").live("blur", function(){
	  $(".hint-suggest").remove();
	  $("#search_hint").removeClass("visuallyhidden");
	});

  $("#site-search-text, #main_autocomplete").keydown( function() {
    $(this).autocomplete( "option", "delay", 0);

    if ($(".ui-autocomplete-input").attr("value").length == 0) {
      $(".hint-suggest").remove();
      $("#search_hint").removeClass("visuallyhidden");
    }
  });

  initAutoComplete();

  function shouldUseCitizenPreloadedSearchData() {
    return (window.location.pathname.match(/^\/government|specialist/) == null)
  }

  function initAutoComplete(){
    var autocompleteOptions = {
      delay: 100,
      width: 300,
      appendTo: 'form#search',
      source: function(req, add){
        var hint = hintPlaceholder(this.element);
        if (shouldUseCitizenPreloadedSearchData()) {
          add(filter_terms(req.term, preloadedSearchData()));
        } else {
          if (req.term.length >= 3) {
            results_found = 0;
            $.ajax({
              url: searchUrl("autocomplete") + ".json?q=" + req.term,
              dataType: "json",
              cache: true,
              beforeSend: function(xhr) {
                hint.text("Loading...");
                hint.addClass("search-loading");
              },
              success: function(data) {
                var results = $.map(data, function(e) {
                  return { 'label': e.title, 'url': e.link, 'class': e.format };
                });
                results_found = results.length;
                add(results);
              },
              complete: function(jqXHR, textstatus){
                hint.removeClass("search-loading");
                if (textstatus != 'success' || results_found == 0) {
                  $(".hint-suggest").remove();
                  $("#search_hint").removeClass("visuallyhidden");
                }
              }
            });
          }
        }
      },
      select: function(event, ui) {
        // add in Google Analytics tracking
        if ( _gat && _gat._getTracker ) {
          _gaq.push(['_trackEvent', 'GOV.UK_search_autocomplete', ui.item.label, ui.item.url]);
        }
        location.href = ui.item.url;
      },
      open: function(event, ui){
        // quickly add the search value to end of list
        var searchVal = $(".ui-autocomplete-input").attr("value");
        $(".ui-autocomplete").append("<li class='search-site ui-state-hover'><a href='"+searchUrl()+"?q="+searchVal+"' class='ui-corner-all' tabindex='-1'>Search for <em>"+searchVal+"</em></li>");
        $("#search_hint").addClass('visuallyhidden');
      },
      close: function(event, ui){
        if ($(".ui-autocomplete-input").attr("value").length == 0) {
          $(".hint-suggest").remove();
          $("#search_hint").removeClass("visuallyhidden");
        }
      }
    };
    $("#main_autocomplete").autocomplete($.extend(autocompleteOptions, {
      position: {
        my: "left top",
        at: "left bottom"
      }
    }));
    $("#site-search-text").autocomplete($.extend(autocompleteOptions, {
      position: {
        my: "right top",
        at: "right bottom"
      }
    }));
  }
});

/*
* New Search Design
*/

function initSearchFilter() {
  // if this is NOT a section page - probably a better way to do this
  if ($('.section-page').length < 1) {
    $('.search .filters').on('click', 'a', function(e) {
      e.preventDefault();
      var $li = $(this).parent();

      $('.active').not($li).removeClass('active');
      $li.toggleClass('active');

      filterResults();
    });
  }
}

function filterResults() {
  var $results = $('.results-list');

  $results.find('.filtered').removeClass('filtered');
  $results.parents('.results-block').show();

  var filter = '';
  $('.search .filters').find('.active').each(function() {
    /* if (filter != '') filter += ', '; */
    filter += '.'+$(this).data('filter');
  });

  if (filter == '') filter = '*';
  $results.children('li').not(filter).addClass('filtered');

  $results.each(function(i, el){
    if($(el).find(':visible').length === 0){
      $(el).parents('.results-block').hide();
    }
  });
}

$(document).ready(function() {
  initSearchFilter();
});

