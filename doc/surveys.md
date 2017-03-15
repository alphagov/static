# Running test surveys on GOV.UK

Across GOV.UK, a "survey" will pop up for one in 50 visitors, asking them what they thought of GOV.UK. This is known as the "user satisfaction survey", or "default survey".

Sometimes, we want to run some other survey across a different set of pages across GOV.UK for a short time to evaluate content changes or taxonomy changes.

This can easily be done by adding an entry to `app/views/surveys/_survey_definitions.html.erb`.

There are sections of the site that should not show any surveys and these can be controlled via the `GOVUK.userSurveys.pathInBlacklist` function in `app/assets/javascripts/surveys.js`.  They are also never shown on "done" pages which can be controlled via the `GOVUK.userSurveys.userCompletedTransaction` function in the same file.

## Example

```html
<script type="application/json" data-survey>
  {
    "url": "https://www.surveymonkey.com/s/2AAAAAA/",
    "identifier": "education_only_survey",
    "frequency": 50,
    "templateArguments": {
      "title": "Help us improve GOV.UK",
    },
    "activeWhen": {
      "section": ["education and learning"],
      "path": ["guidance/social-care-common-inspection-framework-sccif-boarding-schools"],
      "breadcrumbs": ["Schools"],
      "organisation": ["<D106>"],
      "matchType": "include"
    },
    "startTime": "July 25, 2016",
    "endTime": "August 3, 2016 23:59:50"
  }
</script>
```

Any script tag with the `data-survey` attribute will be read in as a potential survey to run, the default survey has the `data-survey-default` attribute on its script tag instead of `data-survey`.

## About the data structure

### `identifier`
This is used both as the Google Analytics tag to record events against, and used (after being transformed to camelCase) to set a cookie so a visitor is not prompted to take the survey more than once.

### `frequency`
How frequently to show the survey. A frequency of `1` means the survey shows to every visitor. A frequency of `50` means the survey shows to 1 in 50 visitors.

### `surveyType` - OPTIONAL (default: 'url')
What type of survey is this.  Currently either `url` or `email` is supported.  `url` surveys present the user with a link that takes them direct to a survey to fill in.  `email` surveys present the user some UI to let them enter their email address and be sent more information to that address about how to take part in the survey.

