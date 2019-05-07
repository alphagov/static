## Global banner

A site-wide banner can be activated to convey important information on GOV.UK which is not deemed emergency level information.
The file `app/views/notifications/_global_bar.html.erb` contains the necessary minified JS and markup to activate and render the banner.

### Activating the global banner

In `app/views/notifications/_global_bar.html.erb`

1. Update the variables `title`, `information`, `link_href` and `link_text` with the relevant info.
2. Update the `show_global_bar` variable to `true`
3. Deploy static

![screenshot](/doc/global-banner.png?raw=true)

If you are in the production environment, once the origin cache is purged the CDN cache will be purged automatically.
This will clear cache for the top 10 most visited pages.

### The banner is not showing / not clearing!
Usually this is because the caching has not cleared properly. This can be at various points in our stack as well as locally in your browser. Things to try:

* Make sure you are actually looking at a page on the environment you released the banner. Remember to use the equivalent page for the environment (often staging) on which you are testing/releasing the banner.
* Test the page with curl to circumvent any browser-based caching. Chrome seems to aggressively cache on occasion. You can also test in a private browser instance.
* Clear the caches using these Rake tasks
#### Integration
  - [frontend memcache](https://deploy.integration.publishing.service.gov.uk/job/clear-frontend-memcache/)
  - [template](https://deploy.integration.publishing.service.gov.uk/job/clear-template-cache/)
  - [varnish](https://deploy.integration.publishing.service.gov.uk/job/clear-varnish-cache/)

  #### Staging
  - [frontend memcache](https://deploy.blue.staging.govuk.digital/job/clear-frontend-memcache/)
  - [template](https://deploy.blue.staging.govuk.digital/job/clear-template-cache/)
  - [varnish](https://deploy.blue.staging.govuk.digital/job/clear-varnish-cache/)

  #### ⚠️ Production ⚠️ 
  - [frontend memcache](https://deploy.blue.production.govuk.digital/job/clear-frontend-memcache/)
  - [template](https://deploy.blue.production.govuk.digital/job/clear-template-cache/)
  - [varnish](https://deploy.blue.production.govuk.digital/job/clear-varnish-cache/)

### Removing the global banner
In `app/views/notifications/_global_bar.html.erb`

1. Update the show_global_bar variable to false
2. Deploy static
