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
		mobileHeadingTag: 'h2'
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
            return $tabsBody.find(o.mobileHeadingTag + '.js-heading-tab');
        }

        return $tabsNav.find('li');
    };

	var adapt = function ($tabs, $tabsNav, $tabItems) {
        var $tabItems = $tabsNav.find('li'),
            $container = $tabsNav.closest('nav').parent(),
            $relatedArticle, 
            $tmpHeading;

        $.each($tabItems, function (idx) {
            $tmpHeading = $('<' + o.mobileHeadingTag + ' />').addClass('js-heading-tab');
            $relatedArticle = $container.find('#' + $(this).find('a').attr('href').split('#')[1]);
            $tmpHeading.append($(this).find('a'));
            $tmpHeading.insertBefore($relatedArticle);
        })

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

		tabsBody
			.addClass('tabs-body')
			.attr('aria-live', 'polite');
		
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
		tabItems.find('a').each(function(){
			var id = $(this).attr('href').split('#')[1];
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
				var anchor = tab.attr('href').split("#")[1];
				$.historyLoad(anchor);
			} else {
				//unselect tabs
				tabItems
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
				var anchor = tab.attr('href').split("#")[1];
				$( "#" + anchor + tabIDsuffix )
					.addClass('tabs-panel-selected')
					.attr('aria-hidden',false)
					.attr('aria-expanded', true)
					.show();

				// set selected index
				o.selected = tab.parent().index();
			}
		}

		// keyboard navigation
		tabs.on('keydown', function(event) {
			if (event.keyCode < $.ui.keyCode.PAGE_UP || event.keyCode > $.ui.keyCode.DOWN)
				return;

			var selectedIndex;
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
				selectedIndex = o.selected - 1;
				break;
			}
			event.preventDefault();
			event.stopPropagation();

			if (selectedIndex !== undefined) {
				selectedIndex = selectedIndex >= tabItems.find('a').length ? 0 : selectedIndex < 0 ? tabItems.find('a').length - 1 : selectedIndex;
			
				selectTab(tabItems.find('a').eq(selectedIndex).focus());
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
			var hashedTab = tabItems.find('a[href$=#'+ currHash +']');
				if( hashedTab.size() > 0){
					selectTab(hashedTab,true);
				}
				else {
					selectTab( tabItems.find('a:first'),true);
				}
				//return true/false
				return !!hashedTab.size();
		}
		
		//if state tracking is enabled, set up the callback
		if(o.trackState){ $.historyInit(selectTabFromHash, o.srcPath); }

		//set tab from hash at page load, if no tab hash, select first tab
		selectTabFromHash(null,true);
		
		tabItems.on('click', 'a', function(){
			selectTab($(this));
			$(this).focus();
			return false;
		}).on('focus', 'a', function() {
			o.selected = $(this).parent().index();
		});
		
		if(o.alwaysScrollToTop){
			$(window)[0].scrollTo(0,0);
		}
	});
};
