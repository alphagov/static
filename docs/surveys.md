# Running test surveys on GOV.UK

Across GOV.UK, a "survey" will pop up for one in 50 visitors, asking them what they thought of GOV.UK. This is known as the "user satisfaction survey".

Sometimes, a "small survey" or "test survey" needs to be run across GOV.UK for a short time to evaluate content changes or taxonomy changes.

This can easily be done by adding an entry to `GOVUK.userSurveys.smallSurveys` in `app/assets/javascripts/surveys.js`.

There are sections of the site that should not show any surveys and these can be controlled via the `GOVUK.userSurveys.pathInBlocklist` function in `app/assets/javascripts/surveys.js`. They are also never shown on "done" pages which can be controlled via the `GOVUK.userSurveys.userCompletedTransaction` function in the same file.

Once a user takes the survey (clicks the link or fills in their email address and submits the form) we set a cookie to say they've taken it (we don't know they've actually taken it, but we assume their interaction means they have). This cookie is used to make sure we don't show that survey to the user again for ~3 months (90 days). We also record a session cookie that counts how many times the user has been shown a given survey and if they have already seen it two (this number is configurable) times we don't show it to them again.

## Example

```javascript
{
  url: 'https://www.smartsurvey.co.uk/s/gov-uk',
  identifier: 'education_only_survey',
  frequency: 50,
  templateArgs: {
    title: "Help us improve GOV.UK",
  }
  activeWhen: {
    section: ['education and learning'],
    path: ['guidance/social-care-common-inspection-framework-sccif-boarding-schools'],
    breadcrumb: ['Schools'],
    organisation: ['<D106>'],
    matchType: 'include'
  },
  startTime: new Date("July 25, 2016").getTime(),
  endTime: new Date("August 3, 2016 23:59:50").getTime()
}
```

## About the data structure

### `identifier`
This is used (after being transformed to camelCase) to set a cookie so a visitor is not prompted to take the survey more than once. It was also previously used as a tag to record events against in old analytics code.

### `frequency`
How frequently to show the survey. A frequency of `1` means the survey shows to every visitor. A frequency of `50` means the survey shows to 1 in 50 visitors.

### `surveyType` - OPTIONAL (default: 'url')
What type of survey is this. Currently either `url` or `email` is supported. `url` surveys present the user with a link that takes them direct to a survey to fill in. `email` surveys present the user some UI to let them enter their email address and be sent more information to that address about how to take part in the survey.

