# Analytics

The analytics code for GOV.UK (including the documentation) has now been migrated to [govuk_publishing_components](https://github.com/alphagov/govuk_publishing_components/blob/master/docs/analytics.md) and is now pulled into static from there.

## Adding domains to GOV.UK's cross domain linker

Once a service starts sending analytics data to the shared GA property and has configured their system to include `www.gov.uk` in their cross domain linking, we must also configure `www.gov.uk` to include their domain in our cross linker configuration.

Add the domain of the service to the `linkedDomains` var in [`analytics.js.erb`](https://github.com/alphagov/static/blob/master/app/assets/javascripts/analytics.js.erb).

Only the domain should be added, GA will ignore any path details e.g. `/government/service/`

Note that GA matches subdomains of any domains added this way. So `passport.service.gov.uk` also includes `www.passport.service.gov.uk`.

On that basis the simplest course of action would appear to be to simply add `gov.uk` or even `service.gov.uk` and then it'll just match everything we want it to. **We must not do this** for very good reasons:

- any link from `www.gov.uk` to a matching domain would have a URL parameter automatically added to it e.g. `https://something.service.gov.uk/?_ga=23.32423234.213.1.2213`. This could interfere with that site's own analytics.
- the client ID might be reset.

Once the changes to the linker configuration have been deployed a performance analyst will need to check that everything is working correctly. Since static PRs can take upwards of half an hour to pass CI tests, it's worth having a revert PR ready early on just in case.
