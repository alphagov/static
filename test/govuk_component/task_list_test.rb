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
          optional: true,
          contents: [
            {
              type: 'paragraph',
              text: 'This is the first paragraph'
            },
            {
              type: 'list',
              links: [
                {
                  path: '/link1',
                  text: 'Link 1',
                },
                {
                  path: '/link2',
                  text: 'Link 2',
                  cost: '&pound;0 to &pound;300'
                },
              ]
            },
            {
              type: 'substep',
            },
            {
              type: 'paragraph',
              text: 'This paragraph is inside a substep'
            },
          ]
        }
      ],
      [
        {
          title: 'Second header',
          contents: [
            {
              type: 'paragraph',
              text: 'This is the second paragraph'
            },
            {
              type: 'list',
              links: [
                {
                  path: '/link3',
                  text: 'Link 3',
                },
              ]
            },
            {
              type: 'substep',
              optional: true
            },
            {
              type: 'paragraph',
              text: 'This paragraph is inside another substep'
            },
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

  test "renders paragraphs" do
    render_component(groups: simple_tasklist)
    assert_select ".pub-c-task-list"

    assert_select group1 + " .pub-c-task-list__step#first-header"
    assert_select group1 + " .pub-c-task-list__title", text: "First header"
    assert_select group1 + " .pub-c-task-list__paragraph", text: "This is the first paragraph"

    assert_select group2 + " .pub-c-task-list__step#second-header"
    assert_select group2 + " .pub-c-task-list__title", text: "Second header"
    assert_select group2 + " .pub-c-task-list__paragraph", text: "This is the second paragraph"
  end

  test "renders links" do
    render_component(groups: simple_tasklist)

    assert_select group1 + " .pub-c-task-list__link-item[href='/link1']", text: "Link 1"
    assert_select group1 + " .pub-c-task-list__link-item[href='/link2']", text: "Link 2"
    assert_select group1 + " .pub-c-task-list__cost", text: "&pound;0 to &pound;300"

    assert_select group2 + " .pub-c-task-list__link-item[href='/link3']", text: "Link 3"
  end

  test "renders optional steps, sub steps and optional sub steps" do
    render_component(groups: simple_tasklist)

    assert_select group1 + " .pub-c-task-list__step.pub-c-task-list__step--optional"
    assert_select group1 + " .pub-c-task-list__substep .pub-c-task-list__paragraph", text: "This paragraph is inside a substep"
    assert_select group2 + " .pub-c-task-list__substep.pub-c-task-list__substep--optional .pub-c-task-list__paragraph", text: "This paragraph is inside another substep"
  end

  test "renders links back to the main task list" do
    render_component(groups: simple_tasklist, task_list_url: "/learn-to-drive")

    assert_select group1 + " .pub-c-task-list__help-link[href='/learn-to-drive#first-header']"
    assert_select group2 + " .pub-c-task-list__help-link[href='/learn-to-drive#second-header']"
  end
end
