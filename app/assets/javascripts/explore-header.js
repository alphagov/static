/* global $ */

// Desktop: when the Topics header button is clicked
$('#xpl-topics-menu-item, #xpl-topics-button-desktop').on('click', function(event) {
  event.stopPropagation();
  var menuLabel = $('#xpl-topics-button-desktop');
  if (menuLabel.parent().hasClass('menu-item-open')) {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    $('.xpl-backdrop').hide();
  } else {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    menuLabel.parent('li').addClass('menu-item-open');
    $('.xpl-backdrop').show();
  }
  $('#xpl-frame2-topics').toggle();
  $('#xpl-frame2-search').hide();
  $('#xpl-frame2-activity').hide();
});

// Desktop: when the Government activity header button is clicked
$('#xpl-activity-menu-item, #xpl-activity-button-desktop').on('click', function(event) {
  event.stopPropagation();
  var menuLabel = $('#xpl-activity-button-desktop');
  if (menuLabel.parent().hasClass('menu-item-open')) {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    $('.xpl-backdrop').hide();
  } else {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    menuLabel.parent('li').addClass('menu-item-open');
    $('.xpl-backdrop').show();
  }
  $('#xpl-frame2-topics').hide();
  $('#xpl-frame2-search').hide();
  $('#xpl-frame2-activity').toggle();
});

// Desktop: when the Search header button is clicked
$('#xpl-search-menu-item, #xpl-search-button-desktop').on('click', function(event) {
  event.stopPropagation();
  var menuLabel = $('#xpl-search-button-desktop');
  if (menuLabel.parent().hasClass('menu-item-open')) {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    $('.xpl-backdrop').hide();
  } else {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    menuLabel.parent('li').addClass('menu-item-open');
    $('.xpl-backdrop').show();
  }
  $('#xpl-frame2-topics').hide();
  $('#xpl-frame2-activity').hide();
  $('#xpl-frame2-search').toggle();
});




// Mobile -- button to show or hide the menu
document.getElementById('xpl-menu-button').addEventListener('click', function(event) {

  // change the button itself
  event.target.classList.toggle('govuk-header__menu-button--open');
  event.target.innerText = event.target.classList.contains('govuk-header__menu-button--open') ? '×' : 'Menu';

  // show or hide the dropdown
  $('.govuk-header #xpl-popup-menu').toggle();

  if ($('#xpl-search-button').hasClass('govuk-header__menu-button--open')) {
    // hide the search popup
    $('#xpl-search-button').removeClass('govuk-header__menu-button--open');
    $('#xpl-search-button').text('Search');
    $('#xpl-popup-search').hide();
  } else {
    // hide or show the rest of the page
    $('.govuk-header').nextAll().toggle();
  }
});


// Mobile -- button to show or hide the search panel
document.getElementById('xpl-search-button').addEventListener('click', function(event) {
  // change the button itself
  event.target.classList.toggle('govuk-header__menu-button--open');
  event.target.innerText = event.target.classList.contains('govuk-header__menu-button--open') ? '×' : 'Search';

  // show or hide the dropdown
  $('.govuk-header #xpl-popup-search').toggle();

  // hide or show the rest of the page
  $('.govuk-header').prevAll().toggle();

  if ($('#xpl-menu-button').hasClass('govuk-header__menu-button--open')) {
    $('#xpl-menu-button').removeClass('govuk-header__menu-button--open');
    $('#xpl-menu-button').text('Menu');
    $('#xpl-popup-menu').hide();
  } else {
    $('.govuk-header').nextAll().toggle();
  }
});


$('.xpl-backdrop').on('click', function() {
  $(this).hide();
  $('.xpl-frame2').hide();
  $('#navigation-desktop li').removeClass('menu-item-open');
});


document.addEventListener('DOMContentLoaded', function() {
  $('#xpl-topics-button-desktop').replaceWith('<button id="xpl-topics-button-desktop" class="xpl-menu__button">Topics</button>');
  $('#xpl-activity-button-desktop').replaceWith('<button id="xpl-activity-button-desktop" class="xpl-menu__button">Government activity</button>');
  $('#xpl-search-button-desktop').replaceWith('<button id="xpl-search-button-desktop" class="xpl-menu__button xpl-search-button">Search</button>');
});
