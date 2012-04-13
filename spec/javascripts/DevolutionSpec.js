SHORT_FIXTURE_TEXT = '<div id="section"><p class="devolved-header"><a>Nothing</a></p><div class="devolved-body"></div></div>';

describe("show_section", function() {

  beforeEach(function() {
    setFixtures(SHORT_FIXTURE_TEXT);
  });

  it("shows section body", function () {
    
    $inner_section = $('.devolved-body');
    $inner_section.hide();
    expect($inner_section).not.toBeVisible();
    Devolution.show_section($('#section'));
    expect($inner_section).toBeVisible();

  });

  it("still shows section body when it is already shown", function () {
    
    $inner_section = $('.devolved-body');
    $inner_section.show();
    expect($inner_section).toBeVisible();
    Devolution.show_section($('#section'));
    expect($inner_section).toBeVisible();

  });


  it("changes the button text", function () {

    $header = $('.devolved-header a');
    expect($header.text()).toNotEqual("Hide this");
    Devolution.show_section($('#section'));
    expect($header.text()).toEqual("Hide this");

  });
});

describe("hide_section", function() {
  beforeEach(function() {
    setFixtures(SHORT_FIXTURE_TEXT);
  });

  it("hides section body", function() {

    $inner_section = $('.devolved-body');
    $inner_section.show();
    expect($inner_section).toBeVisible();
    Devolution.hide_section($("#section"));
    expect($inner_section).not.toBeVisible();

  });

  it("still hides section body when it is already hidden", function() {

    $inner_section = $('.devolved-body');
    $inner_section.hide();
    expect($inner_section).not.toBeVisible();
    Devolution.hide_section($("#section"));
    expect($inner_section).not.toBeVisible();

  });

  it("changes the button text", function () {

    $header = $('.devolved-header a');
    expect($header.text()).toNotEqual("Show this");
    Devolution.hide_section($('#section'));
    expect($header.text()).toEqual("Show this");

  });
});

describe("toggle_section", function(){
  beforeEach(function() {
    setFixtures(SHORT_FIXTURE_TEXT);
  });

  it("hides the section body if it's shown", function() {

    $inner_section = $('.devolved-body');
    $inner_section.show();
    expect($inner_section).toBeVisible();
    Devolution.toggle_section($("#section"));
    expect($inner_section).not.toBeVisible();

  });

  it("shows the section body if it's hidden", function() {

    $inner_section = $('.devolved-body');
    $inner_section.hide();
    expect($inner_section).not.toBeVisible();
    Devolution.toggle_section($("#section"));
    expect($inner_section).toBeVisible();

  });

  it("changes the button text to 'Show this' if it was shown", function () {

    $inner_section = $('.devolved-body');
    $inner_section.show();
    $header = $('.devolved-header a');
    $header.text("Hide this");
    expect($header.text()).toEqual("Hide this");
    Devolution.toggle_section($('#section'));
    expect($header.text()).toEqual("Show this");

  });

 it("changes the button text to 'Hide this' if it was hidden", function () {

    $inner_section = $('.devolved-body');
    $inner_section.hide();
    $header = $('.devolved-header a');
    $header.text("Show this");
    expect($header.text()).toEqual("Show this");
    Devolution.toggle_section($('#section'));
    expect($header.text()).toEqual("Hide this");

  });

});

describe("addHideThisLinks", function() {
  beforeEach(function() {
    loadFixtures("DevolutionThreeCountrySections.html");
  });

  it("adds an anchor to each section header", function() {
    expect($('.devolved-header a').length).toBe(0);
    Devolution.addHideThisLinks();
    expect($('.devolved-header a').length).toBe(3);
    expect($('.england-wales > .devolved-header > a').text()).toBe("Hide this");
    expect($('.scotland > .devolved-header > a').text()).toBe("Hide this");
    expect($('.northern-ireland > .devolved-header > a').text()).toBe("Hide this");
  });
});

