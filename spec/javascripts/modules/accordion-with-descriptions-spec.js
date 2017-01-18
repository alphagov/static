describe('An accordion with descriptions module', function () {
  "use strict";

  var $element;
  var accordion;
  var html = '\
    <div class="subsections js-hidden" data-module="accordion-with-descriptions">\
      <div class="subsection-wrapper">\
        <div class="subsection js-subsection">\
          <div class="subsection__header">\
            <h2 class="subsection__title" id="topic-section-one">Topic Section One</h2>\
            <p class="subsection__description">Subsection description in here</p>\
          </div>\
          <div class="subsection__content js-subsection-content" id="subsection_content_0">\
            <ul class="subsection__list">\
              <li class="subsection__list-item">\
                <a href="">Subsection list item in here</a>\
              </li>\
            </ul>\
          </div>\
        </div>\
        <div class="subsection js-subsection">\
          <div class="subsection__header">\
            <h2 class="subsection__title" id="topic-section-two">Topic Section Two</h2>\
            <p class="subsection__description">Subsection description in here</p>\
          </div>\
          <div class="subsection__content js-subsection-content" id="subsection_content_1">\
            <ul class="subsection__list">\
              <li class="subsection__list-item">\
                <a href="">Subsection list item in here</a>\
              </li>\
            </ul>\
          </div>\
        </div>\
      </div>\
    </div>';

  beforeEach(function () {
    accordion = new GOVUK.Modules.AccordionWithDescriptions();
    $element = $(html);
  });

  afterEach(function() {
    $(document).off();
  });

  it("has a class of js-accordion-with-descriptions to indicate the js has loaded", function () {
    accordion.start($element);

    expect($element).toHaveClass("js-accordion-with-descriptions");
  });

  it("is not hidden", function () {
    accordion.start($element);

    expect($element).not.toHaveClass("js-hidden");
  });

  it("has an open/close all button", function () {
    accordion.start($element);

    var $openCloseAllButton = $element.find('.js-subsection-controls button');

    expect($openCloseAllButton).toExist();
    expect($openCloseAllButton).toHaveText("Open all");
    // It has an aria-expanded false attribute as all subsections are closed
    expect($openCloseAllButton).toHaveAttr("aria-expanded", "false");
    // It has an aria-controls attribute that includes all the subsection_content IDs
    expect($openCloseAllButton).toHaveAttr('aria-controls','subsection_content_0 subsection_content_1 ');
  });

  it("has no subsections which have an open state", function () {
    accordion.start($element);

    var openSubsections = $element.find('.subsection--is-open').length;

    expect(openSubsections).toEqual(0);
  });

  it("inserts a button into each subsection to show/hide content", function () {
    accordion.start($element);

    var $subsectionButton = $element.find('.subsection__title button');

    expect($subsectionButton).toHaveClass('subsection__button');
    // It has an aria-expanded false attribute as it is closed
    expect($subsectionButton).toHaveAttr('aria-expanded','false');
    // It has an aria-controls attribute to store the subsection_content ID
    expect($subsectionButton).toHaveAttr('aria-controls','subsection_content_0');
  });

  it("ensures all subsection content is hidden", function () {
    accordion.start($element);

    $.each($element.find('.subsection__content'), function(index, content) {
      expect(content).toHaveClass('js-hidden');
    });
  });

  it("adds an open/close icon to each subsection", function () {
    accordion.start($element);

    var $subsectionHeader = $element.find('.subsection__header');

    expect($subsectionHeader).toContainElement('.subsection__icon');
  });

  describe('When the "Open all" button is clicked', function () {

    beforeEach(function() {
      accordion.start($element);
      $element.find('.js-subsection-controls button').click();
    });

    it('adds a .subsection--is-open class to each subsection to hide the icon', function () {
      expect($element.find('.subsection--is-open').length).toEqual(2);
    });

    it('adds an aria-expanded attribute to each subsection button', function () {
      expect($element.find('.subsection__button[aria-expanded="true"]').length).toEqual(2);
    });

    it('removes the .js-hidden class from each subsection content to hide the list of links', function () {
      expect($element.find('.subsection__content.js-hidden').length).toEqual(0);
    });

    it('changes the Open/Close all button text to "Close all"', function () {
      expect($element.find('.js-subsection-controls button')).toContainText("Close all");
    });

  });

  describe('When a section is open', function () {

    // When a section is open (testing: toggleSection, openSection)
    it("does not have a class of js-hidden", function () {
      accordion.start($element);

      var $subsectionButton = $element.find('.subsection__title button:first');
      var $subsectionContent = $element.find('.subsection__content:first');
      $subsectionButton.click();
      expect($subsectionContent).not.toHaveClass("js-hidden");
    });

    // When a section is open (testing: toggleState, setExpandedState)
    it("has a an aria-expanded attribute and the value is true", function () {
      accordion.start($element);

      var $subsectionButton = $element.find('.subsection__title button:first');
      $subsectionButton.click();
      expect($subsectionButton).toHaveAttr('aria-expanded','true');
    });

    it("has its state saved in session storage", function () {
      accordion.start($element);

      var GOVUKServiceManualTopic = "GOVUK_service_manual_agile_delivery";

      var $subsectionButton = $element.find('.subsection__title button');
      $subsectionButton.click();

      var $openSubsections = $('.subsection--is-open');
      var subsectionOpenContentId = $openSubsections.find('.subsection__content').attr('id');
      sessionStorage.setItem(GOVUKServiceManualTopic+subsectionOpenContentId , 'Opened');

      var storedItem = sessionStorage.getItem(GOVUKServiceManualTopic+subsectionOpenContentId);
      expect(storedItem).toEqual('Opened');
    });

  });

  describe('When a section is closed', function () {

    // When a section is closed (testing: toggleSection, closeSection)
    it("has a class of js-hidden", function () {
      accordion.start($element);

      var $subsectionButton = $element.find('.subsection__title button:first');
      var $subsectionContent = $element.find('.subsection__content:first');
      $subsectionButton.click();
      expect($subsectionContent).not.toHaveClass("js-hidden");
      $subsectionButton.click();
      expect($subsectionContent).toHaveClass("js-hidden");
    });

    // When a section is closed (testing: toggleState, setExpandedState)
    it("has a an aria-expanded attribute and the value is false", function () {
      accordion.start($element);

      var $subsectionButton = $element.find('.subsection__title button:first');
      $subsectionButton.click();
      expect($subsectionButton).toHaveAttr('aria-expanded','true');
      $subsectionButton.click();
      expect($subsectionButton).toHaveAttr('aria-expanded','false');
    });

    it("has its state removed in session storage", function () {
      accordion.start($element);

      var GOVUKServiceManualTopic = "GOVUK_service_manual_agile_delivery";

      var $closedSubsections = $element.find('.subsection');
      var subsectionClosedContentId = $closedSubsections.find('.subsection__content').attr('id');
      sessionStorage.removeItem(GOVUKServiceManualTopic+subsectionClosedContentId , 'Opened');
      var removedItem = sessionStorage.getItem(GOVUKServiceManualTopic+subsectionClosedContentId);
      expect(removedItem).not.toExist();
    });

  });

  describe('When linking to a topic section', function () {
    beforeEach(function() {
      spyOn(GOVUK, 'getCurrentLocation').and.returnValue({
        hash: '#topic-section-one'
      });
    });

    it("opens the linked to topic section", function () {
      accordion.start($element);

      var $subsectionContent = $element.find('#topic-section-one')
        .parents('.subsection').find('.subsection__content');

      expect($subsectionContent).not.toHaveClass('js-hidden');
    });

    it("leaves other sections closed", function () {
      accordion.start($element);

      var $subsectionContent = $element.find('#topic-section-two')
        .parents('.subsection').find('.subsection__content');

      expect($subsectionContent).toHaveClass('js-hidden');
    });
  });

});
