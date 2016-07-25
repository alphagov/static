# GOV.UK components

Shared partials that encapsulate the HTML/CSS/JS for a common UI component.
The component files are centrally hosted on static and exposed to applications via [alphagov/slimmer](https://github.com/alphagov/slimmer).
The partial is exposed over the network, and the CSS/JS are included by the shared templated layout.

The available components and their documentation are exposed by an API at `/templates/govuk_component/docs`, which is consumed by
[alphagov/govuk_component_guide](https://github.com/alphagov/govuk_component_guide) to generate a living styleguide for components.

* a [Partial View](../app/views/govuk_component) - The template logic and markup, also defines the arguments expected
* a [SCSS module](../app/assets/stylesheets/govuk-component) - The styling of the component
* a [Javascript module](../app/assets/javascripts/govuk-component) - JS behaviour of the component
* [Documentation](../app/views/govuk_component/docs) - a `.yml` per component, describing the component and containing fixture data.
* a [unit test](../test/govuk_component) - testing the component renders correctly based on parameters passed in

## Principles behind components

### Encapsulate common UI

GOV.UK Components aim to hide the complexity of a piece of common UI. Putting the templating logic, HTML, CSS and JS behind an abstraction, so that an app rendering a component only needs to know about the parameters to render it with. This is similar to how [React components](https://facebook.github.io/react/index.html) work.

Think of it as a function call in a programming language, as long as the [interface](https://en.wikipedia.org/wiki/Application_programming_interface) doesn't change, then code rendering a component doesn't need to care about the changes.

Here's an example of calling a component. The parameter is `title` with a value of `"My page title"`.

```ruby
<%= render partial: 'govuk_component/title', locals: { title: "My page title" } %>
```

This will output something like:

```html
<div class="govuk-title length-average">
  <h1>My page title</h1>
</div>
```

Apps should treat the output of a component like a [black box](https://en.wikipedia.org/wiki/Black_box), not relying on the internal implementation as it may change (eg, additional CSS based on the `govuk-title` or `h1` selector)

If additional behavior in the component is needed then it should be made in the component itself, then used in an application.

### Distribute via the network

One of the goals of GOV.UK Components is to have consistency between the many different frontend applications. Because of this components live in a central place (the `static` application) and are distributed to the different frontends over the network. This is done via Slimmer, in a similar way to [layout templates](slimmer_templates.md).

This allows a component to be changed and deployed within `static` and each frontend application will automatically fetch a new version of the [component template code](../app/views/govuk_component).

The automatic updating allows changes to be made to every GOV.UK frontend app, without having to manually update and deploy them. With 20+ frontend apps, this makes updating components much easier.

However, this approach does have some costs. It's less explicit, and not as clear how the common component code is included or updated. Changes to the component interface/parameters require [forwards-only migrations](http://engineering.skybettingandgaming.com/2016/02/02/how-we-release-so-frequently/#forward-only-migrations), which for components, would look like this:

- Release a version of static that introduces backwards compatible change to a component
- Migrate all frontends to use new API and stop depending on old one
- Release version of static to remove old implementation for a component

For components of established UI patterns this should be less of an issue.

### Avoid complexity

The parameters to a component should be simple data. This is to make components easier to understand and easier to test. Try to avoid passing complex objects into a component, as this complicates the interface and makes the component harder to reuse. A good rule of thumb for keeping the template logic simple is: "can the template logic be implemented in a simpler templating language like `mustache`", ie, avoiding ERB/ruby features.

A long-term goal is that a component can be extracted out of the GOV.UK Publishing specific `static` repo and moved to a repo usable by wider government, like `govuk_template` or `govuk_frontend_toolkit`.

There are some cases where components can expect a complex object as a parameter, so that logic is not duplicated in each application calling the component, for example the [analytics component](https://github.com/alphagov/static/blob/master/app/views/govuk_component/analytics_meta_tags.raw.html.erb#L2-L33) has complex logic to extract the analytics information from a content item, which can be updated without updating each application.

The component is split into two parts, the complex logic can be thought of as a [Presenter](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter#Pattern_description) and the [simpler part](https://github.com/alphagov/static/blob/master/app/views/govuk_component/analytics_meta_tags.raw.html.erb#L36-L38) as the traditional template (ie, could be extracted out).



## Creating a new component

There's a rails generator you can use to create the basic component files, but it's recommended you read below to understand how it works as well.

```
bundle exec rails generate govuk_component [your-component-name]
```

## How components are structured

Component names should be lowercase and hyphenated. For example: `your-component-name`.

When referenced from an application as a partial they'll be prefixed with `govuk-`. For example: `govuk-your-component-name`.

To match rails view convention the partial itself should use an underscore, rather than a hyphen.

### Views

Views live in `app/views/govuk_component/your_compontent_name.raw.html.erb` - There should be a single root element, with a class name consisting of the prefixed component name. For example:
```
<div class="govuk-your-component-name">
<p>things</p>
</div>
```

_Note_: For consistency with other components, and Rails convention, you should only use `:symbols`, rather than `"strings"`, for object keys.

### Styles

There is a Sass module at `app/stylesheets/govuk-component/_your-component-name.scss` - there should be a single root class, the same class on the root of the partial. For example:
```
.govuk-your-component-name {
  // CSS rules go here.
  p {
    // scoped rules
  }
}
```

Sass modules are included in `app/stylesheets/govuk-component/_component.scss` - which is used in the standard static layout SCSS files (application.scss, header_footer_only.scss)

### Examples and documentation

Documentation lives [`app/views/govuk_component/docs`](../app/views/govuk_component/docs), where each component has a `.yml` file describing:
* `id`: The underscore version of the component name, this is what an app calling the component would use
* `name`: The human name. eg, `Your Example Component`
* `description`: A longer form description of what the component does, when it should be used
* `fixtures`: TBD: For components that expect arguments this will be a hash of fixtured example arguments

Adding it to the documentation will allow you to preview it in the [alphagov/govuk_component_guide](https://github.com/alphagov/govuk_component_guide), which can be pointed to any
version of static, including your local one running a branch. Which you should probably do.

### Unit tests

Unit tests for components live in [`test/govuk_component`](../test/govuk_component). Tests should extend the [`ComponentTestCase`](../test/govuk_component_test_helper.rb) which provides helper methods for rendering a component and for asserting certain markup exists, eg `assert_link_with_text`.
