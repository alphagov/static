/**
 * --------------------------------------------------------------------
 * jQuery tabs plugin
 * Author: Scott Jehl, scott@filamentgroup.com
 * Copyright (c) 2009 Filament Group 
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
 */

/*
 * Edited to support GOV.UK markup and add acccessibility features
*/

jQuery.fn.tabs = function(settings){
	//configurable options
	var o = $.extend({
		trackState: true, //track tabs in history, url hash, back button, page load
		srcPath: 'jQuery.history.blank.html',
		autoRotate: false,
		alwaysScrollToTop: true,
		selected: null,
		wrapperTag : 'section'
	},settings);

	var isMobile = false,
	    checkMobile = function ($tabsNav) {
            var $navContainer = $tabsNav.closest('nav');

            if ($navContainer.hasClass('programme-progression')) {
                if ($tabsNav.closest('nav').css('float') === 'none') {
                    return true;
                }
            } else { // is transaction start page tabs
                if ($tabsNav.find('li').css('float') === 'none') {
                    return true;
                }
            }

            return false;
        };

    var setTabItems = function ($tabsBody, $tabsNav) {
        if (isMobile) {
            return $tabsBody.find('header.js-heading-tab');
        }

        return $tabsNav.find('li');
    };

	var adapt = function ($tabs, $tabsNav, $tabsBody) {
        var $tabItems = $tabsNav.find('li'),
            $container = $tabsNav.closest('nav').parent(),
            $relatedArticle, 
            $articleHeading,
            $articleInner;

        $.each($tabItems, function (idx) {
            var $tabAnchor = $(this).find('a'),
                tabId = $tabAnchor.attr('href').split('#')[1],
                headingId = tabId + '-heading',
                $shiftLink = $('<a href="#' + headingId  + '" class="tab-shiftlink">Jump back a section ↑</a>');

            // make the shiftLink scroll the page without affecting the URL hash
            $shiftLink.on('click', function (e) {
                $(window).scrollTop($('#' + tabId).offset().top);

                return false;
            });

            $relatedArticle = $container.find('#' + tabId);

            // get heading & store
            $articleHeading = $relatedArticle.find('header');

            if (!$articleHeading.length) {
                $articleHeading = $('<header><h1 /></header>');
            } else {
                $articleHeading = $articleHeading.remove();
            }

            $articleHeading
                .addClass('js-heading-tab')
                .removeClass('visuallyhidden')
                .attr('id', headingId);

            $articleHeading.children().html('').append($tabAnchor);

            // get div.inner
            $articleInner = $relatedArticle.find('.inner');

            // if article has no inner div, add one & move the content into it
            if (!$articleInner.length) {
                $articleInner = $('<div class="inner js-tab-pane" />').html($relatedArticle.html());
            } else {
                $articleInner.addClass('js-tab-pane');
            }

            $articleInner.attr('id', tabId);

            // create a new blank article with the original's inner div
            $relatedArticle.replaceWith($('<' + o.wrapperTag  + ' />').append($articleInner));
            $relatedArticle = $articleInner.parent();
            $relatedArticle.prepend($articleHeading);
            $relatedArticle.addClass('js-tab-container');
            $articleInner.append($shiftLink);
        });

        $tabsNav.closest('nav').remove();
    };
	
	return $(this).each(function(){
		//reference to tabs container
		var tabs = $(this);

		//set app mode
		//if( !$('body').is('[role]') ){ $('body').attr('role','application'); }
		
		//nav is first ul or ol
		var tabsNav = tabs.find('.js-tabs ul, .js-tabs ol');
		
		//body is nav's next sibling
		var tabsBody = $(".js-tab-content");

		var tabIDprefix = 'tab-';

		var tabIDsuffix = '-enhanced';

		tabsBody
			.addClass('tabs-body')
			.attr('aria-live', 'polite');

        // check for mobile and adapt DOM if required
        isMobile = checkMobile(tabsNav);        
        if (isMobile) {
            adapt(tabs, tabsNav);
        } else {
            //add class to nav, tab body
            tabsNav
                .addClass('tabs-nav')
                .attr('role','tablist');
	    }
		
		//find tab panels, add class and aria
		tabsBody.find('.js-tab-pane').each(function(){
			$(this)
				.addClass('tabs-panel')
				.attr('role','tabpanel')
				.attr('aria-hidden', true)
				.attr('aria-expanded', false)
				.attr('aria-labelledby', tabIDprefix + $(this).attr('id'))
				.attr('id', $(this).attr('id') + tabIDsuffix)
				.hide();
		});
		
        var tabItems = setTabItems(tabsBody, tabsNav);

		//set role of each tab
		tabItems.find('a').each(function(idx){
		    var id = $(this).attr('href').split('#')[1];

			$(this)
				.attr('role','tab')
				.attr('id', tabIDprefix + id)
				.attr('aria-controls', id)
				.attr('aria-flowto', id);
		});

		//switch selected on click
        // tabItems.find('a').attr('tabindex','-1');
		
		//generic select tab function
		function selectTab(tab,fromHashChange){
			if(o.trackState && !fromHashChange){
				var anchor = tab.attr('href').split('#')[1];
				$.historyLoad(anchor);
			} else {
				//unselect tabs
				tabItems.find('a')
					.attr('aria-selected', false)
					.attr('tabindex', -1);
                if (isMobile) {
                    tabItems.find('a').closest('.js-heading-tab').removeClass('active');
                } else {
					tabItems.find('a').parent().filter('.active').removeClass('active');
                }
				//set selected tab item
				tab
					.attr('aria-selected', true)
					.attr('tabindex', 0);
                if (isMobile) {
                    tab.closest('.js-heading-tab').addClass('active');
                } else {
					tab.parent().addClass('active');
                }
				//unselect panels
				tabsBody.find('.tabs-panel-selected')
					.attr('aria-hidden',true)
					.attr('aria-expanded', false)
					.removeClass('tabs-panel-selected')
					.hide();
					
				//select active panel
				var anchor = tab.attr('href').split('#')[1];

				$( "#" + anchor + tabIDsuffix )
					.addClass('tabs-panel-selected')
					.attr('aria-hidden',false)
					.attr('aria-expanded', true)
					.show();

				// set selected index
				o.selected = tabItems.find('a').index(tab);
			}
		}

		// keyboard navigation
		tabs.on('keydown', function(event) {
			if (event.keyCode < $.ui.keyCode.PAGE_UP || event.keyCode > $.ui.keyCode.DOWN)
				return;

			var selectedIndex,
			    selectedTabItem;

			switch (event.keyCode) {
				case $.ui.keyCode.RIGHT:
				event.preventDefault();
				selectedIndex = o.selected + 1;
				break;
				case $.ui.keyCode.DOWN:
				selectedIndex = o.selected + 1;
				break;
				case $.ui.keyCode.UP:
				selectedIndex = o.selected - 1;
				break;
				case $.ui.keyCode.LEFT:
				selectedIndex = o.selected - 1;
				break;
				case $.ui.keyCode.END:
				selectedIndex = that.anchors.length - 1;
				break;
				case $.ui.keyCode.HOME:
				selectedIndex = 0;
				break;
				case $.ui.keyCode.PAGE_UP:
				if (!event.ctrlKey)
					return;
				selectedIndex = o.selected + 1;
				break;
				case $.ui.keyCode.PAGE_DOWN:
				if (!event.ctrlKey)
					return;
				selectedIndex = o.selected + 1;
				if (!event.ctrlKey)
					return;
				selectedIndex = o.selected - 1;
				break;
			}
			event.preventDefault();
			event.stopPropagation();

			if (selectedIndex !== undefined) {
				selectedIndex = selectedIndex >= tabItems.length ? 0 : selectedIndex < 0 ? tabItems.length - 1 : selectedIndex;
                
                selectedTabItem = tabItems.find('a').eq(selectedIndex);
				selectTab(selectedTabItem);
			    selectedTabItem.focus();
			}

			return false;
		});

		//if tabs are rotating, stop them upon user events	
		tabs.bind('click keydown focus',function(){
			if(o.autoRotate){ clearInterval(tabRotator); }
		});
		
		//function to select a tab from the url hash
		function selectTabFromHash(hash){
			var currHash = hash || window.location.hash;
			if(currHash.indexOf("#") == 0){
              currHash = currHash.split("#")[1];
            }
			var hashedTab = tabItems.find('a[href$=#' +  currHash + ']');

            if(hashedTab.size() > 0){
                selectTab(hashedTab,true);
            }
            else {
                selectTab( tabItems.find('a').eq(0), true);
            }
            //return true/false
            return !!hashedTab.size();
		}
		
		//if state tracking is enabled, set up the callback
		if(o.trackState){ $.historyInit(selectTabFromHash, o.srcPath); }

		//set tab from hash at page load, if no tab hash, select first tab
		selectTabFromHash(null, true);
		
		tabItems.on('click', 'a', function(){
			selectTab($(this));
			$(this).focus();
			return false;
		}).on('focus', 'a', function() {
			o.selected = tabItems.find('a').index($(this));
		});
		
		if(o.alwaysScrollToTop){
			$(window)[0].scrollTo(0,0);
		}
	});
};
