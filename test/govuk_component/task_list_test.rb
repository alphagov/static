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
          title: 'First group first step',
          panel: '<p class="firstpanel">First panel</p>',
          panel_descriptions: [
            'First group first step first panel description',
            'First group first step second panel description'
          ],
          panel_links: [
            {
              href: '/notalink1',
              text: 'First group first step first panel link'
            },
            {
              href: '/notalink2',
              text: 'First group first step second panel link'
            }
          ]
        },
        {
          title: 'First group second step',
          panel: '<p class="secondpanel">Second panel</p>',
          panel_descriptions: [
            'First group second step first panel description',
            'First group second step second panel description'
          ],
          panel_links: [
            {
              href: '/notalink3',
              text: 'First group second step first panel link'
            },
            {
              href: '/notalink4',
              text: 'First group second step second panel link',
              active: true
            }
          ]
        }
      ],
      [
        {
          title: 'Second group first step',
          panel: '<p class="thirdpanel">Third panel</p>',
          panel_descriptions: [
            'Second group first step first panel description',
            'Second group first step second panel description'
          ],
          panel_links: [
            {
              href: '/notalink5',
              text: 'Second group first step first panel link'
            },
            {
              href: '/notalink6',
              text: 'Second group first step second panel link'
            }
          ]
        }
      ]
    ]
  end

  group1 = ".pub-c-task-list__group:nth-child(1)"
  group2 = ".pub-c-task-list__group:nth-child(2)"

  test "renders nothing without passed content" do
    assert_empty render_component({})
  end

  test "renders a simple tasklist correctly" do
    render_component(groups: simple_tasklist)
    assert_select ".pub-c-task-list"

    assert_select group1 + " .pub-c-task-list__step#first-header"
    assert_select group1 + " .pub-c-task-list__title", text: "First header"
    assert_select group1 + " .pub-c-task-list__panel", text: "First panel"

    assert_select group2 + " .pub-c-task-list__step#second-header"
    assert_select group2 + " .pub-c-task-list__title", text: "Second header"
    assert_select group2 + " .pub-c-task-list__panel", text: "Second panel"
  end

  test "renders a simple tasklist with custom step ids" do
    ids_accordion = simple_tasklist
    ids_accordion[0][0][:id] = "first-step-id"

    render_component(groups: ids_accordion)

    assert_select group1, id: "first-step-id"
    assert_select group2, id: "2nd-header"
  end

  test "renders a tasklist with different heading levels" do
    render_component(groups: simple_tasklist, heading_level: 4)

    assert_select group1 + " .pub-c-task-list__step#first-header h4.pub-c-task-list__title", text: "First header"
    assert_select group2 + " .pub-c-task-list__step#second-header h4.pub-c-task-list__title", text: "Second header"
  end

  test "opens a step by default" do
    render_component(groups: simple_tasklist, open_step: 2)

    assert_select group2 + " .pub-c-task-list__step[data-open]"
  end

  test "remembers last opened step" do
    render_component(groups: simple_tasklist, remember_last_step: true)

    assert_select ".pub-c-task-list[data-remember]"
  end

  test "renders a complex tasklist" do
    render_component(groups: complex_tasklist)

    group1_step1 = group1 + " .pub-c-task-list__step#first-group-first-step"
    group1_step2 = group1 + " .pub-c-task-list__step#first-group-second-step"

    assert_select group1 + ".pub-c-task-list__group--active[aria-current='step']"
    assert_select group2 + ".pub-c-task-list__group--active", false

    assert_select group1_step1 + " .firstpanel", text: 'First panel'
    assert_select group1_step1 + " .pub-c-task-list__panel-description:nth-child(2)", text: 'First group first step first panel description'
    assert_select group1_step1 + " .pub-c-task-list__panel-description:nth-child(3)", text: 'First group first step second panel description'
    assert_select group1_step1 + " .pub-c-task-list__panel-links .pub-c-task-list__panel-link:nth-child(1) a[href=?]", '/notalink1', text: 'First group first step first panel link'
    assert_select group1_step1 + " .pub-c-task-list__panel-links .pub-c-task-list__panel-link:nth-child(2) a[href=?]", '/notalink2', text: 'First group first step second panel link'

    assert_select group1_step2 + " .secondpanel", text: 'Second panel'
    assert_select group1_step2 + " .pub-c-task-list__panel-description:nth-child(2)", text: 'First group second step first panel description'
    assert_select group1_step2 + " .pub-c-task-list__panel-description:nth-child(3)", text: 'First group second step second panel description'
    assert_select group1_step2 + " .pub-c-task-list__panel-links .pub-c-task-list__panel-link:nth-child(1) a[href=?]", '/notalink3', text: 'First group second step first panel link'
    assert_select group1_step2 + " .pub-c-task-list__panel-links .pub-c-task-list__panel-link--active:nth-child(2) .visuallyhidden", text: 'You are currently viewing:'
    assert_select group1_step2 + " .pub-c-task-list__panel-links .pub-c-task-list__panel-link--active:nth-child(2)", text: 'You are currently viewing: First group second step second panel link'
  end

  test "renders a small tasklist" do
    render_component(groups: simple_tasklist, small: true)

    assert_select ".pub-c-task-list"
    assert_select ".pub-c-task-list.pub-c-task-list--large", false
  end
end
