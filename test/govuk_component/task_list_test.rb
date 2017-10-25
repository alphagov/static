require 'govuk_component_test_helper'

class TaskListTest < ComponentTestCase
  def component_name
    "task_list"
  end

  def simple_tasklist
    [
      [
        {
          title: 'First header',
          panel: 'First panel'
        }
      ],
      [
        {
          title: 'Second header',
          panel: 'Second panel'
        }
      ]
    ]
  end

  def complex_tasklist
    [
      [
        {
          title: 'First step first section',
          panel: '<p class="firstpanel">First panel</p>',
          panel_descriptions: [
            'First step first section first panel description',
            'First step first section second panel description'
          ],
          panel_links: [
            {
              href: '/notalink1',
              text: 'First step first section first panel link'
            },
            {
              href: '/notalink2',
              text: 'First step first section second panel link'
            }
          ]
        },
        {
          title: 'First step second section',
          panel: '<p class="secondpanel">Second panel</p>',
          panel_descriptions: [
            'First step second section first panel description',
            'First step second section second panel description'
          ],
          panel_links: [
            {
              href: '/notalink3',
              text: 'First step second section first panel link'
            },
            {
              href: '/notalink4',
              text: 'First step second section second panel link',
              active: true
            }
          ]
        }
      ],
      [
        {
          title: 'Second step first section',
          panel: '<p class="thirdpanel">Third panel</p>',
          panel_descriptions: [
            'Second step first section first panel description',
            'Second step first section second panel description'
          ],
          panel_links: [
            {
              href: '/notalink5',
              text: 'Second step first section first panel link'
            },
            {
              href: '/notalink6',
              text: 'Second step first section second panel link'
            }
          ]
        }
      ]
    ]
  end

  step1 = ".pub-c-task-list__step:nth-child(1)"
  step2 = ".pub-c-task-list__step:nth-child(2)"

  test "renders nothing without passed content" do
    assert_empty render_component({})
  end

  test "renders a simple tasklist correctly" do
    render_component(steps: simple_tasklist)
    assert_select ".pub-c-task-list"

    assert_select step1 + " .pub-c-task-list__section#first-header"
    assert_select step1 + " .pub-c-task-list__title", text: "First header"
    assert_select step1 + " .pub-c-task-list__panel", text: "First panel"

    assert_select step2 + " .pub-c-task-list__section#second-header"
    assert_select step2 + " .pub-c-task-list__title", text: "Second header"
    assert_select step2 + " .pub-c-task-list__panel", text: "Second panel"
  end

  test "renders a simple tasklist with custom section ids" do
    ids_accordion = simple_tasklist
    ids_accordion[0][0][:id] = "first-section-id"

    render_component(steps: ids_accordion)

    assert_select step1, id: "first-section-id"
    assert_select step2, id: "2nd-header"
  end

  test "renders a tasklist with different heading levels" do
    render_component(steps: simple_tasklist, heading_level: 4)

    assert_select step1 + " .pub-c-task-list__section#first-header h4.pub-c-task-list__title", text: "First header"
    assert_select step2 + " .pub-c-task-list__section#second-header h4.pub-c-task-list__title", text: "Second header"
  end

  test "opens a section by default" do
    render_component(steps: simple_tasklist, open_section: 2)

    assert_select step2 + " .pub-c-task-list__section[data-open]"
  end

  test "remembers last opened section" do
    render_component(steps: simple_tasklist, remember_last_section: true)

    assert_select ".pub-c-task-list[data-remember]"
  end

  test "renders a complex tasklist" do
    render_component(steps: complex_tasklist)

    step1_section1 = step1 + " .pub-c-task-list__section#first-step-first-section"
    step1_section2 = step1 + " .pub-c-task-list__section#first-step-second-section"

    assert_select step1 + ".pub-c-task-list__step--active[aria-current=?]", 'step'
    assert_select step2 + ".pub-c-task-list__step--active", false

    assert_select step1_section1 + " .firstpanel", text: 'First panel'
    assert_select step1_section1 + " .pub-c-task-list__panel-description:nth-child(2)", text: 'First step first section first panel description'
    assert_select step1_section1 + " .pub-c-task-list__panel-description:nth-child(3)", text: 'First step first section second panel description'
    assert_select step1_section1 + " .pub-c-task-list__panel-links .pub-c-task-list__panel-link:nth-child(1) a[href=?]", '/notalink1', text: 'First step first section first panel link'
    assert_select step1_section1 + " .pub-c-task-list__panel-links .pub-c-task-list__panel-link:nth-child(2) a[href=?]", '/notalink2', text: 'First step first section second panel link'

    assert_select step1_section2 + " .secondpanel", text: 'Second panel'
    assert_select step1_section2 + " .pub-c-task-list__panel-description:nth-child(2)", text: 'First step second section first panel description'
    assert_select step1_section2 + " .pub-c-task-list__panel-description:nth-child(3)", text: 'First step second section second panel description'
    assert_select step1_section2 + " .pub-c-task-list__panel-links .pub-c-task-list__panel-link:nth-child(1) a[href=?]", '/notalink3', text: 'First step second section first panel link'
    assert_select step1_section2 + " .pub-c-task-list__panel-links .pub-c-task-list__panel-link--active:nth-child(2) .visuallyhidden", text: 'You are currently viewing:'
    assert_select step1_section2 + " .pub-c-task-list__panel-links .pub-c-task-list__panel-link--active:nth-child(2)", text: 'You are currently viewing: First step second section second panel link'
  end

  test "renders a small tasklist" do
    render_component(steps: simple_tasklist, small: true)

    assert_select ".pub-c-task-list"
    assert_select ".pub-c-task-list.pub-c-task-list--large", false
  end
end