describe("openAndCloseSectionsByLocation", function(){

  function testSectionsAreOpen() {
    for (var i=0, length=arguments.length; i < length; i++) {
      expect($('.' + arguments[i] + ' > .devolved-body')).toBeVisible();
    }
  }

  function testSelectedSectionsAreOpenAndOthersAreClosed() {
    var args = arguments;
    $(".devolved-content").each(function(i, section) {
      if ($(section).hasClass(args[0]) || $(section).hasClass(args[1])) {
        expect($(section).find(".devolved-body")).toBeVisible();
      } else {
        expect($(section).find(".devolved-body")).not.toBeVisible();
      }
    });
  }

  function testSelectedSectionsHaveAHideThisLinkAndOthersHaveShowThis() {
    var args = arguments;
    $(".devolved-content").each(function(i, section) {
      if ($(section).hasClass(args[0]) || $(section).hasClass(args[1])) {
        expect($(section).find("a").text()).toBe("Hide this");
      } else {
        expect($(section).find("a").text()).toBe("Show this");
      }
    });
  }


  it("opens the england section when England is the current location and closes all other sections", function(){
    loadFixtures("DevolutionFourCountrySections.html");

    testSectionsAreOpen("england", "scotland", "northern-ireland", "wales");

    var geoData = {
      nation: 'England',
      council: []
    }
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsAreOpenAndOthersAreClosed("england");
  });

  it("opens the scotland section when Scotland is the current location and closes all other sections", function() {
    loadFixtures("DevolutionFourCountrySections.html");

    testSectionsAreOpen("england", "scotland", "northern-ireland", "wales");

    var geoData = {
      nation: 'Scotland',
      council: []
    }
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsAreOpenAndOthersAreClosed("scotland");
  });

  it("opens the northern-ireland section when Northern Ireland is the current location and closes all other sections", function() {
    loadFixtures("DevolutionFourCountrySections.html");

    testSectionsAreOpen("england", "scotland", "northern-ireland", "wales");

    var geoData = {
      nation: 'Northern Ireland',
      council: []
    }
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsAreOpenAndOthersAreClosed("northern-ireland");
  });

  it("opens the wales section when Wales is the current location and closes all other sections", function() {
    loadFixtures("DevolutionFourCountrySections.html");

    testSectionsAreOpen("england", "scotland", "northern-ireland", "wales");

    var geoData = {
      nation: 'Wales',
      council: []
    }
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsAreOpenAndOthersAreClosed("wales");
  });

  it("opens the england-wales section when England is the current location and closes all other sections", function() {
    loadFixtures("DevolutionThreeCountrySections.html");

    testSectionsAreOpen("england-wales", "scotland", "northern-ireland");

    var geoData = {
      nation: 'England',
      council: []
    }
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsAreOpenAndOthersAreClosed("england-wales");
  });


  it("opens the england-wales section when Wales is the current location and closes all other sections", function() {
    loadFixtures("DevolutionThreeCountrySections.html");

    testSectionsAreOpen("england-wales", "scotland", "northern-ireland");

    var geoData = {
      nation: 'Wales',
      council: []
    }
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsAreOpenAndOthersAreClosed("england-wales");
  });


  it("opens the northern-ireland section when Northern Ireland is the current location and there is a joint england-wales section, and closes all other sections", function() {
    loadFixtures("DevolutionThreeCountrySections.html");

    testSectionsAreOpen("england-wales", "scotland", "northern-ireland");

    var geoData = {
      nation: 'Northern Ireland',
      council: []
    }
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsAreOpenAndOthersAreClosed("northern-ireland");
  });

  it("opens the england and england-wales sections when England is the current location and closes all other sections", function() {
    loadFixtures("DevolutionIncorrectSections.html");

    testSectionsAreOpen("england", "wales", "england-wales", "northern-ireland");

    var geoData = {
      nation: 'England',
      council: []
    }
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsAreOpenAndOthersAreClosed("england", "england-wales");
  });

  it("opens the wales and england-wales sections when Wales is the current location and closes all other sections", function() {
    loadFixtures("DevolutionIncorrectSections.html");

    testSectionsAreOpen("england", "wales", "england-wales", "northern-ireland");

    var geoData = {
      nation: 'Wales',
      council: []
    }
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsAreOpenAndOthersAreClosed("wales", "england-wales");
  });

  it("hides all sections when Scotland is the current location and there is no scotland section", function() {
    loadFixtures("DevolutionIncorrectSections.html");

    testSectionsAreOpen("england", "wales", "england-wales", "northern-ireland");

    var geoData = {
      nation: 'Scotland',
      council: []
    }
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsAreOpenAndOthersAreClosed();
  });


  it("sets the england section link text to 'Hide this' when England is the current location and sets all others to 'Show this'", function(){
    loadFixtures("DevolutionFourCountrySections.html");

    var geoData = {
      nation: 'England',
      council: []
    }
    Devolution.addHideThisLinks();
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsHaveAHideThisLinkAndOthersHaveShowThis("england");
  });

  it("sets the wales and england-wales section link texts to 'Hide this' when Wales is the current location and sets all others to 'Show this'", function() {
    loadFixtures("DevolutionIncorrectSections.html");

    var geoData = {
      nation: 'Wales',
      council: []
    }
    Devolution.addHideThisLinks();
    Devolution.openAndCloseSectionsByLocation(geoData);

    testSelectedSectionsAreOpenAndOthersAreClosed("wales", "england-wales");
  });

  // it("hides London section if councils are not in London", function() {
  //   loadFixtures("DevolutionTIncorrectSections.html");

  //   var geoData = {
  //     nation: 'Wales',
  //     council: []
  //   }
  //   Devolution.addHideThisLinks();
  //   Devolution.openAndCloseSectionsByLocation(geoData);

  //   testSelectedSectionsAreOpenAndOthersAreClosed("wales", "england-wales");
  // });




});