Note that for `email` surveys the users email is submitted back to the [feedback](https://github.com/alphagov/feedback) app which actually sends the email.  The email address is sent with the `identifier` of the survey and this identifier must match with the `id` of a survey defined in [`app/models/email_survey.rb`](https://github.com/alphagov/feedback/blob/85e07b0c572a91be02b64af1d551df313f2695f9/app/models/email_survey.rb#L24).  Make sure you define the survey in both `static` and `feedback`.

### `url` - required for `url` surveys
This should link to a surveymonkey -- or other survey page -- that allows the visitor to take the survey.

### `templateArguments` - OPTIONAL
This allows you to customise the text in the survey.  The available options for customisation are based on the `surveyType`

#### `templateArguments` for `url` survey
The template for a url survey is as follows:

```html
<section id="user-satisfaction-survey" class="visible" aria-hidden="false">
  <div class="wrapper">
    <h1>{{title}}</h1>
    <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">{{noThanks}}</a></p>
    <p><a href="" id="take-survey" target="_blank">{{surveyCta}}</a> {{surveyCtaPostscript}}</p>
  </div>
</section>
```

The behaviour of this template is that clicking the `#take-survey` link hides the survey banner.  Clicking the link, or dismissing the UI via `#survye-no-thanks` will set cookies to avoid re-showing the UI for this survey to the user again.

The parts of the template wrapped in braces are dynamic and are replaced at runtime.  The following are customisable via `templateArguments`:

* title - (optional) the default is "Tell us what you think of GOV.UK"
* noThanks - (optional) the default is "No thanks"; clicking this dismisses the banner and sets a cookie to not show it again for 4 months
* surveyCta - (optional) the default is "Take the 3 minute survey"; clicking this takes the user to the survey specified by the `url` of the survey
* surveyCtaPostscript - (optional) the default is "This will open a short survey on another website"

The following are not customisable via `templateArguments`, but are calculated:

* surveyUrl - this is filled in using the `url` argument on the survey.  If it is a surveymonkey url the current path will be added as a `c` param in the querystring.

#### `templateArguments` for `email` survey
The template for a url survey is as follows:

```html
<section id="user-satisfaction-survey" class="visible" aria-hidden="false">
  <div id="email-survey-pre" class="wrapper">
    <h1>{{title}}</h1>
    <p class="right"><a href="#survey-no-thanks" id="survey-no-thanks">{{noThanks}}</a></p>
    <p><a href="#email-survey-form" id="email-survey-open" rel="noopener noreferrer">{{surveyCta}}</a></p>
  </div>
  <form id="email-survey-form" action="/contact/govuk/email-survey-signup" method="post" class="wrapper js-hidden" aria-hidden="true">
    <div id="feedback-prototype-form">
      <h1>{{surveyFormTitle}}</h1>
      <p class="right"><a href="#email-survey-cancel" id="email-survey-cancel">{{noThanks}}</a></p>
      <label for="email">{{surveyFormEmailLabel}}</label>
      <input name="email_survey_signup[survey_id]" type="hidden" value="{{surveyId}}">
      <input name="email_survey_signup[survey_source]" type="hidden" value="{{surveySource}}">
      <input name="email_survey_signup[email_address]" type="text" placeholder="Your email address">
      <div class="actions">
        <button type="submit">{{surveyFormCta}}</button>
        <p class="button-info">{{surveyFormCtaPostscript}}</p>
      </div>
    </div>
  </form>
  <div id="email-survey-post-success" class="wrapper js-hidden" aria-hidden="true">
    <p>{{surveySuccess}}</p>
  </div>
  <div id="email-survey-post-failure" class="wrapper js-hidden" aria-hidden="true">
    <p>{{surveyFailure}}</p>
  </div>
</section>
```

The behaviour of this template is that clicking the `#email-survey-open` element hides the `#email-survey-pre` container and opens the `#email-survey-form` container.  Submitting the form will hide the `#email-survey-form` container and show the `#email-survey-post-success` or `#email-survey-post-failure` container depending on what happens when submitting the form via AJAX.  Successfully submitting the form or dismissing the UI via `#survey-no-thanks` or `#email-survey-cancel` will set cookies to avoid re-showing the UI for this survey to the user again.

The parts of the template wrapped in braces are dynamic and are replaced at runtime.  The following are customisable via `templateArguments`:

* title - (optional) the default is "Tell us what you think of GOV.UK"
* noThanks - (optioanl) the default is "No thanks" - clicking either of these will dismiss the banner and sets a cookie to not show it again for 4 months
* surveyCta - (optional) the default is "Your feedback will help us improve this website" - clicking this will open the form to ask for the email address
* surveyFormTitle - (optional) the default is "We’d like to hear from you"
* surveyFormEmailLabel - (optional) the default is "Tell us your email address and we’ll send you a link to a quick feedback form."
* surveyFormCta - (optional) the default is "Send" - clicking this will submit the form to the [feedback](https://github.com/alphagov/feedback) application and if successful send the user an email to the survey
* surveyFormCtaPostscript - (optional) the default is "We won’t store your email address or share it with anyone"
* surveySuccess - (optional) the default is "Thanks, we’ve sent you an email with a link to the survey." - this is shown if the form submission succeeds and will set a cookie to not show the survey again for 4 months
* surveyFailure - (optional) the default is "Sorry, we’re unable to send you an email right now.  Please try again later." - this is shown if the form submission succeeds, it does not set a cookie so they can try again if they see the survey.

The following are not customisable via `templateArguments`, but are calculated:

* surveyId - this is filled in with the `identifier` of the survey
* surveySource - this is filled in with the current path

### `activeWhen` - OPTIONAL
By default a survey will run on all pages on GOV.UK.  If you specify parameters in the `activeWhen` we limit which pages the survey will appear on.  There are five params, all are optional:

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

### `startTime` and `endTime`
The survey will only be considered "active" between these dates and times. These strings are passed into `new Date(...)` to parse them into real times, so note that where an explicit time is not provided (e.g. startTime) this will assume 00:00:00.000 i.e. just after midnight.