Note that for `email` surveys the users email is submitted back to the [feedback](https://github.com/alphagov/feedback) app which actually sends the email. The email address is sent with the `identifier` of the survey and this identifier must match with the `id` of a survey defined in [`app/models/email_survey.rb`](https://github.com/alphagov/feedback/blob/85e07b0c572a91be02b64af1d551df313f2695f9/app/models/email_survey.rb#L24). Make sure you define the survey in both `static` and `feedback`.

### `url` - required for both `url` surveys and `email` surveys
Used in a link in the survey that the user is directed to click on. This should be the URL of a smartsurvey -- or other survey page -- that allows the visitor to take the survey. If the url contains the template param `{{currentPath}}` this will be replaced with the current page path. For example if the `url` param is:

* `https://www.smartsurvey.com/s/2AAAAAA` - it will be left alone and inserted in the template as-is.
* `https://www.smartsurvey.com/s/2AAAAAA?c={{currentPath}}` - will be transformed into `https://www.smartsurvey.com/s/2AAAAAA?c=/government/publications/the-kingdom-of-the-crystal-skull` (assuming the page the survey was shown on was https://www.gov.uk/government/publications/the-kindgom-of-the-crystal-skull).


The value can be an array of URLs, in which case the URL to use will
be chosen randomly from the array.

#### `templateArgs` for `url` survey
The template for a url survey is as follows:

```html
<section id="user-satisfaction-survey" class="visible" aria-hidden="false">
  <div class="survey-wrapper">
    <a class="survey-close-button" href="#user-survey-cancel" aria-labelledby="survey-title user-survey-cancel" id="user-survey-cancel" role="button">Close</a>
    <h2 class="survey-title" id="survey-title">{{title}}</h2>
    <p>
      <a class="survey-primary-link" href="{{surveyUrl}}" id="take-survey" target="_blank" rel="noopener noreferrer">{{surveyCta}}</a>
      {{surveyCtaPostscript}}
    </p>
  </div>
</section>
```

This HTML template would be matched by a JS template in `surveys.js`, e.g.

```javascript
{
   identifier: 'your-identifier-goes-here',
   surveyType: 'url',
   frequency: 6,
   startTime: new Date('January 17, 2018').getTime(),
   endTime: new Date('January 19, 2018 23:59:50').getTime(),
   url: 'url-for-survey-goes-here',
   templateArgs: {
     title: 'Help us make things easier to find on GOV.UK',
     surveyCta: 'Answer 2 quick questions',
     surveyCtaPostscript: 'This activity will open into a separate window.'
   },
   allowedOnMobile: true
 }
```

The behaviour of the HTML template is that clicking the `#take-survey` link hides the survey banner. Clicking the link, or dismissing the UI via `#user-survey-cancel` will set cookies to avoid re-showing the UI for this survey to the user again.

The parts of the template wrapped in braces are dynamic and are replaced at runtime.  The following are customisable via `templateArgs`:

* title - (optional) the default is "Tell us what you think of GOV.UK"
* surveyCta - (optional) the default is "Take the 3 minute survey"; clicking this takes the user to the survey specified by the `url` of the survey
* surveyCtaPostscript - (optional) the default is "This will open a short survey on another website"

The following are not customisable via `templateArgs`, but are calculated:

* surveyUrl - this is filled in using the `url` argument on the survey.  If it is a smartsurvey url the current path will be added as a `c` param in the querystring.


#### `templateArgs` for `email` survey
The template for a url survey is as follows:

```html
<section id="user-satisfaction-survey" class="visible" aria-hidden="false">
  <div class="survey-wrapper">
    <a class="survey-close-button" href="#user-survey-cancel" aria-labelledby="survey-title user-survey-cancel" id="user-survey-cancel" role="button">Close</a>
    <h2 class="survey-title" id="survey-title">{{title}}</h2>
    <div id="email-survey-pre">
      <a class="survey-primary-link" href="{{surveyUrl}}" id="email-survey-open" rel="noopener noreferrer" role="button" aria-expanded="false">
       {{surveyCta}}
      </a>
    </div>
    <form id="email-survey-form" action="/contact/govuk/email-survey-signup" method="post" class="js-hidden" aria-hidden="true">
      <div class="survey-inner-wrapper">
        <div id="survey-form-description" class="survey-form-description">{{surveyFormDescription}}\
           <br> {{surveyFormCtaPostscript}}
        </div>
        <label class="survey-form-label" for="survey-email-address">
          Email Address
        </label>
        <input name="email_survey_signup[survey_id]" type="hidden" value="{{surveyId}}">
        <input name="email_survey_signup[survey_source]" type="hidden" value="{{surveySource}}">
        <input class="survey-form-input" name="email_survey_signup[email_address]" id="survey-email-address" type="text" aria-describedby="survey-form-description">
        <button class="survey-form-button" type="submit">{{surveyFormCta}}</button>
        <a href="javascript:void()" id="take-survey" target="_blank" rel="noopener noreferrer">{{surveyFormNoEmailInvite}}</a>
      </div>
    </form>
    <div id="email-survey-post-success" class="js-hidden" aria-hidden="true" tabindex="-1">
      {{surveySuccess}}
    </div>
    <div id="email-survey-post-failure" class="js-hidden" aria-hidden="true" tabindex="-1">
      {{surveyFailure}}
    </div>
  </div>
</section>
```

This would be matched by a snippet in `surveys.js`, e.g.

```javascript
{
    identifier: 'your-identifier-goes-here',
    surveyType: 'email',
    frequency: 6,
    startTime: new Date('January 22, 2018').getTime(),
    endTime: new Date('January 23, 2018 23:59:50').getTime(),
    url: 'https://signup.take-part-in-research.service.gov.uk/contact?utm_campaign=crowd-banner&utm_source=Other&utm_medium=gov.uk&t=GDS&id=119',
    templateArgs: {
      title: 'Tell us what you think of GOV.UK',
      surveyCta: 'Take a short survey to give us your feedback',
      surveyFormDescription: 'We’ll send you a link to a feedback form. It only takes 2 minutes to fill in.',
      surveyFormCta: 'Send me the survey',
      surveyFormCtaPostscript: 'Don’t worry: we won’t send you spam or share your email address with anyone.',
      surveyFormNoEmailInvite: 'Don’t have an email address?',
      surveySuccess: 'Thanks, we’ve sent you an email with a link to the survey.',
      surveyFailure: 'Sorry, we’re unable to send you an email right now. Please try again later.'
    },
    allowedOnMobile: true
}
```

The behaviour of the HTML template is that clicking the `#email-survey-open` element hides the `#email-survey-pre` container and opens the `#email-survey-form` container.  Submitting the form will hide the `#email-survey-form` container and show the `#email-survey-post-success` or `#email-survey-post-failure` container depending on what happens when submitting the form via AJAX. Successfully submitting the form or dismissing the UI via `#survey-no-thanks` or `#email-survey-cancel` will set cookies to avoid re-showing the UI for this survey to the user again.

The parts of the template wrapped in braces are dynamic and are replaced at runtime.  The following are customisable via `templateArgs`:

* title - (optional) the default is "Tell us what you think of GOV.UK"
* surveyCta - (optional) the default is "Your feedback will help us improve this website" - clicking this will open the form to ask for the email address
* surveyFormCta - (optional) the default is "Send" - clicking this will submit the form to the [feedback](https://github.com/alphagov/feedback) application and if successful send the user an email to the survey
* surveyFormCtaPostscript - (optional) the default is "We won’t store your email address or share it with anyone"
* surveyFormNoEmailInvite - (optional) the default is "Don’t have an email address?"
* surveySuccess - (optional) the default is "Thanks, we’ve sent you an email with a link to the survey." - this is shown if the form submission succeeds and will set a cookie to not show the survey again for 4 months
* surveyFailure - (optional) the default is "Sorry, we’re unable to send you an email right now.  Please try again later." - this is shown if the form submission succeeds, it does not set a cookie so they can try again if they see the survey.

The following are not customisable via `templateArgs`, but are calculated:

* surveyId - this is filled in with the `identifier` of the survey
* surveySource - this is filled in with the current path

#### Writing custom templates

In most cases it is ok to just reuse the defaults, but if you must write your own you can follow the examples above and make use of the functions `templateBase` and `takeSurveyLink`. These make sure the correct boilerplate code is present.

### `activeWhen` - OPTIONAL
By default a survey will run on all pages on GOV.UK. If you specify parameters in the `activeWhen` we limit which pages the survey will appear on. There are five params, all are optional:

* `matchType` - (optional) the default is "include". This tells us how to interpret the other params. For "include" we treat the params as limiting the survey to only display on those pages that match one or more of the params. For "exclude" we treat the params as limiting the survey to only display on those pages that do not match any of the params. If the value is other than "include" or "exclude" it is assumed to be "include".
* `path` - (optional). If present this is used to match complete path segments in the path of the page. Each entry is turned into a regexp as follows: `statistcis` becomes `/\/statistics(\/|$)/` and this means that a value of "statistics" would match a path like "/government/statistics/a-very-large-report", but not a path like "/guidance/how-to-download-statistics-and-announcements". If you use regex special characters `^` or `$` then the string is not changed before being turned into a regexp to match paths.
* `breadcrumb` - (optional). If present this is used to match against the text in the `.govuk-breadcrumb` element on the page. The text match is case-insensitive and does not attempt to match complete words so `hats` would match `Hats` and `Chats`.
* `section` - (optional). If present this is used to match against the value of the content attribute of the `govuk:section` (old style mainstream navigation hierarchy) and `govuk:themes` (new style taxonomy-based navigation hierarchy) meta tags on the page. The text match is case-insensitive and does not attempt to match complete words so `hats` would match `Hats` and `Chats`.  Note that `govuk:section` usually contains `Human Readable` values, whereas `govuk:themes` usually contains `machine-readable` values, but the matcher does not try to normalise these values, so bear that in mind while using this to target a survey.
* `organisation` - (optional). If present this is used to match against the value of the content attribute of the `govuk:analytics:organisations` meta tag on the page. The text match is case-sensitive and does not attempt to match complete words so `hats` would match `hats` and `Chats`, but not `Hats`. You can find the organisation's analytics identifier using the content store, e.g. for HM Revenue Customs ([api/content/government/organisations/hm-revenue-customs](https://www.gov.uk/api/content/government/organisations/hm-revenue-customs)), the identifier is `D25`. This would typically be represented as `<D25>` in the meta tag.
* `tlsCookieVersionLimit` - (optional). If present this is used to compare the TLS version stored in the `TLSVersion` cookie.

Other than `matchType`, all params are specified as arrays, allowing multiple possible values. All values are OR'd together so that only one of them has to match, not all of them.

In the example above, the survey will only be considered "active" on pages with any of:

1. a govuk:section meta tag with "education and learning",
2. a path that includes `guidance/social-care-common-inspection-framework-sccif-boarding-schools`
3. a govuk:analytics:organisation that includes `<D106>`
4. the word `Schools` appearing in the text of the `.govuk-breadcrumb` element on the page

Not providing any `activeWhen` parameters, or providing an empty `activeWhen` parameter will apply the survey to all pages on GOV.UK between `startTime` and `endTime`, so take care when doing this.

#### Performance considerations

Remember that the decision to show a survey or not is done on the client browser and happens on every request.  We first throw away any surveys that haven't started yet, or have ended already and then we check the `activeWhen` parameters.  So if you have a survey with lots of parameters and values in `activeWhen` this could cause performance issues for the browser so you should be careful when describing which pages the survey should appear on.  If you have 100s of pages to run the survey on, can you target them all by a single breadcrumb or organisation instead of doing 100s of path comparisons?  If none of the parameters can be combined to cover all the pages without requiring lots of comparisons you may need to add new parameter types to the surveys code, or come up with a different set of pages to target.

### TLS Version detection ###

There is a special survey we can add which will check whether a user has an out of date version of TLS running (under 1.2 is considered insecure). In this case, we set the survey to be active by adding the `tlsCookieVersionLimit` parameter in `activeWhen`:
activeWhen: {
  tlsCookieVersionLimit: [
    1.2
  ]
}

### `allowedOnMobile` ###

This parameter is optional. If it is:
- set to `true` the survey will be displayed on both mobile and desktop
- set to `false` OR omitted entirely will result in the survey being hidden on mobile, but shown on desktop.

### `startTime` and `endTime`
The survey will only be considered "active" between these dates and times. Where an explicit time is not provided (e.g. startTime) note that JavaScript will assume 00:00:00.000 i.e. just after midnight.

### `surveySeenTooManyTimesLimit` - OPTIONAL (default: 2)
We record how many times a given survey is shown to a user and won't show it again if they've seen it too many times. The default for that limit is 2 (e.g. we show it 2 times, but not 3 or more) but you can change that by adding a custom value here. The custom value should be a positive integer or the string `unlimited` (this means the survey should always show regardless of how many times it's been shown). Any other value is ignored and treated as the default of 2.

## Testing Surveys
You can test if the surveys work locally by starting up the various rendering apps needed for the GOVUK page that you want the survey to be appear on. e.g.
A link for "government/policies" requires the `finder-frontend` app, so you would need to call `bowl finder-frontend` in the development VM. You can check which rendering app is needed by going to `www.gov.uk/api/content/<path here>`, e.g. `www.gov.uk/api/content/government/policies`

Usually it would be enough to call `bowl frontend government-frontend finder-frontend whitehall router`

The `router` at the end allows you to access the link by `www.dev.gov.uk` in your browser. Following on from the previous example you could go to `www.dev.gov.uk/government/policies` to check if the survey will appear.

You can check if the `activeWhen paths` for your survey are correct by typing `GOVUK.userSurveys.pathMatch(<insert path here>)` into the browser console on the page. A return of `true` indicates that path matches.

You can check if the survey is still active by typing `GOVUK.userSurveys.getActiveSurveys(GOVUK.userSurveys.smallSurveys)`. This returns an array of active small surveys.

If you need to force a particular survey to display – for example for testing – you can call  e.g. `GOVUK.userSurveys.displaySurvey(GOVUK.userSurveys.defaultSurvey)` or `GOVUK.userSurveys.displaySurvey(GOVUK.userSurveys.smallSurveys[0])` from your browser console.
