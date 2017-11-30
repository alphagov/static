require 'govuk_component_test_helper'

class TaskListTest < ComponentTestCase
  def component_name
    "task_list"
  end

  def tasklist
    [
      [
        {
          title: 'Group 1 step 1',
          optional: true,
          contents: [
            {
              type: 'paragraph',
              text: 'Group 1 step 1 paragraph'
            },
            {
              type: 'list',
              style: 'required',
              links: [
                {
                  href: '/link1',
                  text: 'Link 1',
                },
                {
                  href: '/link2',
                  text: 'Link 2',
                  cost: '&pound;0 to &pound;300'
                },
              ]
            },
            {
              type: 'substep',
              optional: false
            },
            {
              type: 'paragraph',
              text: 'This paragraph is inside a required substep'
            },
          ]
        },
        {
          title: 'Group 1 step 2',
          optional: false,
          contents: [
            {
              type: 'paragraph',
              text: 'test'
            }
          ]
        }
      ],
      [
        {
          title: 'Group 2 step 1',
          contents: [
            {
              type: 'paragraph',
              text: 'Group 2 step 1 paragraph'
            },
            {
              type: 'list',
              style: 'choice',
              links: [
                {
                  href: '/link3',
                  text: 'Link 3',
                },
                {
                  href: '/link4',
                  active: true,
                  text: 'Link 4',
                },
              ]
            },
            {
              type: 'substep',
              optional: true
            },
            {
              type: 'paragraph',
              text: 'This paragraph is inside an optional substep'
            },
          ]
        },
        {
          title: 'Group 2 step 2',
          logic: 'or',
          contents: [
            {
              type: 'paragraph',
              text: 'test'
            }
          ]
        }
      ]
    ]
  end

  group1 = ".pub-c-task-list__group:nth-child(1)"
  group1step1 = group1 + " .pub-c-task-list__step:nth-of-type(1)"
  group1step2 = group1 + " .pub-c-task-list__step:nth-of-type(2)"

  group2 = ".pub-c-task-list__group:nth-child(2)"
  group2step1 = group2 + " .pub-c-task-list__step:nth-of-type(1)"
  group2step2 = group2 + " .pub-c-task-list__step:nth-of-type(2)"

  test "renders nothing without passed content" do
    assert_empty render_component({})
  end

  test "renders paragraphs" do
    render_component(groups: tasklist)
    assert_select ".pub-c-task-list"

    assert_select group1 + " .pub-c-task-list__step#group-1-step-1:nth-of-type(1)"
    assert_select group1step1 + " .pub-c-task-list__title", text: "Group 1 step 1"
    assert_select group1step1 + " .pub-c-task-list__paragraph", text: "Group 1 step 1 paragraph"

    assert_select group2 + " .pub-c-task-list__step#group-2-step-2:nth-of-type(1)"
    assert_select group2step1 + " .pub-c-task-list__title", text: "Group 2 step 1"
    assert_select group2step1 + " .pub-c-task-list__paragraph", text: "Group 2 step 1 paragraph"
  end

  test "renders a tasklist with different heading levels" do
    render_component(groups: tasklist, heading_level: 4)

    assert_select group1step1 + " h4.pub-c-task-list__title", text: "Group 1 step 1"
    assert_select group2step1 + " h4.pub-c-task-list__title", text: "Group 2 step 1"
  end

  test "opens a step by default" do
    render_component(groups: tasklist, show_step: 2)

    assert_select group1 + " .pub-c-task-list__step#group-1-step-2[data-show]"
  end

  test "remembers last opened step" do
    render_component(groups: tasklist, remember_last_step: true)

    assert_select ".pub-c-task-list[data-remember]"
  end

  test "renders links" do
    render_component(groups: tasklist)

    assert_select group1step1 + " .pub-c-task-list__link-item[href='/link1']", text: "Link 1"
    assert_select group1step1 + " .pub-c-task-list__link-item[href='/link2']", text: "Link 2"
    assert_select group1step1 + " .pub-c-task-list__cost", text: "&pound;0 to &pound;300"

    assert_select group2step1 + " .pub-c-task-list__link-item[href='/link3']", text: "Link 3"
  end

  test "renders optional steps, sub steps and optional sub steps" do
    render_component(groups: tasklist)

    assert_select group1 + " .pub-c-task-list__step.pub-c-task-list__step--optional:nth-of-type(1)"
    assert_select group1step1 + " .pub-c-task-list__substep .pub-c-task-list__paragraph", text: "This paragraph is inside a required substep"
    assert_select group2step1 + " .pub-c-task-list__substep.pub-c-task-list__substep--optional .pub-c-task-list__paragraph", text: "This paragraph is inside an optional substep"
  end

  test "renders get help links back to the main task list" do
    render_component(groups: tasklist, task_list_url: "/learn-to-drive")

    assert_select group1step1 + " .pub-c-task-list__help-link[href='/learn-to-drive#group-1-step-1']", text: "Get help completing this step"
    assert_select group2step1 + " .pub-c-task-list__help-link[href='/learn-to-drive#group-2-step-1']", text: "Get help completing this step"
  end

  test "group numbering and step logic is displayed correctly" do
    render_component(groups: tasklist)

    assert_select group1 + " .pub-c-task-list__circle--number", text: "Step 1"
    assert_select group1step2 + " .pub-c-task-list__circle--logic", text: "and"
    assert_select group2 + " .pub-c-task-list__circle--number", text: "Step 2"
    assert_select group2step2 + " .pub-c-task-list__circle--logic", text: "or"
  end

  test "lists have the correct styles" do
    render_component(groups: tasklist)

    assert_select group1step1 + " .pub-c-task-list__links.pub-c-task-list__links--required"
    assert_select group2step1 + " .pub-c-task-list__links.pub-c-task-list__links--choice"
  end

  test "a step can be set to open on page load" do
    render_component(groups: tasklist, show_step: 3)

    assert_select group2 + " .pub-c-task-list__step[data-show]:nth-of-type(1)"
  end

  test "groups and links can have active states" do
    render_component(groups: tasklist, highlight_group: 1)

    assert_select group1 + ".pub-c-task-list__group--active"
    assert_select group2step1 + " .pub-c-task-list__link.pub-c-task-list__link--active .pub-c-task-list__link-item[href='#content']", text: "You are currently viewing: Link 4"
  end

  test "renders a small tasklist" do
    render_component(groups: tasklist, small: true)

    assert_select ".pub-c-task-list"
    assert_select ".pub-c-task-list.pub-c-task-list--large", false
  end
end
