# Running test surveys on GOV.UK

Across GOV.UK, a "survey" will pop up for one in 50 visitors, asking them what they thought of GOV.UK. This is known as the "user satisfaction survey".

Sometimes, a "small survey" or "test survey" needs to be run across GOV.UK for a short time to evaluate content changes or taxonomy changes.

This can easily be done by adding an entry to `GOVUK.userSurveys.smallSurveys` in `app/assets/javascripts/surveys.js`.

## Example

```javascript
{
  url: 'https://www.surveymonkey.com/s/2AAAAAA/',
  identifier: 'education_only_survey',
  frequency: 50,
  template: TEMPLATE,
  activeWhen: function() {
    function sectionMatches() {
      return $('meta[property="govuk:section"]').attr('content') === 'education and learning';
    }
    function pageClassMatches() { return $('#page').hasClass('magic-content'); }

    return (sectionMatches() || pageClassMatches());
  },
  startTime: new Date("July 25, 2016").getTime(),
  endTime: new Date("August 3, 2016 23:59:50").getTime()
}
```

## About the data structure

### `url`
This should link to a surveymonkey -- or other survey page -- that allows the visitor to take the survey.

### `identifier`
This is used both as the Google Analytics tag to record events against, and used (after being transformed to camelCase) to set a cookie so a visitor is not prompted to take the survey more than once.

### `frequency`
How frequently to show the survey. A frequency of `1` means the survey shows to every visitor. A frequency of `50` means the survey shows to 1 in 50 visitors.

### `template`
An HTML fragment representing the contents of the survey box. This **MUST** conform to the following minimum structure:

```html
<section id="user-satisfaction-survey" class="visible" aria-hidden="false">
  <div class="wrapper">
    <h1>Heading copy</h1>
    <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">No thanks</a></p>
    <p><a href="javascript:void()" id="take-survey" target="_blank">Link text</a> This will open a short survey on another website</p>
  </div>
</section>
```

### `activeWhen` - OPTIONAL
A callback function returning true or false allowing further scoping of when the survey is considered "active".

In the example above, the survey will only be considered "active" on pages with a section of "education and learning", and will not display on pages where this function evaluates to false.

Not providing this argument has the same effect as setting it to `return true`. The survey will therefore apply to all pages on GOV.UK between `startTime` and `endTime`.

### `startTime` and `endTime`
The survey will only be considered "active" between these dates and times. Where an explicit time is not provided (e.g. startTime) note that JavaScript will assume 00:00:00.000 i.e. just after midnight.
