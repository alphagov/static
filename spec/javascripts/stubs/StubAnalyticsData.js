// This is stub data to make the jasmine specRunner page
// act as though it were a tracking page

GOVUK.Analytics = {
    NeedID: 'foo',
    Format: 'guide'
};

// NOTE: currently attatching this to the head as the spec runner nukes
// the page body as part of it's loading process, this needs to be on
// the page before some of our .js is loaded so this looks like the
// best solution at the moment...
//      @gtrogers

$("<div id='content'><a id='guide-link' href='#'>link</a></div>").appendTo('head');
$("<div class='article-container'><a id='transaction-link' href='#'>link</a></div>").appendTo('head');