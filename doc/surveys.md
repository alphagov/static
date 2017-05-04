# Running test surveys on GOV.UK

Across GOV.UK, a "survey" will pop up for one in 50 visitors, asking them what they thought of GOV.UK. This is known as the "user satisfaction survey".

Sometimes, a "small survey" or "test survey" needs to be run across GOV.UK for a short time to evaluate content changes or taxonomy changes.

This can easily be done by adding an entry to `GOVUK.userSurveys.smallSurveys` in `app/assets/javascripts/surveys.js`.

There are sections of the site that should not show any surveys and these can be controlled via the `GOVUK.userSurveys.pathInBlacklist` function in `app/assets/javascripts/surveys.js`.  They are also never shown on "done" pages which can be controlled via the `GOVUK.userSurveys.userCompletedTransaction` function in the same file.

## Example

```javascript
{
  url: 'https://www.smartsurvey.co.uk/s/gov-uk',
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

### `identifier`
This is used both as the Google Analytics tag to record events against, and used (after being transformed to camelCase) to set a cookie so a visitor is not prompted to take the survey more than once.

### `frequency`
How frequently to show the survey. A frequency of `1` means the survey shows to every visitor. A frequency of `50` means the survey shows to 1 in 50 visitors.

### `surveyType` - OPTIONAL (default: 'url')
What type of survey is this.  Currently either `url` or `email` is supported.  `url` surveys present the user with a link that takes them direct to a survey to fill in.  `email` surveys present the user some UI to let them enter their email address and be sent more information to that address about how to take part in the survey.

Note that for `email` surveys the users email is submitted back to the [feedback](https://github.com/alphagov/feedback) app which actually sends the email.  The email address is sent with the `identifier` of the survey and this identifier must match with the `id` of a survey defined in [`app/models/email_survey.rb`](https://github.com/alphagov/feedback/blob/85e07b0c572a91be02b64af1d551df313f2695f9/app/models/email_survey.rb#L24).  Make sure you define the survey in both `static` and `feedback`.

### `url` - required for `url` surveys
This should link to a smartsurvey -- or other survey page -- that allows the visitor to take the survey.

### `template` - OPTIONAL
This describes the UI that the survey will use to encourage users to sign up.  If omitted the default survey for the `surveyType` will be used.

#### url survey template
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

The `#survey-no-thanks` and `#take-survey` elements are required as the surveys code will expect these elements for setting cookies and tracking user behaviour.

#### email survey template
An HTML fragment representing the interactive UI for entering an email address.  We expect something like the following:

```html
<section id="user-satisfaction-survey" class="visible" aria-hidden="false">
  <div id="email-survey-pre" class="wrapper">
    <h1>Tell us what you think of GOV.UK</h1>
    <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">No thanks</a></p>
    <p><a href="#email-survey-form" id="email-survey-open" rel="noopener noreferrer">Your feedback will help us improve this website</a></p>
  </div>
  <form id="email-survey-form" action="/contact/govuk/email-survey-request" method="post" class="wrapper js-hidden" aria-hidden="true">
    <div id="feedback-prototype-form">
      <h1>We'd like to hear from you</h1>
      <p class="right"><a href="#email-survey-cancel" id="email-survey-cancel">No thanks</a></p>
      <label for="email">Tell us your email address and we'll send you a link to a quick feedback form.</label>
      <input name="survey_id" type="hidden" value="">
      <input name="survey_source" type="hidden" value="">
      <input name="email" type="text" placeholder="Your email address">
      <div class="actions">
        <button class="button">Send</button>
        <p class="button-info">We won't store your email address or share it with anyone</span>
      </div>
    </div>
  </form>
  <div id="email-survey-post-success" class="wrapper js-hidden" aria-hidden="true">
    <p>Thanks, we\'ve sent you an email with a link to the survey.</p>
  </div>
  <div id="email-survey-post-failure" class="wrapper js-hidden" aria-hidden="true">
    <p>Sorry, we’re unable to send you an email right now.  Please try again later.</h2>
  </div>
</section>
```

Behaviour will be added so that clicking the `#email-survey-open` element hides the `#email-survey-pre` container and opens the `#email-survey-form` container.  Submitting the form will hide the `#email-survey-form` container and show the `#email-survey-post-success` or `#email-survey-post-failure` container depending on what happens when submitting the form via AJAX.  The `survey_id` and `survey_source` inputs will be filled in with the appropriate elements.  The `#survey-no-thanks` and `#email-survey-cancel` are also required for dismissing the UI.  Successfully submitting the form or dismissing the UI will set cookies to avoid re-showing the UI to the user again.

### `activeWhen` - OPTIONAL
A callback function returning true or false allowing further scoping of when the survey is considered "active".

In the example above, the survey will only be considered "active" on pages with a section of "education and learning", and will not display on pages where this function evaluates to false.

Additional examples of functions which control when a survey should be active based on the current path and organisation:

```javascript
function pathMatches() {
  var pathMatchingExpr = /\/foreign-travel-advice|\/government\/world/;
  return pathMatchingExpr.test(currentPath());
}

function organisationMatches() {
  var orgMatchingExpr = /<D13>|<OT554>|<D8>|<D1196>/;
  var metaText = $('meta[name="govuk:analytics:organisations"]').attr('content') || "";
  return orgMatchingExpr.test(metaText);
}
```

Not providing the `activeWhen` argument has the same effect as setting it to `return true`. The survey will therefore apply to all pages on GOV.UK between `startTime` and `endTime`.

### `startTime` and `endTime`
The survey will only be considered "active" between these dates and times. Where an explicit time is not provided (e.g. startTime) note that JavaScript will assume 00:00:00.000 i.e. just after midnight.
