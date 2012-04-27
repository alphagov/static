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

var buildHeaderDetails = function (group) {
  var headerDetails = {};
  $(group).find('th').each(function (i, e) {
    var elem = $(this);
    if (elem.hasClass('nosort')) {
      headerDetails[i] = {'sorter': false};
    } else if (elem.hasClass('datetime')) {
      headerDetails[i] = {'sorter': 'text'}
    }
  });
  return headerDetails;
}

$(function() {
  var tabbable = $('#guide-nav');
  var tab_options = {
    spinner: 'Retrieving data...',
    cache: true,
    selected: 0,
    load: function(event, ui) {
      var tab_panel = $(ui.panel);
      var headerDetails = buildHeaderDetails(tab_panel);
      tab_panel.find('table').tablesorter({ textExtraction: myTextExtraction, headers: headerDetails });
    }
  }

  tabbable.tabs(tab_options);
});
