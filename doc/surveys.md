# Running test surveys on GOV.UK

Across GOV.UK, a "survey" will pop up for one in 50 visitors, asking them what they thought of GOV.UK. This is known as the "user satisfaction survey".

Sometimes, a "small survey" or "test survey" needs to be run across GOV.UK for a short time to evaluate content changes or taxonomy changes.

This can easily be done by adding an entry to `GOVUK.userSurveys.smallSurveys` in `app/assets/javascripts/surveys.js`.

There are sections of the site that should not show any surveys and these can be controlled via the `GOVUK.userSurveys.pathInBlacklist` function in `app/assets/javascripts/surveys.js`.  They are also never shown on "done" pages which can be controlled via the `GOVUK.userSurveys.userCompletedTransaction` function in the same file.

Once a user takes the survey (clicks the link or fills in their email address and submits the form) we set a cookie to say they've taken it (we don't know they've actually taken it, but we assume their interaction means they have).  This cookie is used to make sure we don't show that survey to the user again for ~3 months (90 days).  We also record a session cookie that counts how many times the user has been shown a given survey and if they have already seen it two (this number is configurable) times we don't show it to them again.

## Example

```javascript
{
  url: 'https://www.smartsurvey.co.uk/s/gov-uk',
  identifier: 'education_only_survey',
  frequency: 50,
  template: TEMPLATE,
  activeWhen: {
    section: ['education and learning'],
    path: ['guidance/social-care-common-inspection-framework-sccif-boarding-schools'],
    breadcrumbs: ['Schools'],
    organisation: ['<D106>'],
    matchType: 'include'
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

### `url` - required for both `url` surveys and `email` surveys
Used in a link in the survey that the user is directed to click on. This should be the URL of a smartsurvey -- or other survey page -- that allows the visitor to take the survey. If the url contains the template param `{{currentPath}}` this will be replaced with the current page path.  For example if the `url` param is:

* `https://www.smartsurvey.com/s/2AAAAAA` - it will be left alone and inserted in the template as-is.
* `https://www.smartsurvey.com/s/2AAAAAA?c={{currentPath}}` - will be transformed into `https://www.smartsurvey.com/s/2AAAAAA?c=/government/publications/the-kingdom-of-the-crystal-skull` (assuming the page the survey was shown on was https://www.gov.uk/government/publications/the-kindgom-of-the-crystal-skull).

### `template` - OPTIONAL
This describes the UI that the survey will use to encourage users to sign up.  If omitted the default survey for the `surveyType` will be used.

#### url survey template
An HTML fragment representing the contents of the survey box. This **MUST** conform to the following minimum structure:

```html
<section id="user-satisfaction-survey" class="visible" aria-hidden="false">
  <div class="survey-wrapper">
    <a class="survey-close-button" href="#user-survey-cancel" aria-labelledby="survey-title user-survey-cancel" id="user-survey-cancel" role="button">Close</a>
    <h2 class="survey-title" id="survey-title">Heading copy</h2>
    <p>
      <a class="survey-primary-link" href="javascript:void()" id="take-survey" target="_blank" rel="noopener noreferrer">Link text</a>
      This will open a short survey on another website
    </p>
  </div>
</section>
```

The `#user-survey-cancel` and `#take-survey` elements are required as the surveys code will expect these elements for setting cookies and tracking user behaviour.

#### email survey template
An HTML fragment representing the interactive UI for entering an email address.  We expect something like the following:

```html
<section id="user-satisfaction-survey" class="visible" aria-hidden="false">
  <div class="survey-wrapper">
    <a class="survey-close-button" href="#user-survey-cancel" aria-labelledby="survey-title user-survey-cancel" id="user-survey-cancel" role="button">Close</a>
    <h2 class="survey-title" id="survey-title">Heading copy</h2>
    <div id="email-survey-pre">
      <a class="survey-primary-link" href="#email-survey-form" id="email-survey-open" rel="noopener noreferrer" role="button" aria-expanded="false">
       Invite to take survey text
      </a>
    </div>
    <form id="email-survey-form" action="/contact/govuk/email-survey-signup" method="post" class="js-hidden" aria-hidden="true">
      <div class="survey-inner-wrapper">
        <div id="survey-form-description" class="survey-form-description">Description of survey text</div>
        <label class="survey-form-label" for="survey-email-address">
          Email Address
        </label>
        <input name="email_survey_signup[survey_id]" type="hidden" value="">
        <input name="email_survey_signup[survey_source]" type="hidden" value="">
        <input class="survey-form-input" name="email_survey_signup[email_address]" id="survey-email-address" type="text" aria-describedby="survey-form-description">
        <button class="survey-form-button" type="submit">Send me the survey</button>
        <a href="javascript:void()" id="take-survey" target="_blank" rel="noopener noreferrer">Invite to take survey without email text</a>
      </div>
    </form>
    <div id="email-survey-post-success" class="js-hidden" aria-hidden="true" tabindex="-1">
      Successful email delivery text
    </div>
    <div id="email-survey-post-failure" class="js-hidden" aria-hidden="true" tabindex="-1">
      Failed to delivery email text
    </div>
  </div>
</section>
```

Behaviour will be added so that clicking the `#email-survey-open` element hides the `#email-survey-pre` container and opens the `#email-survey-form` container.  Submitting the form will hide the `#email-survey-form` container and show the `#email-survey-post-success` or `#email-survey-post-failure` container depending on what happens when submitting the form via AJAX.  The `survey_id` and `survey_source` inputs will be filled in with the appropriate elements.  The `#user-survey-cancel` element is also required for dismissing the UI if the form is open or closed.  Successfully submitting the form or dismissing the UI will set cookies to avoid re-showing the UI to the user again.

#### Writing custom templates

In most cases it is ok to just reuse the defaults, but if you must write your own you can follow the examples above and make use of the functions `templateBase` and `takeSurveyLink`.  These make sure the correct boilerplate code is present.

### `activeWhen` - OPTIONAL
By default a survey will run on all pages on GOV.UK. If you specify parameters in the `activeWhen` we limit which pages the survey will appear on. There are five params, all are optional:

* `matchType` - (optional) the default is "include".  This tells us how to interpret the other params.  For "include" we treat the params as limiting the survey to only display on those pages that match one or more of the params.  For "exclude" we treat the params as limiting the survey to only display on those pages that do not match any of the params.  If the value is other than "include" or "exclude" it is assumed to be "include".
* `path` - (optional).  If present this is used to match complete path segments in the path of the page.  Each entry is turned into a regexp as follows: `statistcis` becomes `/\/statistics(\/|$)/` and this means that a value of "statistics" would match a path like "/government/statistics/a-very-large-report", but not a path like "/guidance/how-to-download-statistics-and-announcements".  If you use regex special characters `^` or `$` then the string is not changed before being turned into a regexp to match paths.
* `breadcrumb` - (optional).  If present this is used to match against the text in the `.govuk-breadcrumb` element on the page.  The text match is case-insensitive and does not attempt to match complete words so `hats` would match `Hats` and `Chats`.
* `section` - (optional).  If present this is used to match against the value of the content attribute of the `govuk:section` meta tag on the page.  The text match is case-insensitive and does not attempt to match complete words so `hats` would match `Hats` and `Chats`.
* `organisation` - (optional).  If present this is used to match against the value of the content attribute of the `govuk:analytics:organisations` meta tag on the page.  The text match is case-sensitive and does not attempt to match complete words so `hats` would match `hats` and `Chats`, but not `Hats`.

Other than `matchType`, all params are specified as arrays, allowing multiple possible values.  All values are OR'd together so that only one of them has to match, not all of them.

In the example above, the survey will only be considered "active" on pages with any of:

1. a govuk:section meta tag with "education and learning",
2. a path that includes `guidance/social-care-common-inspection-framework-sccif-boarding-schools`
3. a govuk:analytics:organisation that includes `<D106>`
4. the word `Schools` appearing in the text of the `.govuk-breadcrumb` element on the page

Not providing any `activeWhen` parameters, or providing an empty `activeWhen` parameter will apply the survey to all pages on GOV.UK between `startTime` and `endTime`, so take care when doing this.

### `startTime` and `endTime`
The survey will only be considered "active" between these dates and times. Where an explicit time is not provided (e.g. startTime) note that JavaScript will assume 00:00:00.000 i.e. just after midnight.

### `surveySeenTooManyTimesLimit` - OPTIONAL (default: 2)
We record how many times a given survey is shown to a user and won't show it again if they've seen it too many times.  The default for that limit is 2 (e.g. we show it 2 times, but not 3 or more) but you can change that by adding a custom value here.  The custom value should be a positive integer or the string `unlimited` (this means the survey should always show regardless of how many times it's been shown).  Any other value is ignored and treated as the default of 2.

## Testing Surveys
If you need to force a particular survey to display – for example for testing – you can call  e.g. `GOVUK.userSurveys.displaySurvey(GOVUK.userSurveys.defaultSurvey)` or `GOVUK.userSurveys.displaySurvey(GOVUK.userSurveys.smallSurveys[0])` from your browser console.
