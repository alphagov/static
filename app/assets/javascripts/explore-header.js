/* global $ */

// Desktop: when the Topics header button is clicked
$('#govuk-header__topics-menu-item, #govuk-header__topics-button--desktop').on('click', function(event) {
  event.stopPropagation();
  var menuLabel = $('#govuk-header__topics-button--desktop');
  if (menuLabel.parent().hasClass('menu-item-open')) {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    $('.govuk-header__backdrop').hide();
  } else {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    menuLabel.parent('li').addClass('menu-item-open');
    $('.govuk-header__backdrop').show();
  }
  $('#xpl-frame2-topics').toggle();
  $('#xpl-frame2-search').hide();
  $('#xpl-frame2-activity').hide();
});

// Desktop: when the Government activity header button is clicked
$('#govuk-header__activity-menu-item, #govuk-header__activity-button--desktop').on('click', function(event) {
  event.stopPropagation();
  var menuLabel = $('#govuk-header__activity-button--desktop');
  if (menuLabel.parent().hasClass('menu-item-open')) {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    $('.govuk-header__backdrop').hide();
  } else {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    menuLabel.parent('li').addClass('menu-item-open');
    $('.govuk-header__backdrop').show();
  }
  $('#xpl-frame2-topics').hide();
  $('#xpl-frame2-search').hide();
  $('#xpl-frame2-activity').toggle();
});

// Desktop: when the Search header button is clicked
$('#govuk-header__search-menu-item, #govuk-header__search-button--desktop').on('click', function(event) {
  event.stopPropagation();
  var menuLabel = $('#govuk-header__search-button--desktop');
  if (menuLabel.parent().hasClass('menu-item-open')) {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    $('.govuk-header__backdrop').hide();
  } else {
    menuLabel.closest('ul').children('li').removeClass('menu-item-open');
    menuLabel.parent('li').addClass('menu-item-open');
    $('.govuk-header__backdrop').show();
  }
  $('#xpl-frame2-topics').hide();
  $('#xpl-frame2-activity').hide();
  $('#xpl-frame2-search').toggle();
});




// Mobile -- button to show or hide the menu
document.getElementById('govuk-header__menu-button').addEventListener('click', function(event) {

  // change the button itself
  event.target.classList.toggle('govuk-header__menu-button--open');
  event.target.innerText = event.target.classList.contains('govuk-header__menu-button--open') ? '×' : 'Menu';

  // show or hide the dropdown
  $('.govuk-header #xpl-popup-menu').toggle();

  if ($('#govuk-header__search-button').hasClass('govuk-header__menu-button--open')) {
    // hide the search popup
    $('#govuk-header__search-button').removeClass('govuk-header__menu-button--open');
    $('#govuk-header__search-button').text('Search');
    $('#xpl-popup-search').hide();
  } else {
    // hide or show the rest of the page
    $('.govuk-header').nextAll().toggle();
  }
});


// Mobile -- button to show or hide the search panel
document.getElementById('govuk-header__search-button').addEventListener('click', function(event) {
  // change the button itself
  event.target.classList.toggle('govuk-header__menu-button--open');
  event.target.innerText = event.target.classList.contains('govuk-header__menu-button--open') ? '×' : 'Search';

  // show or hide the dropdown
  $('.govuk-header #xpl-popup-search').toggle();

  // hide or show the rest of the page
  $('.govuk-header').prevAll().toggle();

  if ($('#govuk-header__menu-button').hasClass('govuk-header__menu-button--open')) {
    $('#govuk-header__menu-button').removeClass('govuk-header__menu-button--open');
    $('#govuk-header__menu-button').text('Menu');
    $('#xpl-popup-menu').hide();
  } else {
    $('.govuk-header').nextAll().toggle();
  }
});


$('.govuk-header__backdrop').on('click', function() {
  $(this).hide();
  $('.xpl-frame2').hide();
  $('#navigation-desktop li').removeClass('menu-item-open');
});


document.addEventListener('DOMContentLoaded', function() {
  $('#govuk-header__topics-button--desktop').replaceWith('<button id="govuk-header__topics-button--desktop" class="govuk-header__menu-button">Topics</button>');
  $('#govuk-header__activity-button--desktop').replaceWith('<button id="govuk-header__activity-button--desktop" class="govuk-header__menu-button">Government activity</button>');
  $('#govuk-header__search-button--desktop').replaceWith('<button id="govuk-header__search-button--desktop" class="govuk-header__menu-button govuk-header__search-button">Search</button>');
});
