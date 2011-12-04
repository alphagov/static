$(function () { $('#guide-nav').tabs({ selected: 0 }); });

var myTextExtraction = function(node) {
  var the_node = $(node);
  var image = the_node.find('img');
  if (image.length > 0) {
    return image.attr('alt');
  }
  var time = the_node.find('time');
  if (time.length > 0) {
    return time.attr('datetime');
  }
  return the_node.text();
}

$(document).ready(function() {

  $('.formats').each(function (i, e) {
    var headerDetails = {};
    $(this).find('th').each(function (i, e) {
      var elem = $(this);
      if (elem.hasClass('nosort')) {
        headerDetails[i] = {'sorter': false};
      } else if (elem.hasClass('datetime')) {
        headerDetails[i] = {'sorter': 'text'}
      }
    });

    $(this).tablesorter({
      textExtraction: myTextExtraction,
      headers: headerDetails
    });
  });

  var tabbable = $('#guide-nav'),
    tab_links = tabbable.find('ul.ui-tabs-nav a');

  if ('pushState' in window.history) {
    // Define our own click handler for the tabs, overriding the default.
    tabbable.tabs({ event: 'change' }); 

    tab_links.click(function() {
      var the_element = $(this),
        state = {},
        // Get the id of this tab widget.
        id = the_element.closest( '.tabs' ).attr('id'),
        title = the_element.text(),
        anchor = the_element.attr('href'),
        // Get the index of this tab.
        idx = $(this).parent().prevAll().length;

      // Set the state!
      state[id] = idx;
      window.history.pushState(state, title, document.location.pathname + document.location.search + anchor);
      $(window).trigger('hashchange');
    });

    // Bind an event to window.onhashchange that, when the history state changes, 
    // change the current tab as necessary.
    $(window).bind('hashchange', function(e) {
      correct = tabbable.find('ul.ui-tabs-nav a[href=' + document.location.hash + ']');
      correct.triggerHandler('change');
    })

    // Since the event is only triggered when the hash changes, we need to trigger
    // the event now, to handle the hash the page may have loaded with.
    $(window).trigger('hashchange');
  } else {
    tabbable.tabs(); 
  }
});
