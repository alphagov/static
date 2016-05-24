require_relative "../integration_test_helper"

class RelatedTemplateTest < ActionDispatch::IntegrationTest
  include ERB::Util

  def get_template
    get "/templates/related.raw.html.erb"
    last_response.body
  end

  context "with related artefacts" do
    setup do
      @related1 = stub("Artefact", web_url: "http://www.example.com/foo", title: "Foo", group: "subsection")
      @related2 = stub("Artefact", web_url: "http://www.example.com/bar", title: "Bar", group: "section")
      @related3 = stub("Artefact", web_url: "http://www.example.com/baz", title: "Baz", group: "other")
      @artefact = stub("Artefact",
        related_artefacts: [@related1, @related2, @related3],
        related_external_links: [],
        primary_root_section: { "title" => "Section", "content_with_tag" => { "web_url" => "/browse/section" } },
        primary_section: { "title" => "Sub-section", "content_with_tag" => { "web_url" => "/browse/section/subsection" } },
        format: "guide"
      )
    end

    should "add an item for each related item" do
      template = get_template
      artefact = @artefact
      result = ERB.new(template).result(binding)
      doc = Nokogiri::HTML.parse(result)

      assert doc.at_css("ul li a[href='http://www.example.com/foo']")
      assert_equal "Foo", doc.at_css("ul li a[href='http://www.example.com/foo']").inner_html.to_s

      assert doc.at_css("ul li a[href='http://www.example.com/bar']")
      assert_equal "Bar", doc.at_css("ul li a[href='http://www.example.com/bar']").inner_html.to_s
    end

    should "sanitise strings before output" do
      @related1.stubs(:web_url).returns("http://www.example.com/foo?bar=baz&id=2")
      @related1.stubs(:title).returns("This & that")
      template = get_template
      artefact = @artefact
      result = ERB.new(template).result(binding)

      assert_match /This &amp; that/, result
      assert_match /foo\?bar=baz&amp;id=2/, result
    end

    should "add the subsection links if present" do
      @artefact.stubs(:primary_section).returns({
        "title" => "Subsection",
        "content_with_tag" => {"web_url" => "http://www.example.com/browse/section/subsection"},
      })
      template = get_template
      artefact = @artefact
      result = ERB.new(template).result(binding)
      doc = Nokogiri::HTML.parse(result)

      assert doc.at_css("ul li.related-topic a[href='http://www.example.com/browse/section/subsection']")
      assert_equal "More in Subsection", doc.at_css("ul li a[href='http://www.example.com/browse/section/subsection']").text
    end

    should "add the section link if present" do
      @artefact.stubs(:primary_root_section).returns({
        "title" => "Something",
        "content_with_tag" => {"web_url" => "http://www.example.com/browse/something"},
      })
      template = get_template
      artefact = @artefact
      result = ERB.new(template).result(binding)
      doc = Nokogiri::HTML.parse(result)

      assert doc.at_css("ul li.related-topic a[href='http://www.example.com/browse/something']")
      assert_equal "More in Something", doc.at_css("ul li a[href='http://www.example.com/browse/something']").text
    end

    should "add the internal links elsewhere if present" do
      template = get_template
      artefact = @artefact
      result = ERB.new(template).result(binding)
      doc = Nokogiri::HTML.parse(result)

      assert_equal "Elsewhere on GOV.UK", doc.at_css("h2#parent-other").text
    end

    should "use the second-level section name for travel advice formats" do
      @artefact.stubs(:format).returns("travel-advice")
      @artefact.stubs(:primary_section).returns({
        "title" => "Foreign travel advice",
        "content_with_tag" => {"web_url" => "/foreign-travel-advice"},
        "parent" => {
          "title" => "Foo",
          "content_with_tag" => {"web_url" => "/browse/abc/foo"}
        }
      })

      template = get_template
      artefact = @artefact
      result = ERB.new(template).result(binding)
      doc = Nokogiri::HTML.parse(result)

      assert_equal "Foo", doc.at_css("h2#parent-subsection").text
    end

    context "adding related_external_links" do
      should "add the 'Elsewhere on the web' section with the links" do
        @artefact.stubs(:related_external_links).returns(
          [
            {"title" => "Foo", "url" => "http://www.foo.com/"},
            {"title" => "Bar", "url" => "http://www.bar.com/"},
          ]
        )

        template = get_template
        artefact = @artefact
        result = ERB.new(template).result(binding)
        doc = Nokogiri::HTML.parse(result)

        assert doc.at_css("h2#related-external-links")

        links = doc.css('nav[aria-labelledby=related-external-links] li a')
        assert_equal ["Foo", "Bar"], links.map(&:text)
        assert_equal ["http://www.foo.com/", "http://www.bar.com/"], links.map {|l| l[:href]}
        assert_equal ["external", "external"], links.map {|l| l[:rel]}
      end

      should "not add the section when empty array" do
        template = get_template
        artefact = @artefact
        result = ERB.new(template).result(binding)
        doc = Nokogiri::HTML.parse(result)

        refute doc.at_css("h2#related-external-links")
      end

      should "not add the section when nil" do
        @artefact.stubs(:related_external_links).returns(nil)
        template = get_template
        artefact = @artefact
        result = ERB.new(template).result(binding)
        doc = Nokogiri::HTML.parse(result)

        refute doc.at_css("h2#related-external-links")
      end
    end
  end

  context "adding related_external_links with no internal related links" do
    setup do
      @artefact = stub("Artefact",
        related_artefacts: [],
        related_external_links: [],
        primary_root_section: { "title" => "Section", "content_with_tag" => { "web_url" => "/browse/section" } },
        primary_section: { "title" => "Sub-section", "content_with_tag" => { "web_url" => "/browse/section/subsection" } },
        format: "guide"
      )
    end

    should "add the 'Elsewhere on the web' section with the links" do
      @artefact.stubs(:related_external_links).returns(
        [
          {"title" => "Foo", "url" => "http://www.foo.com/"},
          {"title" => "Bar", "url" => "http://www.bar.com/"},
        ]
      )

      template = get_template
      artefact = @artefact
      result = ERB.new(template).result(binding)
      doc = Nokogiri::HTML.parse(result)

      assert doc.at_css("h2#related-external-links")

      links = doc.css('nav[aria-labelledby=related-external-links] li a')
      assert_equal ["Foo", "Bar"], links.map(&:text)
      assert_equal ["http://www.foo.com/", "http://www.bar.com/"], links.map {|l| l[:href]}
    end

    should "not add the section when empty array" do
      template = get_template
      artefact = @artefact
      result = ERB.new(template).result(binding)
      doc = Nokogiri::HTML.parse(result)

      refute doc.at_css("h2#related-external-links")
    end

    should "not add the section when nil" do
      @artefact.stubs(:related_external_links).returns(nil)
      template = get_template
      artefact = @artefact
      result = ERB.new(template).result(binding)
      doc = Nokogiri::HTML.parse(result)

      refute doc.at_css("h2#related-external-links")
    end
  end

  should "be blank with no artefact" do
    template = get_template
    artefact = nil
    result = ERB.new(template).result(binding)

    assert_match /\A\s+\z/, result
  end

  should "be blank with an artefact with no related_artefacts or related_external_links" do
    template = get_template

    artefact = stub("Artefact", related_artefacts: [], related_external_links: [])
    result = ERB.new(template).result(binding)

    assert_match /\A\s+\z/, result
  end

  should "be blank with no related_artefacts and nil related_external_links" do
    template = get_template

    artefact = stub("Artefact", related_artefacts: [], related_external_links: nil)
    result = ERB.new(template).result(binding)

    assert_match /\A\s+\z/, result
  end
end
