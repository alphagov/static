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
		mobileHeadingTag: 'h1'
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

    var getTabFromHash = function ($tabItems, hash) {
        var $hashTab;

        if (isMobile) {
            $tabItems.children().each(function (idx) {
                if ($(this).data('fragment') === hash) {
                    $hashTab = $(this);
                    return false;
                } 
            });
        } else {
            $hashTab = $tabItems.find('a[href$=#'+ hash +']');
        }

        return $hashTab
    }

    var getHashFromTab = function ($tab) {
        if (isMobile) {
            return $tab.data('fragment');
        } else {
            return $tab.attr('href').split('#')[1];
        }
    }

    var setTabItems = function ($tabsBody, $tabsNav) {
        if (isMobile) {
            return $tabsBody.find('header.js-heading-tab');
        }

        return $tabsNav.find('li');
    };

	var adapt = function ($tabs, $tabsNav, $tabsBody) {
        var $tabItems = $tabsNav.find('li'),
            $container = $tabsNav.closest('nav').parent(),
            tabIds = [],
            $relatedArticle, 
            $articleHeading,
            $articleInner;

        $.each($tabItems, function (idx) {
            var headingId = 'heading-tab-' + (idx + 1),
                tabId = $(this).find('a').attr('href').split('#')[1],
                $shiftLink = $('<a href="#' + headingId  + '" class="tab-shiftlink">Jump back a section ↑</a>');

            // make the shiftLink scroll the page without affecting the URL hash
            $shiftLink.on('click', function (e) {
                $(window).scrollTop($('#' + tabId).offset().top);

                return false;
            });

            $relatedArticle = $container.find('#' + tabId);
            $articleHeading = $relatedArticle.find('header');
            $articleHeading
                .addClass('js-heading-tab')
                .attr('id', headingId)
            $articleHeading = $articleHeading.remove();
            $articleHeading.children()
                                .data('fragment', tabId);
            $articleInner = $relatedArticle.find('.inner').attr('id', tabId);

            // if article has no inner div, add one & move the content into it
            if (!$articleInner.length) {
                $articleInner = $('<div class="inner js-tab-pane" />').html($relatedArticle.html());
            } else {
                $articleInner.addClass('js-tab-pane');
            }

            // create a new blank article with the original's inner div
            $relatedArticle.replaceWith($('<article />').append($articleInner));
            $relatedArticle = $articleInner.parent();
            $relatedArticle.prepend($articleHeading);
            $relatedArticle.addClass('js-tab-container');
            $articleInner.append($shiftLink);

            tabIds.push(tabId);
        });

        $tabsNav.closest('nav').remove();

        return tabIds;
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
            var tabIds = adapt(tabs, tabsNav);
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
		tabItems.children().each(function(idx){
		    var id;

		    if (isMobile) {
		        id = tabIds[idx]; 
            } else {
                id = $(this).attr('href').split('#')[1];
            }

			$(this)
				.attr('role','tab')
				.attr('id', tabIDprefix+id)
				.attr('aria-controls', id)
				.attr('aria-flowto', id);
		});

		//switch selected on click
        // tabItems.find('a').attr('tabindex','-1');
		
		//generic select tab function
		function selectTab(tab,fromHashChange){
			if(o.trackState && !fromHashChange){
				var anchor = getHashFromTab(tab);
				$.historyLoad(anchor);
			} else {
				//unselect tabs
				tabItems.children()
					.attr('aria-selected', false)
					.attr('tabindex', -1)
					.parent().filter('.active').removeClass('active');
				//set selected tab item
				tab
					.attr('aria-selected', true)
					.attr('tabindex', 0)
					.parent().addClass('active');
				//unselect panels
				tabsBody.find('.tabs-panel-selected')
					.attr('aria-hidden',true)
					.attr('aria-expanded', false)
					.removeClass('tabs-panel-selected')
					.hide();
					
				//select active panel
				var anchor = getHashFromTab(tab);
				$( "#" + anchor + tabIDsuffix )
					.addClass('tabs-panel-selected')
					.attr('aria-hidden',false)
					.attr('aria-expanded', true)
					.show();

				// set selected index
				o.selected = tabItems.index(tab.parent());
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
                
                selectedTabItem = tabItems.children().eq(selectedIndex);
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
			var hashedTab = getTabFromHash(tabItems, currHash);

            if( hashedTab && hashedTab.size() > 0){
                selectTab(hashedTab,true);
            }
            else {
                selectTab( tabItems.children(':first'),true);
            }
            //return true/false
            return (hash === undefined);
		}
		
		//if state tracking is enabled, set up the callback
		if(o.trackState){ $.historyInit(selectTabFromHash, o.srcPath); }

		//set tab from hash at page load, if no tab hash, select first tab
		selectTabFromHash(null,true);
		
		tabItems.on('click', 'a, h1', function(){
			selectTab($(this));
			$(this).focus();
			return false;
		}).on('focus', 'a, h1', function() {
			o.selected = tabItems.index($(this).parent());
		});
		
		if(o.alwaysScrollToTop){
			$(window)[0].scrollTo(0,0);
		}
	});
};
