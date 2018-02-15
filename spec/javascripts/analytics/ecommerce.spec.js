describe('Ecommerce reporter for results pages', function() {
  "use strict";

  var ecommerce,
      element;

  beforeEach(function() {
    ecommerce = new GOVUK.Ecommerce();
    spyOn(window, 'ga')
  });

  it('tracks ecommerce rows', function() {
    element = $('\
      <div data-ecommerce-start-index="1" data-search-query="search query">\
        <div \
          data-ecommerce-row\
          data-ecommerce-path="/path/to/page"\
          data-ecommerce-content-id="AAAA-1111"\
        </div>\
      </div>\
    ');

    ecommerce.init(element);

    expect(ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query'
    });
  });

  it('falls back to the path if the content id is not set', function() {
    element = $('\
      <div data-ecommerce-start-index="1" data-search-query="search query">\
        <div \
          data-ecommerce-row\
          data-ecommerce-path="/path/to/page"\
          data-ecommerce-content-id=""\
        </div>\
      </div>\
    ');

    ecommerce.init(element);

    expect(ga).toHaveBeenCalledWith('ec:addImpression', {
      id: '/path/to/page',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query'
    });
  });

  it('falls back to the path if the content id is not present', function() {
    element = $('\
      <div data-ecommerce-start-index="1" data-search-query="search query">\
        <div \
          data-ecommerce-row\
          data-ecommerce-path="/path/to/page"\
        </div>\
      </div>\
    ');

    ecommerce.init(element);

    expect(ga).toHaveBeenCalledWith('ec:addImpression', {
      id: '/path/to/page',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query'
    });
  });

  it('will use the pagination offset start value', function() {
    element = $('\
      <div data-ecommerce-start-index="21" data-search-query="search query">\
        <div \
          data-ecommerce-row\
          data-ecommerce-path="/path/to/page"\
          data-ecommerce-content-id="AAAA-1111"\
        </div>\
      </div>\
    ');

    ecommerce.init(element);

    expect(ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      position: 21,
      list: 'Site search results',
      dimension71: 'search query'
    });
  });

  it('will send data for multiple rows', function(){
    element = $('\
      <div data-ecommerce-start-index="1" data-search-query="search query">\
        <div \
          data-ecommerce-row\
          data-ecommerce-path="/path/to/page"\
          data-ecommerce-content-id="AAAA-1111"\
        </div>\
        <div \
          data-ecommerce-row\
          data-ecommerce-path="/a/different/page"\
          data-ecommerce-content-id="BBBB-2222"\
        </div>\
      </div>\
    ');

    ecommerce.init(element);

    expect(ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query'
    });
    expect(ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'BBBB-2222',
      position: 2,
      list: 'Site search results',
      dimension71: 'search query'
    });
  });

  it('removes emails from the search query', function() {
    element = $('\
      <div data-ecommerce-start-index="1" data-search-query="search query with an email@address.example.com in it">\
        <div \
          data-ecommerce-row\
          data-ecommerce-path="/path/to/page"\
          data-ecommerce-content-id="AAAA-1111"\
        </div>\
      </div>\
    ');

    ecommerce.init(element);

    expect(ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query with an [email] in it'
    });
  });

  it('removes postcodes from the search query if configured to do so', function() {
    GOVUK.analytics.analytics.stripPostcodePII = true;

    element = $('\
      <div data-ecommerce-start-index="1" data-search-query="search query with a SW1A 1AA in it">\
        <div \
          data-ecommerce-row\
          data-ecommerce-path="/path/to/page"\
          data-ecommerce-content-id="AAAA-1111"\
        </div>\
      </div>\
    ');

    ecommerce.init(element);

    expect(ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query with a [postcode] in it'
    });

    GOVUK.analytics.analytics.stripPostcodePII = false;
  });

  it('leaves postcodes in the search query if not configured to remove them', function() {
    GOVUK.analytics.analytics.stripPostcodePII = false;

    element = $('\
      <div data-ecommerce-start-index="1" data-search-query="search query with a SW1A 1AA in it">\
        <div \
          data-ecommerce-row\
          data-ecommerce-path="/path/to/page"\
          data-ecommerce-content-id="AAAA-1111"\
        </div>\
      </div>\
    ');

    ecommerce.init(element);

    expect(ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'AAAA-1111',
      position: 1,
      list: 'Site search results',
      dimension71: 'search query with a sw1a 1aa in it'
    });
  });

  it('tracks clicks on search results', function() {
    element = $('\
      <div data-ecommerce-start-index="1" data-search-query="search query">\
        <a \
          data-ecommerce-row\
          data-ecommerce-path="/path/to/page"\
          data-ecommerce-content-id="AAAA-1111"\
        </a>\
      </div>\
    ');

    ecommerce.init(element);
    element.find('[data-ecommerce-row]').click();

    expect(ga).toHaveBeenCalledWith('ec:addProduct', {
      id: 'AAAA-1111',
      position: 1,
      dimension71: 'search query'
    });
    expect(ga).toHaveBeenCalledWith('ec:setAction', 'click', {list: 'Site search results'})
    expect(ga).toHaveBeenCalledWith('send', {
      hitType: 'event',
      eventCategory: 'UX',
      eventAction: 'click',
      eventLabel: 'Results',
      dimension15: '200',
      dimension16: 'unknown',
      dimension11: '1',
      dimension3: 'other',
      dimension4: '00000000-0000-0000-0000-000000000000',
      dimension12: 'not withdrawn',
      dimension23: 'unknown',
      dimension26: '0',
      dimension27: '0',
      dimension32: 'none',
      dimension33: 'thing',
      dimension34: 'other',
      dimension39: 'false',
      dimension56: 'other',
      dimension57: 'other',
      dimension58: 'other',
      dimension59: 'other',
      dimension30: 'none'
    })
  });

  it('will only require the ec library once', function() {
    GOVUK.Ecommerce.ecLoaded = false;
    GOVUK.Ecommerce.start($('<div data-search-query="search query"></div>'));
    GOVUK.Ecommerce.start($('<div data-search-query="search query"></div>'));

    expect(ga).toHaveBeenCalledWith('require', 'ec');
    expect(ga.calls.count()).toEqual(1);
  });
});
