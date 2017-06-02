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
      <div data-ecommerce-start-index="1">\
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
      list: 'Site search results'
    });
  });

  it('falls back to the path if the content id is not set', function() {
    element = $('\
      <div data-ecommerce-start-index="1">\
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
      list: 'Site search results'
    });
  });

  it('falls back to the path if the content id is not present', function() {
    element = $('\
      <div data-ecommerce-start-index="1">\
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
      list: 'Site search results'
    });
  });

  it('will use the pagination offset start value', function() {
    element = $('\
      <div data-ecommerce-start-index="21">\
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
      list: 'Site search results'
    });
  });

  it('will send data for multiple rows', function(){
    element = $('\
      <div data-ecommerce-start-index="1">\
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
      list: 'Site search results'
    });
    expect(ga).toHaveBeenCalledWith('ec:addImpression', {
      id: 'BBBB-2222',
      position: 2,
      list: 'Site search results'
    });
  });

  it('tracks clicks on search results', function() {
    element = $('\
      <div data-ecommerce-start-index="1">\
        <a \
          data-ecommerce-row\
          data-ecommerce-path="/path/to/page"\
          data-ecommerce-content-id="AAAA-1111"\
        </a>\
      </div>\
    ');

    ecommerce.init(element);
    element.find('[data-ecommerce-row]').click()

    expect(ga).toHaveBeenCalledWith('ec:addProduct', {
      id: 'AAAA-1111',
      position: 1
    });
    expect(ga).toHaveBeenCalledWith('ec:setAction', 'click', {list: 'Site search results'})
    expect(ga).toHaveBeenCalledWith('send', 'event', 'UX', 'click', 'Results')
  });

  it('will only require the ec library once', function() {
    GOVUK.Ecommerce.ecLoaded = false;
    GOVUK.Ecommerce.start($('<div></div>'));
    GOVUK.Ecommerce.start($('<div></div>'));

    expect(ga).toHaveBeenCalledWith('require', 'ec');
    expect(ga.calls.count()).toEqual(1);
  });
});
