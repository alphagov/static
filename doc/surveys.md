# Running test surveys on GOV.UK

Across GOV.UK, a "survey" will pop up for one in 50 visitors, asking them what they thought of GOV.UK. This is known as the "user satisfaction survey".

Sometimes, a "small survey" or "test survey" needs to be run across GOV.UK for a short time to evaluate content changes or taxonomy changes.

This can easily be done by adding an entry to `GOVUK.userSurveys.smallSurveys` in `app/assets/javascripts/surveys.js`.

There are sections of the site that should not show any surveys and these can be controlled via the `GOVUK.userSurveys.pathInBlacklist` function in `app/assets/javascripts/surveys.js`.  They are also never shown on "done" pages which can be controlled via the `GOVUK.userSurveys.userCompletedTransaction` function in the same file.

## Example

```javascript
{
  url: 'https://www.surveymonkey.com/s/2AAAAAA/',
  identifier: 'education_only_survey',
  frequency: 50,
  templateArguments: {
    title: "Help us improve GOV.UK",
  },
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
